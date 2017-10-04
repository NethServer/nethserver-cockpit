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
    describe('.syntax namespace', function () {
        it('is defined', function () {
            should(typeof nethserver.syntax === 'object').be.ok();
        });
    });
});


describe('nethserver.syntax.trimWhitespace', function() {
    it('is a cockpit.file API syntax object', function(){
        nethserver.syntax.trimWhitespace.should.have.properties(['parse', 'stringify']);
    });
    describe('#parse()', function() {
        it('returns a trimmed string', function() {
            nethserver.syntax.trimWhitespace.parse(' abc ').should.be.eql('abc');
        });
    });
    describe('#stringify()', function() {
        it('is not implemented', function() {
            (function(){nethserver.syntax.trimWhitespace.stringify(0);}).should.throw('Not implemented');
        });
    });
});


describe('nethserver.syntax.grepToObject', function() {
    it('is a cockpit.file API syntax object', function(){
        nethserver.syntax.grepToObject.should.have.properties(['parse', 'stringify']);
    });
    describe('#parse()', function() {
        it('returns an object with expected properies', function() {
            nethserver.syntax.grepToObject.parse("p1:v1\np2:v2").should.have.properties({p1:'v1',p2:'v2'});
        });
    });
    describe('#stringify()', function() {
        it('is not implemented', function() {
            (function(){nethserver.syntax.grepToObject.stringify(0);}).should.throw('Not implemented');
        });
    });
});

describe('nethserver.signalEvent()...', function() {
    //nethserver.eventMonitor.addEventListener('nsevent.succeeded', console.log);
    //nethserver.eventMonitor.addEventListener('nsevent.failed', console.log);
    it('succeedes', function() {
        return nethserver.signalEvent('test-success');
    });
    it('fails', function(){
        return nethserver.signalEvent('test-failure').then(
            function(){
                return Promise.reject(new Error('must fail'));
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
                return Promise.reject(new Error('must fail'));
            },
            function(err){
                return Promise.resolve(err);
            });
    });
});

describe('nethserver.eventMonitor', function () {
    it('tracks the event progress', function(){
        return new Promise(function(fulfill, reject){

            var progressCaught = false;
            var succeededCaught = false;
            var failedCaught = false;

            function handler(ev) {
                try{
                    ev.should.have.property('detail');
                    ev.detail.should.have.property('unitName');
                    ev.type.should.startWith('nsevent.');
                    if(ev.type == 'nsevent.progress') {
                        ev.detail.should.have.property('progress');
                        ev.detail.progress.should.be.Number();
                        progressCaught = true;
                    } else if(ev.type == 'nsevent.failed') {
                        ev.detail.should.have.property('exitCode');
                        ev.detail.exitCode.should.be.Number();
                        ev.detail.exitCode.should.not.be.equal(0);
                        failedCaught = true;
                    } else if(ev.type == 'nsevent.succeeded') {
                        ev.detail.should.have.property('exitCode');
                        ev.detail.exitCode.should.be.Number();
                        ev.detail.exitCode.should.be.equal(0);
                        succeededCaught = true;
                    }
                } catch(ex) {
                    reject(ex);
                }
            }

            nethserver.eventMonitor.addEventListener('nsevent.succeeded', handler);
            nethserver.eventMonitor.addEventListener('nsevent.failed', handler);
            nethserver.eventMonitor.addEventListener('nsevent.progress', handler);

            nethserver.signalEvent('test-success').then(function(){
                try {
                    progressCaught.should.be.true();
                    failedCaught.should.be.false();
                    succeededCaught.should.be.true();
                } catch(ex) {
                    reject(ex);
                }
                fulfill();
            });
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
        return nethserver.validate('myhostname', ['test']).then(function(val){
            val.should.be.equal(0);
        });
    });
    it('fails', function () {
        return nethserver.validate('myhostname', ['...']).then(function(val){
            val.should.be.not.equal(0);
        });
    });
});

mocha.checkLeaks();
mocha.globals(['jQuery', 'cockpit']);
mocha.run();
