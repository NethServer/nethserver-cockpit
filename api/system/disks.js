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
    if(ns.system.disks) {
        return;
    }

    /**
     * @namespace
     * @alias nethserver.system.disks
     */
    ns.system.disks = {
        /**
         * Retrieve the json data in /var/cache/duc/duc.json
         *
         * @return {Promise} from cockpit.file
         */
        getJSONUsage: function () {
            var fh = cockpit.file("/var/cache/duc/duc.json", {
                syntax: nethserver.syntax.trimWhitespace
            });
            return fh.read().always(function () {
                fh.close();
            });
        },
        /**
         * Get date of last updated of disk usage
         * @return {Promise.<String>} a promise with the date formatted in UTC time zone
         */
        getUpdatedUsage: function () {
            return cockpit.spawn(['stat', '-c', '%Z', '/var/cache/duc/duc.json']).then(function(val) {
                var d = new Date(val*1000);
                return d.toLocaleDateString('en-US', { timeZone: 'UTC' }) + " " + d.toLocaleTimeString('en-US', { timeZone: 'UTC', timeZoneName: 'short' });
            });
        },
        /**
         * Launch update of disk usage using duc
         * @return {Promise.<Event>} a promise of nethserver-duc-save event, at the end the UI should call again getJSONUsage and getUpdatedUsage
         */
        updateJSONUsage: function () {
            return nethserver.signalEvent('nethserver-duc-save');
        },
    };
})(nethserver);
