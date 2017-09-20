/*
QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});
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
    it('succeedes', function(done){
        nethserver.signalEvent('test-success').
            done(function() { done(); }).
            fail(function() { done('error'); });
    });
    it('fails', function(done){
        nethserver.signalEvent('test-failure').fail(function(){
            done();
        }).done(function(){
            done('must fail');
        });
    });
    it('catches non-existing event', function(done){
        nethserver.signalEvent('test-nonexisting-event').fail(function(){
            done();
        }).done(function(){
            done('must fail');
        });
    });
});

describe('nethserver.getDatabase()', function() {    
    it('is defined', function () {
        should(typeof nethserver.getDatabase === 'function').be.ok();
    });
    it('returns Nsdb instance', function () {
        var cdb = nethserver.getDatabase('configuration');
        should(typeof cdb.getProp === 'function').be.ok();
    });
    it('db.getProp()', function(done) {
        var cdb = nethserver.getDatabase('configuration');
        cdb.open(function(){
            cdb.getProp('dnsmasq', 'status').should.be.equal('enabled');
            done();
        }).fail(done);
    });
    it('db.getType()', function(done) {
        var cdb = nethserver.getDatabase('configuration');
        cdb.open(function(){
            cdb.get('MinUid').should.be.equal('5000');
            cdb.getType('MinUid').should.be.equal('5000');
            done();
        }).fail(done);
    });
    it('db.set()', function (done) {
        var tdb = nethserver.getDatabase('/tmp/testdb');
        tdb.open(function(){
            tdb.delete('keytest');
            tdb.set('keytest', 'typeofkey', {'p1':'v1', 'p2': 'v2'});
            tdb.setProp('keytest', 'p1', 'v1mod');
            tdb.delProp('keytest', 'p2');
            tdb.delProp('keytest', 'p2');
            tdb.setType('kdel', 'deleteme'); tdb.setType('kdel', 'deleteme');
            tdb.delete('kdel'); tdb.delete('kdel');
            tdb.save(function(){
                tdb.getProp('keytest', 'p1').should.be.equal('v1mod');
                tdb.getType('keytest').should.be.equal('typeofkey');
                tdb.getType('kdel').should.be.equal('');
                tdb.getProp('keytest', 'p2').should.be.equal('');
                done();
            }).fail(function(error){
                done(Error('write ' + error));
            });
        }).fail(function(error){
            done(Error('read ' + error));
        });
    });
});

mocha.checkLeaks();
mocha.globals(['jQuery', 'cockpit']);
mocha.run();

