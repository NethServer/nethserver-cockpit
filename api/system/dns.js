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

(function (nethserver) {
    // Avoid double-inclusion from sub frames
    if(nethserver.system.dns) {
        return;
    }

    function addRecord(host, type) {
        var db = nethserver.getDatabase('hosts');
        var key = host.key;
        return db.open().then(function() {
            if (db.keys().indexOf(key) > -1) {
                throw new nethserver.Error({
                    type: 'NotValid',
                    message: 'This hostname is already used',
                    attribute: 'key',
                    id: 1507726223244
                });
            }
            host.type = type;
            db.setObject(host);
            return db.save();
        }).then(function(){
            nethserver.signalEvent('host-create', key);
        });
    }

    function editRecord(host, type) {
        var db = nethserver.getDatabase('hosts');
        var key = host.key;
        return db.open().then(function() {
            if (db.keys().indexOf(key) < 0) {
                throw new Error("NotFound", "Host not found");
            }
            host.type = 'remote';
            db.setObject(host);
            return db.save();
        }).then(function(){
            nethserver.signalEvent('host-modify', key);
        });
    }

    function deleteRecord(hostKey) {
        var db = nethserver.getDatabase('hosts');
        return db.open().then(function() {
            if (db.keys().indexOf(hostKey) < 0) {
                throw new Error("NotFound", "Host not found");
            }
            db.delete(hostKey);
            return db.save();
        }).then(function(){
            nethserver.signalEvent('host-delete', hostKey);
        });
    }

    function getAllRecords(type) {
        var ret = [];
        var db = nethserver.getDatabase('hosts');
        return db.open().then(function() {
            var keys = db.keys();
            for (var k in keys) {
                var o = db.getObject(keys[k]);
                if (o.type == type) {
                    ret.push(o);
                }
            }
            return ret;
        });
    }

    function getRecord(hostKey) {
        var db = nethserver.getDatabase('hosts');
        return db.open().then(function() {
             return db.getObject(hostKey);
        });
    }


    nethserver.system.dns = {

        /**
         * Return an array of remote host records.
         * @see getRemoteHost for record format
         *
         * @example
         * var hosts = nethserver.system.dns.getAllRemoteHosts().then(function() {
         *   // do something
         * }, function (err) {
         *    console.error(err);
         * });

         *
         * @return {Promise.<Array>} - A promise with an array of remote host records
         */
        getAllRemoteHosts: function() {
            return getAllRecords('remote');
        },

        /**
         * Return an array of DNS alias records.
         * @see getNameAlias for record format
         *
         * @example
         * var hosts = nethserver.system.dns.getAllNameAliases().then(function() {
         *   // do something
         * }, function (err) {
         *    console.error(err);
         * });

         *
         * @return {Promise.<Array>} - A promise with an array of DNS alias records
         */
        getAllAliases: function() {
            return getAllRecords('self');
        },


        /**
         * Return the remote host record associated to the given key
         *
         * @example
         * // Record format
         * {
         *   key: "myhost.domain.org",
         *   type: "remote",
         *   IpAddress: "192.168.1.22",
         *   Description: "My remote host"
         * }
         *
         * @param {String} hostKey - Host name to search
         *
         * @return {Promise.<Host>} - If hostKey is found, return a promise with a remote host record, throws an error otherwise.
         */
        getRemoteHost: function (hostKey) {
            return getRecord(hostKey);
        },

        /**
         * Return the alias host record associated to the given key
         *
         * @example
         * // Record format
         * {
         *   key: "myalias.domain.org",
         *   type: "self",
         *   Description: "My alias name"
         * }
         *
         * @param {String} hostKey - Host name to search
         * @return {Promise.<Alias>} - If hostKey is found, return a promise with an alias record, throws an error otherwise.
         */
        getAlias: function (hostKey) {
            return getRecord(hostKey);
        },


        /**
         * Add a DNS record pointing to an IP address
         *
         * @example
         * nethserver.system.dns.addRemotHost({key: "myhost.domain.org", IpAddress: "192.168.1.22", Description: "my PC"}).then(function() {
         *   // do something
         * }, function (err) {
         *    console.error(err);
         * });
         *
         *
         * @param {Object} host - DNS record to be added
         * @param {string} host.key - Host name in FQDN format
         * @param {string} host.IpAddress - Local or remote IP address
         * @param {string} [host.Description] - Optional description
         * @return {Promise.<DB>} On succes a promise with a db object, throws an error otherwise.
         */
        addRemoteHost: function(host) {
            return addRecord(host, 'remote');
        },

        /**
         * Edit an existing DNS record pointing to an IP address
         *
         * @example
         * nethserver.system.dns.editRemotHost({key: "myhost.domain.org", IpAddress: "192.168.1.22", Description: "my PC"}).then(function() {
         *   // do something
         * }, function (err) {
         *    console.error(err);
         * });
         *
         *
         * @param {Object} host - DNS record to be added
         * @param {string} host.key - Host name in FQDN format
         * @param {string} host.IpAddress - Local or remote IP address
         * @param {string} [host.Description] - Optional description
         * @return {Promise.<DB>} On succes a promise with a db object, throws an error otherwise.
         */
        editRemoteHost: function(host) {
            return editRecord(host, 'remote');
        },

        /**
         * Delete existing DNS record pointing to an IP address
         *
         * @example
         * nethserver.system.dns.deleteRemoteHost('myhost.domain.org').then(function () {
         *   // do something
         * }, function (err) {
         *    console.error(err);
         * });
         *
         *
         * @param {Object} hostKey - host name to be deleted
         * @return {Promise.<DB>} On succes a promise with a db object, throws an error otherwise.
         */
        deleteRemoteHost: function(hostKey) {
            return deleteRecord(hostKey);
        },

        /**
         * Add a DNS alias record pointing to 127.0.0.1
         *
         * @example
         * nethserver.system.dns.addAlias({id: "myalias.domain.org", "Description": "my secondary name"})
         *
         * @param {Object} alias - DNS host name
         * @param {string} alias.key - Host name in FQDN format
         * @param {string} alias.Description - Optional description
         * @returns {Promise.<DB>} On success a promise with a db object, otherwise throws an error
         */
        addAlias: function(alias) {
            return addRecord(alias, 'self');
        },

        /**
         * Edit an existing DNS alias record
         *
         * @example
         * nethserver.system.dns.editAlias({id: "myalias.domain.org", "Description": "my third name"}).then(function () {
         *   // do something
         * }, function (err) {
         *    console.error(err);
         * });
         *
         *
         * @param {Object} alias - DNS host name
         * @param {string} alias.key - Host name in FQDN format
         * @param {string} alias.Description - Optional description
         * @returns {Promise.<DB>} On success a promise with a db object, otherwise throws an error
         */
        editAlias: function(alias) {
            return editRecord(alias, 'self');
        },

        /**
         * Delete an existing DNS alias record
         *
         * @example
         * nethserver.system.dns.deleteAlias('myalias.domain.org').then(function () {
         *   // do something
         * }, function (err) {
         *    console.error(err);
         * });
         *
         *
         * @param {Object} hostKey - host name to be deleted
         * @return {Promise.<DB>} On succes a promise with a db object, throws an error otherwise.
         */
        deleteAlias: function(hostKey) {
            return deleteRecord(hostKey);
        },

        /**
         * Set upstream DNS servers by updating "NameServers" property inside "dns" key
         *
         * @example
         * nethserver.system.dns.setDns(['1.2.3.4','5.6.7.8']).then(function () {
         *   // do something
         * }, function (err) {
         *    console.error(err);
         * });
         *
         *
         * @param {Array} dnsServers - Array of DNS IP addresses
         * @return {Promise.<DB>} On succes a promise with a db object, throws an error otherwise.
         */
        setDns: function(dnsServers) {
            var db = nethserver.getDatabase('configuration');
            return db.open().then(function() {
                db.setProp('dns', 'NameServers', dnsServers.join(','));
                return db.save();
            }).then(function(){
                nethserver.signalEvent('nethserver-hosts-save');
            });
        },

        /**
         * Get a list of configured upstream DNS servers: "NameServers" property inside "dns" key
         *
         * @example
         * nethserver.system.dns.getDns().then(function (val) {
         *   // do something with val
         * }, function (err) {
         *    console.error(err);
         * });
         *
         * @param {Array} dnsServers - Array of DNS IP addresses
         * @return {Promise.<DB>} On succes a promise with a db object, throws an error otherwise.
         */
        getDns: function() {
            var db = nethserver.getDatabase('configuration');
            return db.open().then(function() {
                return db.getProp('dns', 'NameServers').then(function(val) {
                    return val.split(',');
                });
            });
        }


    };
})(nethserver);
