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

/*
 * Exec a signal event action:
 */
ns.signalEvent = function (nsEvent, args) {
    if( ! Array.isArray(args)) {
        args = [];
    } else {
        args = args.slice();
    }
    args.unshift('systemd-run', '/sbin/e-smith/signal-event', nsEvent);

    var unitName = 'unknown';
    var client = cockpit.dbus('org.freedesktop.systemd1');
    var manager = client.proxy('org.freedesktop.systemd1.Manager', '/org/freedesktop/systemd1');

    var progressCallback = function(taskProgress) {};

    var taskProgress = {
        'event': nsEvent,
        'args': args.slice(3),
        'exitCode': null,
        'unitName': null,
        'message': null,
        'progress': null,
        'status': null,
    };

    var prom = new Promise(function(fulfill, reject){
        manager.wait(initHandlers).done(spawnUnit);

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
                    progressCallback(taskProgress);
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
                    fulfill();
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
            progressCallback(taskProgress);

            args.splice(1, 0, '--unit', unitName);

            var process = cockpit.spawn(args, {
                superuser: 'require',
                err: 'message'
            }).
                fail(function(ex){
                    reject(ex.message);
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
                fail(function(ex){
                    throw ex;
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
                progressCallback(taskProgress);
                reject(new Error(unitName + ' exit with non-zero code'));
            } else {
                // Still waiting, ignore...
            }
        }

    });

    return prom.then(function(){
            client.close();
        });
};

})(nethserver, jQuery);
