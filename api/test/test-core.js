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

describe('nethserver namespace', function () {
    it('is defined', function() {
        should(typeof nethserver === 'object').be.ok();
    });
    describe('.Syntax namespace', function () {
        it('is defined', function () {
            should(typeof nethserver.Syntax === 'object').be.ok();
        });
    });
});


describe('nethserver.Syntax.trimWhitespace', function() {
    it('is a cockpit.file API syntax object', function(){
        nethserver.Syntax.trimWhitespace.should.have.properties(['parse', 'stringify']);
    });
    describe('#parse()', function() {
        it('returns a trimmed string', function() {
            nethserver.Syntax.trimWhitespace.parse(' abc ').should.be.eql('abc');
        });
    });
    describe('#stringify()', function() {
        it('is not implemented', function() {
            (function(){nethserver.Syntax.trimWhitespace.stringify(0);}).should.throw('Not implemented');
        });
    });
});


describe('nethserver.Syntax.grepToObject', function() {
    it('is a cockpit.file API syntax object', function(){
        nethserver.Syntax.grepToObject.should.have.properties(['parse', 'stringify']);
    });
    describe('#parse()', function() {
        it('returns an object with expected properies', function() {
            nethserver.Syntax.grepToObject.parse("p1:v1\np2:v2").should.have.properties({p1:'v1',p2:'v2'});
        });
    });
    describe('#stringify()', function() {
        it('is not implemented', function() {
            (function(){nethserver.Syntax.grepToObject.stringify(0);}).should.throw('Not implemented');
        });
    });
});

describe('nethserver.signalEvent()...', function() {
    it('succeedes', function() {
        return nethserver.signalEvent('test-success');
    });
    it('fails', function(){
        return nethserver.signalEvent('test-failure').then(
            function(){
                return Promise.reject('must fail');
            },
            function(ex){
                return Promise.resolve(ex);
                //ex.should.be.Object();
                //ex.should.have.property('unitName');
                //ex.unitName.should.match(/^nsevent-/);
            });
    });
    it('catches non-existing event', function(){
        return nethserver.signalEvent('test-nonexisting-event').then(
            function(){
                return Promise.reject('must fail');
            },
            function(err){
                return Promise.resolve(err);
            });
    });
});

describe('nethserver.getDatabase()', function() {
    it('is defined', function () {
        should(typeof nethserver.getDatabase === 'function').be.ok();
    });
});

describe('The object returned by getDatabase()', function() {
    it('has a getProp() method', function () {
        var cdb = nethserver.getDatabase('configuration');
        should(typeof cdb.getProp === 'function').be.ok();
    });
    it('reads prop with getProp()', function() {
        var cdb = nethserver.getDatabase('configuration');
        return cdb.open().then(function(){
            cdb.getProp('dnsmasq', 'status').should.be.equal('enabled');
        });
    });
    it('returns record type with getType()', function() {
        var cdb = nethserver.getDatabase('configuration');
        return cdb.open().then(function(){
            cdb.get('MinUid').should.be.equal('5000');
            cdb.getType('MinUid').should.be.equal('5000');
        });
    });
});

describe('Also, the object returned by getDatabase()', function() {
    beforeEach(function(done) {
        cockpit.spawn(['/usr/bin/rm', '-f', '/tmp/testdb'], {err:'message', superuser:'required'}).
            done(function() {
                done();
            }).
            fail(function(err) {
                done(new Error(err.message));
            });
    });

    it('opens with non-existing file', function () {
        var tdb = nethserver.getDatabase('/tmp/testdb');
        return tdb.open();
    });

    it('creates an empty db', function () {
        var tdb = nethserver.getDatabase('/tmp/testdb');
        return tdb.open().
            then(function(){
                tdb.save();
            });
    });

    it('writes changes to a new file', function () {
        var tdb = nethserver.getDatabase('/tmp/testdb');
        return tdb.open().
            then(function(){
                tdb.delete('keytest');
                tdb.set('keytest', 'typeofkey', {'p1':'v1', 'p2': 'v2'});
                tdb.setProp('keytest', 'p1', 'v1mod');
                tdb.delProp('keytest', 'p2');
                tdb.delProp('keytest', 'p2');
                tdb.setType('kdel', 'deleteme'); tdb.setType('kdel', 'deleteme');
                tdb.delete('kdel'); tdb.delete('kdel');
            }).
            then(function(){
                return tdb.save();
            }).
            then(function(){
                tdb.getProp('keytest', 'p1').should.be.equal('v1mod');
                tdb.getType('keytest').should.be.equal('typeofkey');
                tdb.getType('kdel').should.be.equal('');
                tdb.getProp('keytest', 'p2').should.be.equal('');
            });

    });


});

describe('nethserver.validate()', function() {
    it('succeedes', function() {
        return nethserver.validate('myhostname', 'test');
    });
});

mocha.checkLeaks();
mocha.globals(['jQuery', 'cockpit']);
mocha.run();
