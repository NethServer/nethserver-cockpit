/*
 * Copyright (C) 2017 Nethesis S.r.l.
 * http://www.nethesis.it - nethserver@nethesis.it
 *
 * This script is part of NethServer.
 *
 * NethServer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License,
 * or any later version.
 *
 * NethServer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with NethServer.  If not, see COPYING.
 */

(function(ns){

// Avoid double-inclusion from sub frames
if(ns.eventMonitor) {
    return;
}

var NSEVENT_PREFIX = 'nsevent-';
var NSEVENT_MATCH = /^nsevent-/;

/**
 * An object of type TaskCompleted is attached to a CustomEvent as "detail"
 *
 * @typedef {Object} TaskCompleted
 * @param {String} unitName the systemd unit name where the event was run
 * @param {Number} exitCode exit code of the signal-event command
 * @param {Number} mainPid the process PID number
 */

/**
 * An object of type TaskProgress is attached to a CustomEvent as "detail"
 *
 * @typedef {Object} TaskProgress
 * @param {String} unitName the systemd unit name where the event was run
 * @param {Number} progress A number between 0 and 1 (percent of task completion)
 * @param {String} title The title of the running task
 * @param {String} message Last message emitted by the task
 */

/**
 * The EventMonitor object implements the EventTarget interface as defined by
 * DOM. You don't need to create an instance of this class: the "nethserver"
 * namespace has a singleton instance of this class.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget|EventTarget}
 * @constructor
 * @name nethserver.EventMonitor
 * @protected
 */
function EventMonitor() {
    var self = this;
    self.handlers = [];
    self.units = {};
    self.isSystemdReloading = false;
    self.manager = cockpit.dbus('org.freedesktop.systemd1').
        proxy('org.freedesktop.systemd1.Manager', '/org/freedesktop/systemd1');
    self.progress = 0.0;
    self.fakeProgressInterval = null;

    function dispatchUnitEvent(eventType, unit, uName) {
        if( ! unit.valid) {
            console.warn(unit.path + ' is still not ready');
        } else if(eventType == 'removed' && unit.Result == 'success') {
            self.dispatchEvent('nsevent.succeeded', {
                'unitName': uName,
                'exitCode': unit.ExecMainCode,
                'mainPid': unit.ExecMainPID,
            });
            if(self.fakeProgressInterval) {
                clearInterval(self.fakeProgressInterval);
                self.fakeProgressInterval = null;
            }
        } else if(unit.Result == 'exit-code') {
            self.dispatchEvent('nsevent.failed', {
                'unitName': uName,
                'exitCode': unit.ExecMainCode,
                'mainPid': unit.ExecMainPID,
            });
            if(self.fakeProgressInterval) {
                clearInterval(self.fakeProgressInterval);
                self.fakeProgressInterval = null;
            }
        } else if(eventType == 'created') {
            var fakeProgressWorker = function () {
                if(self.progress < 1.0) {
                    self.progress += 0.02;
                    self.dispatchEvent('nsevent.progress', {
                        'unitName': uName,
                        'progress': self.progress,
                        'title': 'event title',
                        'message': 'event message',
                    });
                } else {
                    clearInterval(self.fakeProgressInterval);
                    self.fakeProgressInterval = null;
                    self.progress = 0.0;
                }
            };
            self.progress = 0.0;
            self.fakeProgressInterval = setInterval(fakeProgressWorker, 750);
            fakeProgressWorker(); // send a message immediately
        }
    }

    function addUnitWatch(uPath, uName) {
        var unit = self.manager.client.proxy('org.freedesktop.systemd1.Service', uPath);
        unit.addEventListener('changed', function(ev, properties) {
            dispatchUnitEvent('changed', unit, uName);
        });
        return Promise.resolve(unit.wait()).then(function() {
            return unit;
        });
    }

    function updateUnitState(eventType, uPath, uName) {
        if( ! (uPath in self.units)) {
            self.units[uPath] = addUnitWatch(uPath, uName);
        }

        self.units[uPath].then(function(unit){
            dispatchUnitEvent(eventType, unit, uName);
            return unit;
        });
    }

    // Bind event listeners: unit creation and removal
    this.manager.addEventListener('Reloading', function(ev, active) {
        self.isSystemdReloading = active;
    });
    this.manager.addEventListener('UnitNew', function(ev, uName, uPath) {
        if(self.isSystemdReloading === false && uName.match(NSEVENT_MATCH) !== null) {
            updateUnitState('created', uPath, uName);
        }
    });
    this.manager.addEventListener('UnitRemoved', function(ev, uName, uPath) {
        if(self.isSystemdReloading === false && uName.match(NSEVENT_MATCH) !== null) {
            updateUnitState('removed', uPath, uName);
        }
    });

}

/**
 * Waits until the object is ready to dispatch events
 * @function
 * @name nethserver.EventMonitor.wait
 * @return {Promise} resolved when the object is ready
 */
EventMonitor.prototype.wait = function() {
    var self = this;
    return Promise.resolve(self.manager.wait().then(function(){
        return self;
    }));
};

/**
 * Generates a random event name
 * @function
 * @private
 * @name nethserver.EventMonitor.getNextEventName
 * @return {Promise.<String>} the generated random event name
 */
EventMonitor.prototype.getNextEventName = function() {
    return Promise.resolve(cockpit.spawn(['uuidgen'], {
            superuser: 'require',
            err: 'message'
        })).then(function(data) {
            return NSEVENT_PREFIX + data.trim();
        });
};

/**
 * This is a singleton instance of EventMonitor
 * @see {@link #EventMonitor}
 * @name nethserver.eventMonitor
 * @instance
 */
ns.eventMonitor = new EventMonitor();

/**
 * Attach a callback to the EventMonitor object
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener}
 * @see {@link #TaskProgress}
 * @see {@link #TaskCompleted}
 * @function
 * @name nethserver.EventMonitor.addEventListener
 * @param {String} eventName - actually "nsevent.succeeded", "nsevent.failed", "nsevent.progress"
 * @param {EventListener} eventListener
 * @example
 * nethserver.eventMonitor.addEventListener('nsevent.succeeded', handler);
 * nethserver.eventMonitor.addEventListener('nsevent.failed', handler);
 * nethserver.eventMonitor.addEventListener('nsevent.progress', handler);
 */
cockpit.event_target(ns.eventMonitor);

/**
 * The standard DOM CustomEvent object
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent}
 * @typedef {Event} CustomEvent
 * @param {String} type - the event type identifier
 * @param {TaskCompleted|TaskProgress} detail - an object with the event details
 */

/**
 * This is an event listener callback definition, specified by DOM EventTarget
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget}
 * @see {@link #TaskProgress}
 * @see {@link #TaskCompleted}
 * @callback EventListener
 * @param {CustomEvent} ev
 */

/**
 * Call signal-event command with given arguments
 * @function
 * @name nethserver.signalEvent
 * @see {@link #TaskCompleted}
 * @param {String} nsEvent event name
 * @param {Array} [args=[]] event arguments
 * @return {Promise.<TaskCompleted|String>}
 */
ns.signalEvent = function (nsEvent, args) {
    if( ! Array.isArray(args)) {
        args = [];
    } else {
        args = args.slice();
    }

    var unitName;
    var handlers;

    function handlersCleanup() {
        ns.eventMonitor.removeEventListener('nsevent.succeeded', handlers[0]);
        ns.eventMonitor.removeEventListener('nsevent.failed', handlers[1]);
    }

    return new Promise(function(fulfill, reject) {
        handlers = [function(ev){
            fulfill(ev);
        }, function(ev) {
            reject(ev.detail.unitName);
        }];
        ns.eventMonitor.addEventListener('nsevent.succeeded', handlers[0]);
        ns.eventMonitor.addEventListener('nsevent.failed', handlers[1]);
        ns.eventMonitor.getNextEventName().then(function(unitName) {
            ns.eventMonitor.wait().then(function(){
                var socketPath = '/var/run/ptrack/%h.sock'.replace('%h', Crypto.MD5(unitName).substr(0, 16));
                var dumpPath = "/var/spool/ptrack/%h.dump".replace('%h', Crypto.MD5(socketPath).substr(0, 16));
                args.unshift('/usr/bin/systemd-run', '--uid', 'srvmgr', '--gid', 'srvmgr', '--unit', unitName,
                    '/usr/libexec/nethserver/ptrack', '-s', socketPath, '-d', dumpPath, '--',
                    '/usr/bin/sudo', '/sbin/e-smith/signal-event', nsEvent);
                cockpit.spawn(args, {
                        superuser: 'require',
                        err: 'message'
                    }).fail(function(ex, data){
                        reject(ex.message);
                    });
            });
        });
    }).then(function(ev) {
        handlersCleanup();
        return ev;
    }, function(ev) {
        handlersCleanup();
        throw new Error(ev);
    });
};

})(nethserver);
