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

var nethserver = {};

(function($){

    nethserver.Syntax = {
        trimWhitespace: {
            parse: function(data) {
                return String(data).trim();
            },
            stringify: function(o) {
                throw new Error('Not implemented');
            }
        },
        grepToObject: {
            parse: function (output) {
                var ret = {};
                $.each(output.split("\n"), function (i, line) {
                    var pos = line.indexOf(":");
                    if (pos !== -1)
                        ret[line.substring(0, pos)] = line.substring(pos + 1);
                });
                return ret;
            },
            stringify: function(o) {
                throw new Error('Not implemented');
            }
        }
    };

    nethserver.followJournal = function(unitName) {
        return $.Deferred().

        promise();
    };

    /*
     * Exec a signal event action:
     */
    nethserver.signalEvent = function (nsEvent) {
        var args = ['systemd-run', '/sbin/e-smith/signal-event'];
        args.push.apply(args, Array.prototype.slice.call(arguments));
        var unitName = 'unknown';
        var client = cockpit.dbus('org.freedesktop.systemd1');
        var manager = client.proxy('org.freedesktop.systemd1.Manager', '/org/freedesktop/systemd1');
        var dfr = $.Deferred();
        var taskProgress = {
            'event': nsEvent,
            'args': args.slice(3),
            'exitCode': null,
            'unitName': null,
            'message': null,
            'progress': null,
            'status': null,
        };

        dfr.always(function(){ client.close(); });

        manager.wait(initHandlers).
            done(spawnUnit).
            fail(function(){
                dfr.reject('Failed to connect /org/freedesktop/systemd1 DBus object');
            });

        function initHandlers() {
            // Generate a unique event identifier:
            unitName = 'nsevent-' + parseInt(manager.NInstalledJobs) + '.service';

            manager.addEventListener('UnitNew', function(ev, uName, uPath) {
                if(uName === unitName) {
                    registerUnitChangeHandler();
                    taskProgress = $.extend({}, taskProgress, {
                        progress: 1.0,
                        message: '',
                        status: 'started',
                        exitCode: 0
                    });
                    dfr.notify(taskProgress);
                }
            });

            // Successful service unit is removed automatically. Here we catch
            // the UnitRemoved event, in case it completes before properties event handler
            // is ready to receive events.
            manager.addEventListener('UnitRemoved', function(ev, uName, uPath) {
                if(uName === unitName) {
                    taskProgress = $.extend({}, taskProgress, {
                        progress: 1.0,
                        message: '',
                        status: 'success',
                        exitCode: 0
                    });
                    dfr.resolve();
                }
            });

        }

        function spawnUnit() {
            taskProgress = $.extend({}, taskProgress, {
                unitName: unitName,
                progress: 0.0,
                message: '',
                status: 'starting'
            });
            dfr.notify(taskProgress);

            args.splice(1, 0, '--unit', unitName);

            var process = cockpit.spawn(args, {
                superuser: 'require',
                err: 'message'
            }).
                fail(function(ex){
                    dfr.reject(ex.message);
                }).
                always(function(){
                    process.close();
                });
        }

        function registerUnitChangeHandler() {

            // A failed service unit remains on filesystem: we can query its
            // properties at any time.
            // A running unit can send properties change events, too.
            manager.GetUnit(unitName).
                done(function(unitPath){
                    var serviceUnit = client.proxy('org.freedesktop.systemd1.Service', unitPath);
                    serviceUnit.wait(function() {
                        serviceUnit.addEventListener('changed', function(ev, properties) {
                            checkFailedUnit(properties);
                        });
                        checkFailedUnit(serviceUnit);
                    });
                }).
                fail(function(){
                    dfr.reject(unitName);
                });
        }

        function checkFailedUnit (properties) {
            if(properties.Result === 'exit-code') {
                taskProgress = $.extend({}, taskProgress, {
                    progress: 1.0,
                    message: '',
                    status: 'failed',
                    exitCode: properties.ExecMainStatus
                });
                dfr.reject(nsEvent + ' failed');
            } else {
                // Still waiting, ignore...
            }
        }

        return dfr.promise();
    };

    nethserver.Esdb = function() {

    };
    nethserver.Esdb.prototype = {
        get: function(key) {

        },
        getType: function(key) {

        },
        getProp: function(key, prop) {

        },
        set: function(key) {

        },
        setType: function(key, type) {

        },
        setProp: function(key, prop, value) {

        },
        setProps: function(key, props) {

        },
        delete: function(key) {

        },
        delProp: function(key, prop) {

        },
        delProps: function(key, props) {

        },
        keys: function() {

        }
    };
})(jQuery);


