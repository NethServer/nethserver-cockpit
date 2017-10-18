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
    if(ns.system.hostname) {
        return;
    }
    /**
     * @namespace
     * @alias nethserver.system.hostname
     */
    ns.system.hostname = {
        /**
         * Retrieve the static host by reading /etc/hostname
         * @return {Promise} Contents of file /etc/hostname
         */
        getFQDN: function () {
            return Promise.resolve(cockpit.file("/etc/hostname", {syntax: ns.syntax.trimWhitespace}).read());
        },
        /**
         * Set the system host name FQDN
         *
         * @param {String} hostname the new host name
         * @return {Promise}
         */
        setFQDN: function (hostname) {
            var client = cockpit.dbus('org.freedesktop.hostname1', {
                'superuser': 'require'
            });

            return Promise.resolve(client.wait()).
            then(function () {
                return Promise.resolve(client.call('/org/freedesktop/hostname1', 'org.freedesktop.hostname1', 'SetStaticHostname', [hostname, false]));
            }).
            then(function(){
                client.close();
                nethserver.signalEvent('hostname-modify');
            }).
            catch(function(ex){
                client.close();
                throw ex;
            });
        },
        /**
         * Get the short host name (FQDN without the domain suffix)
         *
         * @return {Promise.<string>}
         * @see {@link #getFQDN} {@link #getDomainName}
         */
        getSystemName: function() {
            return ns.system.hostname.getFQDN().
            then(function(fqdn){
                return fqdn.substr(0, fqdn.indexOf('.'));
            });
        },
        /**
         * Get the host name domain part (FQDN without the first label)
         *
         * @return {Promise.<string>}
         * @see {@link #getFQDN} {@link #getSystemName}
         */
        getDomainName: function() {
            return ns.system.hostname.getFQDN().
            then(function(fqdn){
                return fqdn.substr(fqdn.indexOf('.') + 1);
            });
        }
    };
})(nethserver);
