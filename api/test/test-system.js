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
                    console.log(hostname);
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

mocha.checkLeaks();
mocha.globals(['jQuery', 'cockpit']);
mocha.run();
