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
    if(ns.system.summary) {
        return;
    }
    /**
     * @namespace
     * @alias nethserver.system.summary
     */
    ns.system.summary = {
        /**
         * Retrieve the static host by reading /etc/hostname
         * @deprecated
         * @return {Promise}
         */
        getHostname: ns.system.hostname.getFQDN,

        /**
         * Set the system host name
         * @deprecated
         * @param {String} hostname the new host name
         * @param {Bool} [runEvent=true] signalEvent(hostname-modify)
         * @return {Promise}
         */
        setHostname: ns.system.hostname.setFQDN,

        getHardware: function () {
            return $.Deferred(function (dfr) {
                cockpit.spawn(["grep", "\\w", "sys_vendor", "product_name"], {
                    directory: "/sys/devices/virtual/dmi/id",
                    err: "ignore"
                }).
                done(function (fields) {
                    fields = nethserver.syntax.grepToObject.parse(fields);
                    dfr.resolve(fields.sys_vendor + " " + fields.product_name);
                }).
                fail(function () {
                    dfr.reject();
                });
            });
        },

        getMachineId: function () {
            var fh = cockpit.file("/etc/machine-id", {
                syntax: nethserver.syntax.trimWhitespace
            });
            return fh.read().always(function () {
                fh.close();
            });
        },

        getKernelRelease: function () {
            return cockpit.spawn(["/usr/bin/uname", "-r"]);
        },

        getOS: function () {
            var fh = cockpit.file("/etc/nethserver-release");
            return fh.read().always(function () {
                fh.close();
            });
        },

        getNTPServer: function () {
            var db = nethserver.getDatabase('configuration');
            return db.open().then(function() {
                return db.getProp('chronyd', 'NTPServer');
            });
        },

        /**
         * Tell how the system clock is synchronized
         * @return {Promise.<string>} "ntp" or "manual"
         */
        getSystemTimeMode: function () {
            var db = nethserver.getDatabase('configuration');
            return db.open().then(function() {
                if(db.getProp('chronyd', 'status') == 'enabled') {
                    return 'ntp';
                }
                return 'manual';
            });
        },

        /**
         * Get the system time zone
         * @return {Promise.<string>} the current system time zone
         */
        getSystemTimeZone: function () {
            var timedated = cockpit.dbus("org.freedesktop.timedate1").proxy("org.freedesktop.timedate1", "/org/freedesktop/timedate1");
            return Promise.resolve(timedated.wait()).then(function(){
                var tz = String(timedated.Timezone);
                timedated.client.close();
                return tz;
            });
        },

        /**
         * Tell how the system clock is synchronized
         * @return {Promise.<string>}
         */
        getTimeZones: function () {
            return Promise.resolve(cockpit.spawn(["/usr/bin/timedatectl", "list-timezones"])).then(function(output){
                return output.split("\n");
            });
        },

        getSystemTime: function () {
            return Promise.resolve(cockpit.spawn(['date', '+%F %H:%M']));
        },

        setSystemTime: function (val) {
            return Promise.resolve(cockpit.spawn(['date', val])).then(function(){
                return nethserver.signalEvent('nethserver-ntp-save', val);
            });
        }
    };
})(nethserver);
