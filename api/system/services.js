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

(function(nethserver){
    // Avoid double-inclusion from sub frames
    if(nethserver.system.services) {
        return;
    }
    /**
     * @namespace
     */
    nethserver.system.services = {

        /**
         * Return the list of services
         *
         * @example
         * nethserver.system.services.getAllServices().then(function(services) {
         *     // services format
         *     [
         *       ...
         *       {
         *         "description": "DNS caching server.",
         *         "name": "dnsmasq",
         *         "ports": {
         *           "TCP": [ "53", "67" ]
         *           "UDP": [ "53", "67", "69" ]
         *         },
         *         "props": {
         *           ...
         *           "access": "green",
         *           "dhcp-boot": "",
         *           ...
         *         },
         *         "running": 1,
         *         "status": 1
         *     },
         *     ...
         *   ]
         *
         * @return {Promise} a promise with the list of services
         *
        */
        getAllServices: function () {
            return Promise.resolve(
                cockpit.spawn(['/usr/libexec/nethserver/cockpit-list-services'])
            ).then(function(val) {
                return JSON.parse(val);
            });
        },

        /**
         * Enable the given service
         *
         * @param {String} service - Service name
         * @return {Promise} a Cockpit promise
         */
        enableService: function (service) {
            return cockpit.spawn(['/usr/libexec/nethserver/cockpit-control-service', service, 'enable']);
        },

        /**
         * Enable the given service
         *
         * @param {String} service - Service name
         * @return {Promise} a Cockpit promise
         */
        disableService: function (service) {
            return cockpit.spawn(['/usr/libexec/nethserver/cockpit-control-service', service, 'disable']);
        },

        /**
         * Start the given service
         *
         * @param {String} service - Service name
         * @return {Promise} a Cockpit promise
         */
        startService: function (service) {
            return cockpit.spawn(['/usr/libexec/nethserver/cockpit-control-service', service, 'start']);
        },

        /**
         * Stop the given service
         *
         * @param {String} service - Service name
         * @return {Promise} a Cockpit promise
         */
        stopService: function (service) {
            return cockpit.spawn(['/usr/libexec/nethserver/cockpit-control-service', service, 'stop']);
        },

        /**
         * Restart the given service
         *
         * @param {String} service - Service name
         * @return {Promise} a Cockpit promise
         */
        restartService: function (service) {
            return cockpit.spawn(['/usr/libexec/nethserver/cockpit-control-service', service, 'restart']);
        },

    };
})(nethserver);
