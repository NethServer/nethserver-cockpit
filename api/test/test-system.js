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
            var h = nethserver.system.dns.getRemoteHost('myhost2.domain.org').then(function(val) {
                val.should.not.have.property('IpAddress');
            });
            done();
        }, done);
    });


    it('getAllAliases', function() {
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
            var h = nethserver.system.dns.getAlias('myalias.domain.org').then(function(val) {
                val.should.not.have.property('Description');
            });
            done();
        }, done);
    });

    it('getAlias musth throw error', function() {
       nethserver.system.dns.getAlias('myalias.domain.org').should.be.rejectedWith(Error);
    });


});


mocha.checkLeaks();
mocha.globals(['jQuery', 'cockpit']);
mocha.run();
