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
 * @alias nethserver
 * @name ns
 */
(function (ns) {
    // Avoid double-inclusion from sub frames
    if(ns.system.certificates) {
        return;
    }

    ns.system.certificates = {
        /**
         * @typedef Certificate
         * @param {string} key the certificate identifier
         * @param {string} issuer the certificate issuer
         * @param {integer} expiration_t the certificate expiration date in seconds since the Epoch
         * @param {boolean} expired the certificate expiration date
         * @param {boolean} default true if the certificate is selected as system-wide default
         */

        /**
         * List the X.509 certificates available on the system
         *
         * @return {Promise.<Certificate[]|Error>}
         */
        getAllCertificates: function () {
            return Promise.resolve(cockpit.spawn(['/usr/libexec/nethserver/cert-list'], {'superuser': 'require'})).then(function(content){
                var o = JSON.parse(content);
                var list = [];
                for (var key in o) {
                    if (o.hasOwnProperty(key)) {
                        o[key].id = key;
                        o[key].type = 'certificate';
                        list.push({
                            key: key,
                            type: 'certificate',
                            issuer: o[key].issuer,
                            expiration_t: o[key].expiration_t,
                            expired: o[key].expired == 0 ? false : true,
                            default: o[key].default > 0 ? true : false,
                            CrtFile: o[key].file,
                            KeyFile: o[key].key,
                            ChainFile: o[key].chain,
                        });
                    }
                }
                return list;
            }); //
        },
        /**
         * Retrieve the X.509 certificate in textual format
         * @param {string} certkey - A key returned by {@link #getAllCertificates()}
         * @return {Promise.<string>} - the X.509 certificate textual representation
         */
        showCertificate: function(certkey) {
            return Promise.resolve(cockpit.spawn(['/usr/libexec/nethserver/pki-info', '-s', certkey], {'superuser': 'try', 'err': 'message'})).
                then(function(content){
                    return content.trim();
                },function(ex){
                    throw new nethserver.Error({
                        id: 1507818154410,
                        type: 'NotFound',
                        message: 'The requested certificate was not found',
                        reason: ex.message
                    });
                });
        },
        uploadCertificate: function (certificate) {
            return cockpit.spawn(['date', '+%F %H:%M']);
        },
        editCertificate: function (certificate) {
            return cockpit.spawn(['date', '+%F %H:%M']);
        },
        requestLetsEncryptCertificate: function (certificate) {
            return cockpit.spawn(['date', '+%F %H:%M']);
        },
        /**
         * Select the default system certificate. An application
         * will use the default certificate if no other way to configure a
         * certificate is provided by the application itself.
         *
         * @param {string} certkey - A key returned by {@link #getAllCertificates()}
         * @return {Promise} - Successful promise if configuration can be applied, failed otherwise
         */
        selectDefaultCertificate: function (certkey) {
            var cert;
            return nethserver.system.certificates.getAllCertificates().
                then(function(certs){
                    for(var i = 0; i < certs.length; i++) {
                        if(certs[i].key === certkey) {
                            cert = certs[i];
                            return nethserver.getDatabase('configuration').open();
                        }
                    }
                    throw new nethserver.Error({
                        id: 1507819916480,
                        type: 'NotValid',
                        message: 'The given certificate key is not valid'
                    });
                }).
                then(function(db){
                    return db.setProps('pki', {
                        'CrtFile': cert.CrtFile,
                        'KeyFile': cert.KeyFile,
                        'ChainFile': cert.ChainFile,
                    }).save();
                }).
                then(function(){
                    nethserver.signalEvent('certificate-update');
                });
        },
    };

})(nethserver);
