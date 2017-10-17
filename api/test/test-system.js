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

mocha.setup('bdd');

describe('nethserver.system namespace', function () {
    it('is defined', function() {
        should(typeof nethserver.system === 'object').be.ok();
    });
});

describe('nethserver.system.summary namespace', function () {
    it('is defined', function() {
        should(typeof nethserver.system.summary === 'object').be.ok();
    });
    describe('summary API', function() {

        var oldHostname = '';

        it('gets hostname', function(done) {
            nethserver.system.summary.getHostname().then(function(hostname){
                hostname.should.be.type('string');
                hostname.length.should.be.greaterThan(0);
                oldHostname = hostname;
                done();
            }, done);
        });
        it('sets hostname', function(done) {
            nethserver.system.summary.setHostname('my.temporary.hostname', false).then(function(){
                nethserver.system.summary.getHostname().then(function(hostname){
                    hostname.should.be.type('string');
                    hostname.length.should.be.greaterThan(0);
                    hostname.should.be.equal('my.temporary.hostname');
                    nethserver.system.summary.setHostname(oldHostname, false).then(function(){
                        done();
                    },done);
                }, done);
            }, done);
        });
    });
});

describe('nethserver.system.date namespace', function () {
    it('is defined', function() {
        should(typeof nethserver.system.date === 'object').be.ok();
    });

    var currentDateSettings;

    describe('date API', function(){
        it('gets the current system date information', function(){
            return nethserver.system.date.getDate().then(function(o){
                o.DateTime.should.be.type('string');
                o.TimeZone.should.be.type('string');
                currentDateSettings = o;
            });
        });
        it('catches invalid dates', function(done){
            nethserver.system.date.setDate({
                'DateTime': 'invalid',
                'TimeZone': 'Europe/Rome',
                'NTPServer': false,
            }).then(function(){
                done(new Error('Should not be successful'));
            }, function(err){
                if(err.type == 'NotValid') {
                    done();
                } else {
                    done(new Error(err.message));
                }
            });
        });
        it('sets date manually', function(){
            var curDate = new Date(currentDateSettings.DateTime);
            var newDate = new Date(curDate + (120 * 1000));
            return nethserver.system.date.setDate({
                'DateTime': newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate() + ' ' + newDate.getHours() + ':' + newDate.getMinutes(),
                'TimeZone': 'Europe/Amsterdam',
            }).then(function(){
                return nethserver.system.date.setDate({
                    'DateTime': curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getDate() + ' ' + curDate.getHours() + ':' + curDate.getMinutes(),
                    'TimeZone': currentDateSettings.TimeZone,
                });
            });
        });
    });
});

describe('nethserver.system.dns()', function() {
    var tdb = nethserver.getDatabase('hosts');
    it('getAllRemoteHost', function() {
        return tdb.open().then(function() {
            tdb.delete( 'myhost.domain.org');
            tdb.delete( 'myhost2.domain.org');

            tdb.setObject({ key: 'myhost.domain.org', type: 'remote', IpAddress: '1.2.3.4', Description: 'my desc' });
            tdb.save();
        }).
        then(function() {
            nethserver.system.dns.getAllRemoteHosts().then(function(val) {
                var record = val[0];
                record.IpAddress.should.be.equal('1.2.3.4');
            });
        });
    });

    it('addRemoteHost', function(done) {
        var host = { key: 'myhost2.domain.org', IpAddress: '1.1.1.1', Description: 'my desc' };
        nethserver.system.dns.addRemoteHost(host).then(function () {
            var h = nethserver.system.dns.getRemoteHost('myhost2.domain.org').then(function(val) {
                val.IpAddress.should.be.equal('1.1.1.1');
            });
            done();
        }, done);
    });

    it('editRemoteHost', function(done) {
        var host = { key: 'myhost2.domain.org', IpAddress: '1.1.1.2', Description: 'my desc2' };
        nethserver.system.dns.editRemoteHost(host).then(function () {
            var h = nethserver.system.dns.getRemoteHost('myhost2.domain.org').then(function(val) {
                val.IpAddress.should.be.equal('1.1.1.2');
                val.Description.should.be.equal('my desc2');
            });
            done();
        }, done);
    });

    it('deleteRemoteHost', function(done) {
        nethserver.system.dns.deleteRemoteHost('myhost2.domain.org').then(function () {
            var h = nethserver.system.dns.getRemoteHost('myhost2.domain.org').should.be.rejectedWith(Error);
            done();
        }, done);
    });


    it('getAllAliases', function() {
        var tdb = nethserver.getDatabase('hosts');
        return tdb.open().then(function() {
            tdb.setObject({ key: 'myifirstalias.mydomain.org', type: 'self', Description: 'myfirstalias' });
            tdb.setObject({ key: 'remote.mydomain.org', type: 'remote', IpAddress: '1.2.3.4', Description: 'my remote desc' });
            tdb.save();
        }).
        then(function() {
            nethserver.system.dns.getAllAliases().then(function(val) {
                for (var r in val) {
                    val[r].should.not.have.property('IpAddress');
                }
            });
        });
    });


    it('addAlias', function(done) {
        var host = { key: 'myalias.domain.org', Description: 'my first alias' };
        nethserver.system.dns.addAlias(host).then(function () {
            var h = nethserver.system.dns.getAlias('myalias.domain.org').then(function(val) {
                val.should.not.have.property('IpAddress');
                val.Description.should.be.equal('my first alias');
            });
            done();
        }, done);
    });

    it('editAlias', function(done) {
        var host = { key: 'myalias.domain.org', Description: 'my second alias' };
        nethserver.system.dns.editAlias(host).then(function () {
            var h = nethserver.system.dns.getAlias('myalias.domain.org').then(function(val) {
                val.Description.should.be.equal('my second alias');
            });
            done();
        }, done);
    });

    it('deleteAlias', function(done) {
        nethserver.system.dns.deleteAlias('myalias.domain.org').then(function () {
            var h = nethserver.system.dns.getAlias('myalias.domain.org').should.be.rejectedWith(Error);
            done();
        }, done);
    });

    it('getAlias musth throw error', function() {
        nethserver.system.dns.getAlias('myalias.domain.org').should.be.rejectedWith(Error);
    });

    it('setAliases', function() {
        var tdb = nethserver.getDatabase('hosts');
        return nethserver.system.dns.setAliases(['a1.domain.org', 'a2.domain2.org']).then(function() {
            tdb.open().then(function() {
                tdb.get('a1.domain.org').should.be.ok();
                tdb.get('a2.domain2.org').should.be.ok();
             });
        });
    });


    it('setDNS', function() {
       var db = nethserver.getDatabase('configuration');
       nethserver.system.dns.setDNS(['208.67.222.222','208.67.220.220']).then(function() {
          var val = db.getProp('dns', 'NameServers');
          return val.should.be.equal('208.67.222.222,208.67.220.220');
       });
    });

    it('getDNS', function() {
       nethserver.system.dns.getDNS().then(function(val) {
           val[0].should.be.equal('208.67.222.222');
           val[1].should.be.equal('208.67.220.220');
       });
    });


});

describe('nethserver.system.certificates', function() {
    beforeEach(function(){
        nethserver.signalEvent = sinon.stub().returns(Promise.resolve(new CustomEvent("sinonstub-signalEventSucceeded")));
    });

    var testCert = "-----BEGIN CERTIFICATE-----\n" +
        "MIIEAjCCAuqgAwIBAgIEWI9P2jANBgkqhkiG9w0BAQsFADCBmTETMBEGA1UEAwwK\n" +
        "TmV0aFNlcnZlcjEUMBIGA1UECgwLRXhhbXBsZSBPcmcxEjAQBgNVBAgMCVNvbWVT\n" +
        "dGF0ZTENMAsGA1UECwwETWFpbjEpMCcGCSqGSIb3DQEJARYacm9vdEB2bTUuZHBu\n" +
        "ZXQubmV0aGVzaXMuaXQxCzAJBgNVBAYTAi0tMREwDwYDVQQHDAhIb21ldG93bjAe\n" +
        "Fw0xNzAxMzAxNDM4MThaFw0yNzAxMjgxNDM4MThaMIGZMRMwEQYDVQQDDApOZXRo\n" +
        "U2VydmVyMRQwEgYDVQQKDAtFeGFtcGxlIE9yZzESMBAGA1UECAwJU29tZVN0YXRl\n" +
        "MQ0wCwYDVQQLDARNYWluMSkwJwYJKoZIhvcNAQkBFhpyb290QHZtNS5kcG5ldC5u\n" +
        "ZXRoZXNpcy5pdDELMAkGA1UEBhMCLS0xETAPBgNVBAcMCEhvbWV0b3duMIIBIjAN\n" +
        "BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5FKyWx+ukS6p7DevKwwBBuLoAzZL\n" +
        "64PG1KhpjKkBpOZfKzYwBSBaBTX6X0f/rWQzt0I1CDYmmjqY+mDExu8OF5ePgFVe\n" +
        "Oz71NZhDYvvifrcnrr5mqdjQ0IUipv86i/2WZZsxBFOshtHtzTlmTRpueFIB+92U\n" +
        "7th1acRciRXHbZPVC5WFJ6FrhPetQKQRQKXJ//7Kj+AKVOXiTTTMBaN3E+Bo85Ci\n" +
        "rJdWpsDDDVM+mNFXs9HBmSiLGcHNfWWtnRwUbBXAZ4nTG0r/ZKkdRpnVsLYNG5j5\n" +
        "NIRkPqmnyZlSP7Xrdfjp2TXZBavislGIRZVZcwzpZTCASFXpi2Y4ZwtyUwIDAQAB\n" +
        "o1AwTjAdBgNVHQ4EFgQUwpxMWF/lR1cXv8Dm5U4MF6d8bpwwHwYDVR0jBBgwFoAU\n" +
        "wpxMWF/lR1cXv8Dm5U4MF6d8bpwwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQsF\n" +
        "AAOCAQEALgoFKFW9NzfP/TFc6I4dEBBEnIiZjQMFWbmtFilJrzLdLHbZCX0Yw4/D\n" +
        "T1A35YFFsaTT0zm0/wBvcX3brXUHRyzbxBiG7ORIJaV85F9NfDEtQd0S/ybwO+YC\n" +
        "zz1lnU0Ys6G7zhMAa6RcIZ8ZRXuTww+ksZpvKGKeWtFIWPkl0qI3+rIkCMwZSboj\n" +
        "MzHiC2EIW0O1ozla2oYzMLu7Uxv27WjAdAKzyeAXuB7a5upyQ7gyGjriajBEzH0p\n" +
        "PXy7mnYphjsbqWwKH3IRR8bRPj49OO3MHsY/DkY+FIlAFoi1yTF70OopDx1dP8tM\n" +
        "U0qcl6zMjhnKPgiVoxu7RVbdYJmYwA==\n" +
        "-----END CERTIFICATE-----\n";

    var testKey ="-----BEGIN RSA PRIVATE KEY-----\n" +
        "MIIBPAIBAAJBALSdCTiPZYQShuHk+uBnroehqj02QPTxEJWSiOLeLCpe+9a/474j\n" +
        "07IhcUTV0DUPRFWaFrSH+MNbbPAUZLUm3hUCAwEAAQJBALHxZXxMCwAsIKe+KU2d\n" +
        "2N3X8RmNskGgn249iI+7xFeYxLWiHrmTFQkhF/sj6515DUmX3U3+L1PbPHWY2YEK\n" +
        "4qECIQDjer/Eq6WyRhyn+IH10FdRPDFExUCDObTtZBnO7Lp8hwIhAMtCDzO88NSF\n" +
        "BTG6+lkyzo3PxThs9zjSBZbLC7+Uk/ODAiEA0mNj23y5WiF4PW4cnIGdUHewRZ99\n" +
        "pCCKEojjSbsuWx8CIQCR1pkvxz6JTdRXRVCBlcnMyKo6fTy5YUAvXQrV8FZj3wIg\n" +
        "ZyyOJhPeKliG7bgv/1l+drCVMNUGRQi3YdGiP4mzztM=\n" +
        "-----END RSA PRIVATE KEY-----\n";

    it('namespace is defined', function(){
        should(nethserver.system.certificates).be.Object();
    });
    var certKey;
    it('getAllCertificates', function() {
        return nethserver.system.certificates.getAllCertificates().then(function(certs){
            should(certs).be.Array();
            should(certs.length).above(0);
            certKey = certs[0].key;
            for(var i = 0; i < certs.length; i ++) {
                should(certs[i]).have.property('issuer').which.is.String();
                should(certs[i]).have.property('expired').which.is.Boolean();
                should(certs[i]).have.property('expiration_t').which.is.Number().above(0);
                should(certs[i]).have.property('default').which.is.Boolean();
            }
            return certs;
        });
    });
    it('showCertificate existing', function() {
        return nethserver.system.certificates.showCertificate(certKey).then(function(certText){
            should(certText).be.String();
            should(certText).match(/^Certificate.*/);
            return certText;
        });
    });
    it('showCertificate notfound', function() {
        return nethserver.system.certificates.showCertificate('non-existing-certificate').then(function(certText){
            throw new Error('Should not happen');
        }, function(err){
            should(err).be.Object();
            should(err).have.property('type');
            should(err.type).be.equal('NotFound');
        });
    });
    it('selectDefaultCertificate', function() {
        return nethserver.system.certificates.selectDefaultCertificate('/etc/pki/tls/certs/NSRV.crt');
    });
    it('selectDefaultCertificate notfound', function() {
        return nethserver.system.certificates.selectDefaultCertificate('non-existing-certificate').then(function(){
            throw new Error('Should not happen');
        }, function(err){
            should(err).be.Object();
            should(err).have.property('type');
            should(err.type).be.equal('NotValid');
        });
    });
    it('uploadCertificate', function() {
        var certificate = {
            key: 'testcert',
            privateKey: testKey,
            certificate: testCert,
            chain: testCert,
        };
        return nethserver.system.certificates.uploadCertificate(certificate).then(function(){
            nethserver.signalEvent.should.have.calledWithMatch('certificate-upload').callCount(1);
        });
    });
    it('uploadCertificate without chain', function() {
        var certificate = {
            key: 'testcert',
            privateKey: testKey,
            certificate: testCert,
            chain: "",
        };

        return nethserver.system.certificates.uploadCertificate(certificate).then(function(){
            nethserver.signalEvent.should.have.calledWithMatch('certificate-upload').callCount(1);
        });
    });
    it('uploadCertificate fails (key)', function() {
        var certificate = {
            key: 'NSRV',
            privateKey: testKey,
            certificate: testCert,
            chain: testCert,
        };

        return nethserver.system.certificates.uploadCertificate(certificate).
            then(function(){
                throw new Error('Should not happen');
            }, function(ex){
                nethserver.signalEvent.should.not.be.called();
                should(ex).have.property('attributes').have.keys('key');
                should(ex).have.property('attributes').not.have.keys('chain', 'privateKey', 'certificate');
            });
    });
    it('uploadCertificate fails (privateKey)', function() {
        var certificate = {
            key: 'testcert',
            privateKey: "!!! invalid private key!!!",
            certificate: testCert,
            chain: testCert,
        };

        return nethserver.system.certificates.uploadCertificate(certificate).
            then(function(){
                throw new Error('Should not happen');
            }, function(ex){
                nethserver.signalEvent.should.not.be.called();
                should(ex).have.property('attributes').have.keys('privateKey');
                should(ex).have.property('attributes').not.have.keys('chain', 'key', 'certificate');
            });
    });
    it('uploadCertificate fails (certificate)', function() {
        var certificate = {
            key: 'testcert',
            privateKey: testKey,
            certificate: "!!!invalid certificate string!!!",
            chain: testCert,
        };

        return nethserver.system.certificates.uploadCertificate(certificate).
            then(function(){
                throw new Error('Should not happen');
            }, function(ex){
                nethserver.signalEvent.should.not.be.called();
                should(ex).have.property('attributes').have.keys('certificate');
                should(ex).have.property('attributes').not.have.keys('chain', 'key', 'privateKey');
            });
    });
    it('uploadCertificate fails (chain)', function() {
        var certificate = {
            key: 'testcert',
            privateKey: testKey,
            certificate: testCert,
            chain: "!!!invalid chain cert!!!",
        };

        return nethserver.system.certificates.uploadCertificate(certificate).
            then(function(){
                throw new Error('Should not happen');
            }, function(ex){
                nethserver.signalEvent.should.not.be.called();
                should(ex).have.property('attributes').have.keys('chain');
                should(ex).have.property('attributes').not.have.keys('privateKey', 'certificate', 'key');
            });
    });
    it('uploadCertificate fails (all)', function() {
        var certificate = {
            key: 'testcert',
            privateKey: "!!!invalid private key!!!",
            certificate: "!!!invalid certificate!!!",
            chain: "!!!invalid chain cert!!!",
        };

        return nethserver.system.certificates.uploadCertificate(certificate).
            then(function(){
                throw new Error('Should not happen');
            }, function(ex){
                nethserver.signalEvent.should.not.be.called();
                should(ex).have.property('attributes').have.keys('privateKey', 'certificate', 'chain');
                should(ex).have.property('attributes').not.have.keys('key');
            });
    });
});


mocha.checkLeaks();
mocha.globals(['jQuery', 'cockpit']);
mocha.run();
