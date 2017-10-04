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

(function(ns, $){

var NSEVENT_PREFIX = 'nsevent-';
var NSEVENT_MATCH = /^nsevent-/;

function EventMonitor() {
    var self = this;
    self.handlers = [];
    self.units = {};
    self.manager = cockpit.dbus('org.freedesktop.systemd1').
        proxy('org.freedesktop.systemd1.Manager', '/org/freedesktop/systemd1');
    self.progress = 0.0;
    self.fakeProgressInterval = null;

    function dispatchUnitEvent(eventType, unit, uName) {
        if( ! unit.valid) {
            console.log(unit.path + ' is still not ready');
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
            self.progress = 0.0;
            self.dispatchEvent('nsevent.progress', {
                'unitName': uName,
                'progress': self.progress,
                'title': 'event title',
                'message': 'event message',
            });
            self.fakeProgressInterval = setInterval(function(){
                self.progress += 0.02;
            }, 1000);
        }
        return unit;
    }

    function addUnitWatch(uPath, uName) {
        var unit = self.manager.client.proxy('org.freedesktop.systemd1.Service', uPath);
        unit.addEventListener('changed', function(ev, properties) {
            dispatchUnitEvent('changed', unit, uName);
        });
        return Promise.resolve(unit.wait().then(function() {
            return unit;
        }));
    }

    function updateUnitState(eventType, uPath, uName) {
        if( ! (uPath in self.units)) {
            self.units[uPath] = addUnitWatch(uPath, uName);
        }

        self.units[uPath].then(function(unit){
            dispatchUnitEvent(eventType, unit, uName);
        });
    }

    // Bind event listeners: unit creation and removal
    this.manager.addEventListener('UnitNew', function(ev, uName, uPath) {
        if(uName.match(NSEVENT_MATCH) !== null) {
            updateUnitState('created', uPath, uName);
        }
    });
    this.manager.addEventListener('UnitRemoved', function(ev, uName, uPath) {
        if(uName.match(NSEVENT_MATCH) !== null) {
            updateUnitState('removed', uPath, uName);
        }
    });

}

EventMonitor.prototype.wait = function() {
    var self = this;
    return Promise.resolve(self.manager.wait().then(function(){
        return self;
    }));
};

EventMonitor.prototype.getNextEventName = function() {
    return Promise.resolve(cockpit.spawn(['uuidgen'], {
            superuser: 'require',
            err: 'message'
        })).then(function(data) {
            return NSEVENT_PREFIX + data.trim();
        });
};

/**
 * The EventMonitor object implements an EventTarget-like interface
 */
ns.eventMonitor = new EventMonitor();
cockpit.event_target(ns.eventMonitor);

/**
 * Calls signal-event:
 * @return {Promise}
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

})(nethserver, jQuery);
