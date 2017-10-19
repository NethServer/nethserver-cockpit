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

(function (ns, cockpit) {
    // Avoid double-inclusion from sub frames
    if(ns.system.certificates) {
        return;
    }

    var _ = cockpit.gettext;

    /**
     * @namespace
     * @alias nethserver.system.certificates
     */
    ns.system.certificates = {
        /**
         * Represent an SSL certificate meta data
         *
         * @typedef {Object} CertificateMeta
         * @param {string} key the certificate identifier
         * @param {string} issuer the certificate issuer
         * @param {integer} expiration_t the certificate expiration date in seconds since the Epoch
         * @param {boolean} expired the certificate expiration date
         * @param {boolean} default true if the certificate is selected as system-wide default
         * @see {@link #nethserver.getAllCertificates}
         */

         /**
          * Represent an SSL certificate data parts
          *
          * @typedef {Object} CertificatePayload
          * @param {string} key the certificate identifier that must be unique on the system
          * @param {string} privateKey the certificate private key in PEM encoded format
          * @param {string} certificate the X.509 certificate, PEM-encoded
          * @param {string} chain the certificate chain file for intermediate autorities, PEM-encoded. Can be an empty.
          */

        /**
         * List the X.509 certificates available on the system
         *
         * @return {Promise.<CertificateMeta[]|Error>}
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
                        message: _('The requested certificate was not found'),
                        reason: ex.message
                    });
                });
        },
        /**
         * Upload the certificate on the system and assigns it a unique indentifier
         * @param {CertificatePayload} upload An object containing the certificate parts
         * @return {Promise} Success when the certificate is uploaded and configured correctly
         */
        uploadCertificate: function (upload) {
            var tmpdump = "FILE=$(mktemp --tmpdir tmpupload.XXXXXXXXXX)\n" +
                "cat - > ${FILE}\n" +
                "echo -n ${FILE}\n";

            function cleanupTemp(files) {
                return Promise.resolve(cockpit.spawn(['/usr/bin/rm', '-vf'].concat(files)));
            }

            return Promise.all([
                Promise.resolve(cockpit.script(tmpdump).input(upload.privateKey)),
                Promise.resolve(cockpit.script(tmpdump).input(upload.certificate)),
                Promise.resolve(upload.chain ? cockpit.script(tmpdump).input(upload.chain) : null)
            ]).
            then(function(values){
                var keyFile = values[0], certFile = values[1], chainFile = values[2];
                return ns.validateAll([
                    Promise.resolve(cockpit.spawn(['test', '!', '-e', '/etc/pki/tls/certs/' + upload.key + '.crt'], {err: 'ignore'})).
                        catch(function(ex){
                            throw new ns.Error({
                                id: 1508163908910,
                                type: 'NotValid',
                                attributes: {'key': _('The given certificate key is already used')}
                            });
                        }),
                    ns.validate('rsa-key', [keyFile], {
                        id: 1508163908911,
                        type: 'NotValid',
                        attributes: {'privateKey': _('Invalid PEM-encoded RSA key')},
                    }),
                    ns.validate('pem-certificate', [certFile], {
                        id: 1508163908912,
                        type: 'NotValid',
                        attributes: {'certificate': _('Invalid PEM-encoded X.509 certificate')},
                    }),
                    chainFile === null ? undefined : ns.validate('pem-certificate', [chainFile], {
                        id: 1508163908913,
                        type: 'NotValid',
                        attributes: {'chain': _('Invalid PEM-encoded X.509 chain certificate')},
                    }),
                ]).
                then(function(){
                    function cleanupHandler () {
                        cleanupTemp([keyFile, certFile, chainFile]);
                    }
                    ns.signalEvent('certificate-upload', [upload.key, keyFile, certFile, chainFile]).then(cleanupHandler, cleanupHandler);
                },function(ex){
                    cleanupTemp([keyFile, certFile, chainFile]);
                    throw ex;
                });
            });
        },

        /**
         * Input to self-signed certificate generator. Any missing property or
         * any property with a falsy value is replaced with its default value.
         *
         * Default values come from OrganizationContact (oc), root, pki records.
         *
         * @typedef {Object} CertificateDetail
         * @param {string} [CountryCode=oc.CountryCode] -
         * @param {string} [State=oc.State] -
         * @param {string} [Locality=oc.City] -
         * @param {string} [Organization=oc.Company] -
         * @param {string} [OrganizationalUnitName=oc.Department] -
         * @param {string} [CommonName=NethServer] -
         * @param {string} [EmailAddress=root.EmailAddress] -
         * @param {string[]} [SubjectAltNames] -
         * @param {integer} [CertificateDuration=pki.CertificateDuration] -
         */

        /**
         * Retrieve the self-signed SSL certificate generation parameters
         * @see {@link #CertificateDetail}
         * @return {CertificateDetail} - The current self-signed certificate generation parameters
         */
         getSelfSignedCertificateParameters: function() {
             return Promise.all([
                 nethserver.getDatabase('configuration').open(),
                 nethserver.system.hostname.getDomainName(),
             ]).
             then(function(values){
                 var db = values.shift(),
                     domainName = values.shift();
                 var detail = db.getProps('pki');
                 return {
                     CountryCode: detail.CountryCode || db.getProp('OrganizationContact', 'CountryCode'),
                     State: detail.State || db.getProp('OrganizationContact', 'State'),
                     Locality: detail.Locality || db.getProp('OrganizationContact', 'Locality'),
                     Organization: detail.Organization || db.getProp('OrganizationContact', 'Company'),
                     OrganizationalUnitName: detail.OrganizationalUnitName || db.getProp('OrganizationContact', 'Department'),
                     CommonName: detail.CommonName || 'NethServer', // XXX default proposal db.getProp('sysconfig', 'ProductName'),
                     SubjectAltNames: detail.SubjectAltName.split(",") || ['*.' + domainName], // convert to array of strings
                     CertificateDuration: parseInt(detail.CertificateDuration || db.getProp('pki', 'CertificateDuration'))
                 };
             });
         },
        /**
         * Store the given parameters and generate a new self-signed SSL certificate with them
         *
         * @param {CertificateDetail} inputParams - An object with updated params values
         * @see {@link #CertificateDetail}
         * @return {Promise} Success when the certificate has been persisted correctly
         */
        generateSelfSignedCertificate: function (inputParams) {
            var o = {};
            return ns.system.certificates.getSelfSignedCertificateParameters().
            then(function(defaultParams){
                for(var key in defaultParams) {
                    if(! inputParams.hasOwnProperty(key) || ! inputParams[key]) {
                        o[key] = defaultParams[key];
                    } else {
                        o[key] = inputParams[key];
                    }
                }
                return nethserver.getDatabase('configuration').open();
            }).
            then(function(db){
                db.setProps('pki', {
                    CountryCode: o.CountryCode,
                    State: o.State,
                    Locality: o.Locality,
                    Organization: o.Organization,
                    OrganizationalUnitName: o.OrganizationalUnitName,
                    CommonaName: o.CommonName,
                    SubjectAltName: o.SubjectAltNames.join(","), // convert to CSV string
                    CertificateDuration: String(o.CertificateDuration),
                });
                return db.save();
            }).
            then(function(){
                return Promise.resolve(cockpit.spawn(['/etc/e-smith/events/actions/nethserver-generate-certificate'], {superuser: 'required', err: 'message'}));
            }).
            then(function(){
                ns.signalEvent('certificate-update', []);
            });
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
                        message: _('The given certificate key is not valid'),
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

})(nethserver, cockpit);
