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

var sandbox;

beforeEach(function () {
    sandbox = sinon.sandbox.create();
});

afterEach(function(){
    sandbox.restore();
    nethserver.invalidateDbCache();
});

describe('users namespace', function(){
    it('setPassword', function(){
        sandbox.stub(nethserver, 'validate').resolves();
        sandbox.stub(nethserver, 'signalEvent').resolves();
        sandbox.stub(nethserver.system.hostname, 'getDomainName').returns(Promise.resolve('fake.example.com'));

        return nethserver.system.users.setPassword('dummyuser', 'dummypassword').
        then(function(){
            should(nethserver.validate).be.calledOnce();
            should(nethserver.signalEvent).be.calledOnce();
        });
    });
    it('setPassword invalid password', function(){
        //sandbox.stub(cockpit, 'spawn').onFirstCall().returns(Promise.reject(new Error('stub error')));
        sandbox.stub(nethserver, 'validate').rejects();
        sandbox.stub(nethserver, 'signalEvent').resolves();
        sandbox.stub(nethserver.system.hostname, 'getDomainName').returns(Promise.resolve('fake.example.com'));

        return nethserver.system.users.setPassword('dummyuser', 'dummypassword').
        then(function(){
            throw new Error('Should not happen');
        }, function(ex){
            should(nethserver.validate).be.calledOnce();
            should(nethserver.signalEvent).not.be.called();
        });
    });
});

mocha.checkLeaks();
mocha.globals(['jQuery', 'cockpit', 'nethserver']);
mocha.run();
