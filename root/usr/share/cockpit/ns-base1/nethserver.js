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
    nethserver.signalEvent = function (esEvent) {
        var args = ['systemd-run', '--service-type', 'simple', '/sbin/e-smith/signal-event'];
        args.push.apply(args, Array.prototype.slice.call(arguments));
        var taskProgress = {
            'event': esEvent,
            'args': args.slice(3),
            'exitCode': null,
            'unitName': null,
            'message': null,
            'progress': null,
            'status': null,
        };

        function notifyTaskProgress() {
            $(document).trigger('taskprogress.nethserver', [taskProgress]);
        };

        function waitEvent(unitName, dfr) {
            var client = cockpit.dbus('org.freedesktop.systemd1');
            taskProgress = $.extend({}, taskProgress, {
                unitName: unitName,
                progress: 0.0,
                message: '',
                status: 'starting'
            });
            dfr.notify(esEvent + ' starting');

            // A failed service unit remains on filesystem: we can query its
            // properties at any time.
            // A running unit can send properites change events, too.
            client.call('/org/freedesktop/systemd1', 'org.freedesktop.systemd1.Manager', 'GetUnit', [unitName]).
                done(function(unitPath){
                    client.proxy('org.freedesktop.systemd1.Service', unitPath).addEventListener('changed', function(ev, properties){
                        if(properties.Result === 'exit-code') {
                            client.close();
                            taskProgress = $.extend({}, taskProgress, {
                                progress: 1.0,
                                message: '',
                                status: 'failed',
                                exitCode: properties.ExecMainStatus
                            });
                            dfr.reject(esEvent + ' failed');
                        }
                    });
                });

            // Successful service unit is removed automatically. Here we catch
            // the UnitRemoved event, in case it completes before properites event handler
            // is ready to receive events.
            client.subscribe({
                'interface': 'org.freedesktop.systemd1.Manager',
                'path': '/org/freedesktop/systemd1',
                'member': 'UnitRemoved',
            }, function(path, interface_, signal, args) {
                if($.isArray(args) && args[0] === unitName) {
                    taskProgress = $.extend({}, taskProgress, {
                        progress: 1.0,
                        message: '',
                        status: 'success',
                        exitCode: 0
                    });
                    client.close();
                    dfr.resolve();
                }
            });

        };

        return $.Deferred(function(dfr){
            var process = cockpit.spawn(args, {
                superuser: 'require',
                err: 'message'
            }).
                done(function(out, err){
                    // Sample err contents: "Running as unit run-12915.service.\n"
                    var matches = err.match(/^Running as unit (run-\d+\.service)\./);
                    if($.isArray(matches)) {
                        waitEvent(matches[1], dfr);
                    } else {
                        dfr.reject(err);
                    }
                }).
                fail(function(ex){
                    dfr.reject(ex.message);
                }).
                always(function(){
                    process.close();
                });
        }).
            then(notifyTaskProgress, notifyTaskProgress, notifyTaskProgress).
            promise();
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


