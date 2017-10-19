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


beforeEach(function(){
    nethserver.signalEvent = sinon.stub().returns(Promise.resolve(new CustomEvent("sinonstub-signalEventSucceeded")));
});

afterEach(function(){
    nethserver.invalidateDbCache();
});

describe('nethserver.system namespace', function () {
    it('is defined', function() {
        should(typeof nethserver.system === 'object').be.ok();
    });
});

describe('nethserver.system.summary namespace', function () {
    it('is defined', function() {
        should(typeof nethserver.system.summary === 'object').be.ok();
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
            var h = nethserver.system.dns.getRemoteHost('myhost2.domain.org').should.be.rejectedWith(nethserver.Error);
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

    it('deleteAlias', function() {
        return nethserver.system.dns.deleteAlias('myalias.domain.org').
        then(function () {
            nethserver.system.dns.getAlias('myalias.domain.org').should.be.rejectedWith(nethserver.Error);
        });
    });

    it('getAlias musth throw error', function() {
        return nethserver.system.dns.getAlias('myalias.domain.org').should.be.rejectedWith(nethserver.Error);
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
        return nethserver.system.dns.setDNS(['208.67.222.222','208.67.220.220']).
        then(function() {
            return nethserver.getDatabase('configuration').open();
        }).
        then(function(db){
            should(db.getProp('dns', 'NameServers')).be.equal('208.67.222.222,208.67.220.220');
        });
    });

    it('getDNS', function() {
       return nethserver.system.dns.getDNS().then(function(val) {
           val[0].should.be.equal('208.67.222.222');
           val[1].should.be.equal('208.67.220.220');
       });
    });


});

describe('nethserver.system.hostname', function() {
    var oldHostname = '';

    it('getFQDN', function() {
        return nethserver.system.hostname.getFQDN().then(function(hostname){
            hostname.should.be.type('string');
            hostname.length.should.be.greaterThan(0);
            oldHostname = hostname;
        });
    });
    it('setFQDN', function() {
        return nethserver.system.hostname.setFQDN('my.temporary.hostname').
        then(function(){
            return nethserver.system.hostname.getFQDN();
        }).
        then(function(hostname){
            hostname.should.be.type('string');
            hostname.length.should.be.greaterThan(0);
            hostname.should.be.equal('my.temporary.hostname');
            return nethserver.system.hostname.setFQDN(oldHostname, false);
        }).then(function(){
            nethserver.signalEvent.should.be.calledTwice();
        });
    });
    it('getSystemName', function(){
        return nethserver.system.hostname.getSystemName().
        then(function(systemName){
            should(systemName).be.String();
            should(systemName.length).be.greaterThan(0);
        });
    });
    it('getDomainName', function(){
        return nethserver.system.hostname.getDomainName().
        then(function(domainName){
            should(domainName).be.String().and.match(/\./);
        });
    });
});

mocha.checkLeaks();
mocha.globals(['jQuery', 'cockpit']);
mocha.run();
