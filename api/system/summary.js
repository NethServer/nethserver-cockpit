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

        getKernelRelease: function () {
            return cockpit.spawn(["/usr/bin/uname", "-r"]);
        },

        getOS: function () {
            var fh = cockpit.file("/etc/nethserver-release");
            return fh.read().always(function () {
                fh.close();
            });
        },

    };
})(nethserver);
