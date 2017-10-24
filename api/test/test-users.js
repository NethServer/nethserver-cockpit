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
    it('addUser', function(){
        sandbox.stub(nethserver, 'signalEvent').resolves();
        sandbox.stub(nethserver.system.users, 'getUser').resolves({});
        sandbox.stub(nethserver.system.users, 'getGroupMembers').resolves([]);
        sandbox.stub(nethserver.system.users, 'getUserMembership').resolves([]);
        return nethserver.system.users.addUser({
            key: 'dummyuser',
            expires: 'no',
            gecos: 'Dummy User',
            shell: '/bin/false',
            groups: ['g1', 'g2'],
        });
    });
    it('editUser', function(){
        sandbox.stub(nethserver, 'signalEvent').resolves();
        sandbox.stub(nethserver.system.users, 'getUser').resolves({key: 'dummyuser'});
        sandbox.stub(nethserver.system.users, 'getGroupMembers').resolves([]);
        sandbox.stub(nethserver.system.users, 'getUserMembership').resolves([]);
        return nethserver.system.users.addUser({
            key: 'dummyuser',
            expires: 'no',
            gecos: 'Dummy User',
            shell: '/bin/false',
            groups: ['g1', 'g2'],
        });
    });
});

mocha.checkLeaks();
mocha.globals(['jQuery', 'cockpit', 'nethserver']);
mocha.run();
