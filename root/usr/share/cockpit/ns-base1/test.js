/*
QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});
*/


mocha.setup('bdd')

describe('nethserver namespace', function () {
    it('is defined', function() {
        should(typeof nethserver === 'object').be.ok;
    });
    describe('.Syntax namespace', function () {
        it('is defined', function () {
            should(typeof nethserver.Syntax === 'object').be.ok;
        });
    });
    describe('.Esdb class', function () {
        it('is defined', function () {
            should(typeof nethserver.Esdb === 'function').be.ok;
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
            (function(){nethserver.Syntax.trimWhitespace.stringify(0)}).should.throw('Not implemented');
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
            (function(){nethserver.Syntax.grepToObject.stringify(0)}).should.throw('Not implemented');
        });
    });
});



describe('nethserver.signalEvent()...', function() {
    it('succeedes', function(){
        return nethserver.signalEvent('test-success');
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



describe('nethserver.Esdb', function() {

});

mocha.checkLeaks();
mocha.globals(['jQuery', 'cockpit']);
mocha.run();

