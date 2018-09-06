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

/**
 * Function for Account providers
 *
 *
 * @namespace nethserver.system.provider
 */
(function(nethserver){
    // Avoid double-inclusion from sub frames
    if(nethserver.system.provider) {
        return;
    }

    var _ = cockpit.gettext;

    nethserver.system.provider = {

        /**
         * Probe LDAP configuration
         *
         * @example
         * nethserver.system.provider.probeLdap('1.2.3.4').then(function(config) {
         * //Output config
         *   {
         *      "BindDN" : "",
         *      "LdapURI" : "ldap://1.2.3.4:389",
         *      "StartTls" : "enabled",
         *      "BindType" : "anonymous",
         *      "UserDN" : "ou=People,dc=directory,dc=nh",
         *      "GroupDN" : "ou=Groups,dc=directory,dc=nh",
         *      "BindPassword" : "",
         *      "LdapUriDn" : "ldap:///dc%3Dlocal%2Cdc%3Dneth%2Cdc%3Deu",
         *      "BaseDN" : "dc=directory,dc=nh"
         *   }
         * })
         *
         * @param {String} host - LDAP host to contact
         * @param {Integer} [port] - LDAP port, default is 389
         *
         * @return {Promise} - A promise with a SSSD configuration on success, throws an error otherwise.
         * Errors: 'NotValid' if the host is unreachable, 'RuntimeError' if the host is not a valid LDAP server
         */
        probeLdap: function(host, port) {
            var p = port || 389;

            return nethserver.validate('ldap-probe', [host, p], {
                id: 1508163908911,
                type: 'NotValid',
                message: 'LDAP server unreachable'
            }).then(function() {
                return Promise.resolve(cockpit.spawn(['/usr/sbin/account-provider-test', 'probeldap', host, p]));
            }).then(function(val) {
                var obj = JSON.parse(val);
                obj.BindType = 'anonymous';
                if (obj.StartTls == "1") {
                    obj.StartTls = "enabled";
                } else {
                    obj.StartTls = "disabled";
                }
                delete(obj.port);
                delete(obj.host);
                delete(obj.isAD);
                delete(obj.isLdap);
                delete(obj.Provider);
                return obj;
            }).catch(function(ex) {
                throw new nethserver.Error({
                    id: 1508321630969,
                    type: 'RuntimeError',
                    message: 'LDAP probe failed'
                });
            });
        },

        /**
         * Set remote LDAP bind and execute nethserver-sssd-save event.
         *
         * @example
         * nethserver.system.provider.bindRemoteLdap({
         *   LdapUri: "ldap://1.2.3.4",
         *   BindType: "anonymous",  // valid values: "anonymous" or  "authenticated"
         *   BindDN: "uid=user,dc=server,dc=org",
         *   BindPassword: "mypass",
         *   BaseDN: "dc=server,dc=org",
         *   UserDN: "ou=Peopole,dc=server,dc=org",
         *   GroupDN: "ou=Groups,dc=server,dc=org",
         *   StartTls: "enabled" // valid values: "enabled" or "disabled"
         * });
         *
         * @param {Object} sssdConfig - SSSD configuration
         *
         * @return {Promise} - A promise on success, throws an error otherwise
         */
        bindRemoteLdap: function (sssdConfig) {
            if (sssdConfig.StartTls == 'enabled' && sssdConfig.LdapUri.startsWith("ldaps://")) {
                throw new nethserver.Error({
                    id: 1150832298008,
                    type: 'NotValid',
                    attributes: {
                        'LdapUri' : 'Conflicts with "ldaps://" URI scheme'
                    }
                });
            }
            var db = nethserver.getDatabase('configuration');
            return db.open().then(function() {
                sssdConfig.key = 'sssd';
                sssdConfig.type = 'service';
                sssdConfig.status = 'enabled';
                sssdConfig.Provider = 'ldap';
                db.setObject(sssdConfig);
                return db.save();
            }).then(function(){
                nethserver.signalEvent('nethserver-sssd-save');
            });
        },

        /**
         * Install OpenLDAP locally.
         *
         * @return {Promise} - A process promise
         */
        installLocalLdap: function() {
            return Promise.resolve(
                cockpit.spawn(['/usr/bin/sudo /usr/libexec/nethserver/pkgaction', '--install', '@nethserver-directory'])
            );
        },

        /**
         * Uninstall local provider by executing "nethserver-sssd-remove-provider" event.
         *
         * @return {Promise}
         */
        uninstall: function() {
            return Promise.resolve({ promise: nethserver.signalEvent('nethserver-sssd-remove-provider')});
        },

        /**
         * Probe the given host for AD configuration using DNS query
         *
         * @example
         * nethserver.system.provider.probeAd('1.2.3.4', '4.5.6.7').then(function(config) {
         * //Output config
         *   {
         *      "BindDN" : "WORKGROUP\\TEST$",
         *      "LdapURI" : "ldap://nsdc-neths8f6cf.ad.nethserver.org",
         *      "StartTls" : "disabled",
         *      "BindType" : "anonymous",
         *      "UserDN" : "DC=ad,DC=nethserver,DC=org",
         *      "GroupDN" : "DC=ad,DC=nethserver,DC=org",
         *      "Realm" : "AD.NETHSERVER.ORG,
         *      "BindPassword" : "",
         *      "LdapUriDn" : "ldap:///dc%3Dad%2Cdc%3Dnethserver%2Cdc%3Dorg",
         *      "BaseDN" : "DC=ad,DC=nethserver,DC=org"
         *   }
         *
         *   config.BindPassword = 'mypass';
         *   joinAd(config);
         * })
         *
         *
         * @param {String} domainName - AD domain to search
         * @param {String} [adDns] - Address of DNS server, leave blank to use system default
         *
         * @return {Promise} - A promise with AD configuration for SSSD
         */
        probeAd: function(realm, adDns) {
            var dns = adDns || '';

            return nethserver.validate('ad-dns', [realm, adDns], {
                id: 1508337024232,
                type: 'NotValid',
                message: _('Domain controller not found'),
            }).
            then(function(){
                return Promise.resolve(cockpit.spawn(['/usr/sbin/account-provider-test', 'probead', realm, dns], {superuser: 'require'}));
            }).
            then(function(val) {
                var obj = JSON.parse(val);
                obj.BindType = 'authenticated';
                if (obj.StartTls == "1") {
                    obj.StartTls = "enabled";
                } else {
                    obj.StartTls = "disabled";
                }
                delete(obj.port);
                delete(obj.host);
                delete(obj.isAD);
                delete(obj.isLdap);
                delete(obj.Provider);
                return obj;
            });
        },

        /**
         * Join an Active Directory domain
         *
         * @example
         * nethserver.system.provider.joinDomain( {
         *   Realm: "ad.nethesis.it",
         *   AdDns: "1.2.3.4", // optional
         *   ...
         *   BindDN: "Administrator",
         *   BindPassword: "Nethesis,1234",
         * });
         * @see {@link #probeAd}
         * @param {Object} adConfig - AD configuration, returned by probeAd()
         *
         * @return {Promise} - A promise on success, throws an error otherwise
         */
        joinDomain: function(adConfig) {
            var workgroup;

            return nethserver.validate('ad-dns', [adConfig.Realm, adConfig.AdDns], {
                id: 1508337024230,
                type: 'NotValid',
                message: _('Domain controller not found'),
            }).
            then(function() {
                return nethserver.getDatabase('configuration').open();
            }).
            then(function(db) {
                db.setProps('sssd', {
                    status: "disabled",
                    Realm: adConfig.Realm,
                    Workgroup: '',
                    AdDns: adConfig.AdDns,
                    Provider: 'ad',
                    LdapURI: adConfig.LdapURI,
                    StartTls: '',
                    UserDN: adConfig.UserDN,
                    GroupDN: adConfig.GroupDN,
                    BaseDN: adConfig.BaseDN,
                    BindDN: '',
                    BindPassword: ''
                });
                return db.save();
            }).
            then(function(){
                if(adConfig.AdDns) {
                    return nethserver.signalEvent('nethserver-dnsmasq-save').
                    then(function(){
                        // avoid race condition with DNS resolver process:
                        return new Promise(function(fulfill, reject){
                            setTimeout(fulfill, 1000);
                        });
                    });
                }
            }).
            then(function(){
                // DNS must be up at this point
                return Promise.resolve(cockpit.spawn(['/usr/sbin/account-provider-test', 'probeworkgroup', adConfig.Realm], {superuser: 'require', err: 'message'}));
            }).
            then(function(data){
                var pr = {'Workgroup': ''};
                try {
                    pr = JSON.parse(data);
                } finally {
                    workgroup = pr.Workgroup;
                    return nethserver.getDatabase('configuration').open();
                }
            }).
            then(function(db){
                return db.setProp('sssd', 'Workgroup', workgroup).save();
            }).
            then(function(){
                return Promise.resolve(cockpit.spawn([
                    '/usr/sbin/realm',
                    'join',
                    '--server-software=active-directory',
                    '-v',
                    '-U',
                    adConfig.BindDN,
                    adConfig.Realm
                ], {superuser: 'require', err: 'message'}).
                input(adConfig.BindPassword + "\n"));
            }).
            then(function(){
                return nethserver.getDatabase('configuration').open();
            }).
            then(function(db){
                return db.setProp('sssd', 'status', 'enabled').save();
            }).
            then(function(){
                return {promise: nethserver.signalEvent('nethserver-sssd-save')};
            }).
            catch(function(ex) {
                return nethserver.getDatabase('configuration').open().
                then(function(db){
                    db.setProps('sssd', {
                        status: "disabled",
                        Realm: '',
                        Workgroup: '',
                        AdDns: '',
                        Provider: 'none',
                        LdapURI: '',
                        StartTls: '',
                        UserDN: '',
                        GroupDN: '',
                        BaseDN: '',
                        BindDN: '',
                        BindPassword: '',
                    });
                    return db.save();
                }).
                then(function(){
                    return nethserver.signalEvent('nethserver-sssd-leave').catch(function(){});
                }).
                then(function(){
                    if(adConfig.AdDns) {
                        return nethserver.signalEvent('nethserver-dnsmasq-save').catch(function(){});
                    }
                }).
                then(function(){
                    throw new nethserver.Error({
                        id: 1509446808155,
                        type: 'JoinError',
                        message: _('The join operation failed'),
                        originalMessage: '[' + ex.problem + '] ' + ex.message + ' (exit code ' + ex.exit_code + ')',
                    });
                });
            });

        },


        /**
         * Return the AD realm and workgroup
         *
         * @example
         * nethserver.system.provider.getAdDefault().then(function(defaults) {
         *   // defaults format
         *   {
         *      Realm: "ad.mylocal.nethserver.org",
         *      Workgroup: "MYLOCAL"
         *   }
         * }
         *
         * @return {Promise.<Object>} - A promise containing realm and workgroup
         * */
        getAdDefault: function() {
            var db = nethserver.getDatabase('configuration');
            return db.open().then(function() {
                var defaultRealm = "ad."+db.getType('DomainName');
                var defaultWorkgroup = defaultRealm.split(".")[1].toUpperCase().substr(0,15);
                var realm = db.getProp('sssd','Realm').toLowerCase() || defaultRealm;
                var workgroup = db.getProp('sssd','Workgroup').toUpperCase() || defaultWorkgroup;
                db.save();

                return { Realm: realm, Workgroup: workgroup};
            });
        },


        /**
         * Install local Active Directory Samba container
         *
         * @example
         * nethserver.system.provider.installLocalAd({
         *     Realm: "ad.mylocal.nethserver.org",
         *     Workgroup: "MYLOCAL",
         *     IpAddress: "192.168.3.22"
         * })
         *
         *
         * @param {Object} adConfig - Configuration of the AD
         *
         * @return {Promise} - A promise on success, throws an error otherwise
         */
        installLocalAd: function(adConfig) {
            if (adConfig.Workgroup.length > 15) {
                throw new nethserver.Error({
                    id: 1508332426928,
                    type: 'NotValid',
                    attributes: {
                        'Workgroup' : 'Workgroup maximum lenght is 15 characters'
                    }
                });
            }

            var realmValidator = nethserver.validate('dcrealm', adConfig.Realm, {
                id: 1508332439921,
                type: 'NotValid',
                message: 'LDAP server unreachable'
            });

            var ipValidator = nethserver.validate('dcrealm', adConfig.IpAddress, {
                id: 1508332557911,
                type: 'NotValid',
                message: 'IP address is reseved, already in use or not local'
            });

            var db = nethserver.getDatabase('configuration');
            return validateAll([realmValidator, ipValidator]).then(function() {
                return db.open();
            }).then(function() {
                sssdConfig.key = 'sssd';
                sssdConfig.type = 'service';
                sssdConfig.status = 'enabled';
                sssdConfig.Provider = 'ldap';
                db.set('nsdc', 'service', { status: 'enabled', IpAddress: adConfig.IpAddress });
                return db.save();
            }).then(function() {
                Promise.resolve(
                    cockpit.spawn(['/usr/libexec/nethserver/pkgaction', '--install', '@nethserver-dc'])
                );
            });


        },

        /**
         * Return JSON output from "account-provider-test dump"
         *
         * @return {Object} - A JSON object with provider information
         */
        getInfo: function() {
            return Promise.resolve(
                cockpit.spawn(['/usr/sbin/account-provider-test', 'dump'])
            ).then(function(val) {
                return JSON.parse(val);
            });
        }

    };
})(nethserver);
