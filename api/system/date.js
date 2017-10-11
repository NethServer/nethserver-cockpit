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
    /**
     * @name ns
     * @alias nethserver
     */

    // Avoid double-inclusion from sub frames
    if(ns.system.date) {
        return;
    }

    function getSystemTimeZone () {
        var timedated = cockpit.dbus("org.freedesktop.timedate1").proxy("org.freedesktop.timedate1", "/org/freedesktop/timedate1");
        return Promise.resolve(timedated.wait()).then(function(){
            var tz = String(timedated.Timezone);
            timedated.client.close();
            return tz;
        });
    }

    function setSystemTimeZone (tz) {
        var timedated = cockpit.dbus("org.freedesktop.timedate1", {'superuser': 'try'}).proxy("org.freedesktop.timedate1", "/org/freedesktop/timedate1");
        return Promise.resolve(timedated.wait()).then(function(){
            return Promise.resolve(timedated.SetTimezone(tz, false).always(function(){
                timedated.client.close();
            }));
        });
    }

    /**
     * An object representing the current system date and time string, time zone
     * and current time source settings
     *
     * @typedef DateSettings
     * @param {string} DateTime - A string representation of the current local date and time, like "YYYY-MM-DD HH:mm"
     * @param {string} TimeZone - The system time zone. Valid values are returned by getTimeZones()
     * @param {string|boolean} NTPServer - The NTP server host name or false, if NTP is disabled
     *
     * @see {@link #getTimeZones}
     */

    ns.system.date = {
        /**
         * Get the date settings
         *
         * @see {@link #DateSettings}
         * @return {Promise.<DateSettings>} the current date settings object
         */
        getDate: function () {
            var o = {};
            return getSystemTimeZone().then(function(tz){
                o.TimeZone = tz;
                return nethserver.getDatabase('configuration').open();
            }).then(function(db){
                if(db.getProp('chronyd', 'status') == 'enabled') {
                    o.NTPServer = db.getProp('chronyd', 'NTPServer');
                } else {
                    o.NTPServer = false;
                }
            }).then(function(){
                return cockpit.spawn(['date', '+%F %H:%M'], {environ: ['LANG=C', 'TZ=' + o.TimeZone], err: 'message'});
            }).then(function(value) {
                o.DateTime = value;
                return o;
            });
        },

        /**
         * Change the date settings
         *
         * @see {@link #DateSettings}
         * @param {DateSettings} o -
         * @return {Promise} - successful if the given object is valid, failed if a validation error occurs
         */
        setDate: function (o) {
            // validate the given input, by checking the date command exit code
            var validatedTimeString;

            return Promise.resolve(cockpit.spawn(['date', '-d', o.DateTime, '+%m%d%H%M%Y'], {environ: ['LANG=C', 'TZ=' + o.TimeZone], err: 'message'})).
                then(function(timeString){
                    validatedTimeString = timeString.trim();
                    return setSystemTimeZone(o.TimeZone);
                },function(err){
                    throw new ns.Error({
                        'type': 'NotValid',
                        'id': 1507729861356,
                        'message': err.message,
                    });
                }).then(function(){
                    return nethserver.getDatabase('configuration').open();
                }).then(function(db){
                    if(o.NTPServer !== false) {
                        db.setProp('chronyd', 'NTPServer', o.NTPServer);
                        db.setProp('chronyd', 'status', 'enabled');
                    } else {
                        db.setProp('chronyd', 'status', 'disabled');
                    }
                    return db.save();
                }).then(function(db){
                    nethserver.signalEvent('nethserver-ntp-save', validatedTimeString);
                });
        },

        /**
         * Time zones list supported by the system
         *
         * @see {@link #DateSettings}
         * @return {Promise.<string[]>} An array of available time zone strings
         */
        getTimeZones: function () {
            return Promise.resolve(cockpit.spawn(["/usr/bin/timedatectl", "list-timezones"])).then(function(output){
                return output.split("\n");
            });
        },

    };
})(nethserver);
