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
        then(function(p){
            return p.promise;
        }).
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
        then(function(p){
            return p.promise;
        }).
        then(function(){
            throw new Error('Should not happen');
        }, function(ex){
            should(nethserver.validate).be.calledOnce();
            should(nethserver.signalEvent).not.be.called();
        });
    });
    it('addUser', function(){
        function fakeGroupMembers(group) {
            var v;
            if(group == 'g1') {
                v = [];
            } else if(group == 'g2') {
                v = ['otheruser'];
            } else {
                v = ['otheruser', 'fakeuser'];
            }
            return Promise.resolve(v);
        }
        var signalEventStub = sandbox.stub(nethserver, 'signalEvent').resolves();
        sandbox.stub(nethserver.system.users, 'getUser').resolves({});
        sandbox.stub(nethserver.system.users, 'getGroupMembers').callsFake(fakeGroupMembers);
        sandbox.stub(nethserver.system.hostname, 'getDomainName').resolves('example.com');
        sandbox.stub(nethserver, 'validate').resolves();
        var getUserMembershipStub = sandbox.stub(nethserver.system.users, 'getUserMembership').resolves([]);

        return nethserver.system.users.addUser({
            key: 'dummyuser',
            expires: 'no',
            gecos: 'Dummy User',
            shell: '/bin/false',
            groups: ['g1', 'g2'],
            password: 'secret',
        }).
        then(function(p){
            return p.promise;
        }).
        then(function(){
            getUserMembershipStub.should.be.calledOnce();
            signalEventStub.getCall(0).should.be.calledWithMatch('user-create', sinon.match.array.deepEquals(['dummyuser', 'Dummy User', '/bin/false']));
            signalEventStub.getCall(1).should.be.calledWithMatch('group-modify', sinon.match.array.deepEquals(['g1', 'dummyuser']));
            signalEventStub.getCall(2).should.be.calledWithMatch('group-modify', sinon.match.array.deepEquals(['g2', 'dummyuser', 'otheruser']));
            signalEventStub.getCall(3).should.be.calledWithMatch('password-policy-update', sinon.match.array.deepEquals(['dummyuser', 'no']));
            signalEventStub.getCall(4).should.be.calledWithMatch('password-modify', sinon.match.array.startsWith(['dummyuser@example.com']));
        });
    });
    it('editUser', function(){
        function fakeGroupMembers(group) {
            var v;
            if(group == 'g1') {
                v = ['dummyuser'];
            } else if(group == 'g2') {
                v = ['otheruser'];
            } else if(group == 'g3') {
                v = ['dummyuser', 'otheruser'];
            } else {
                v = ['otheruser', 'fakeuser'];
            }
            return Promise.resolve(v);
        }
        var signalEventStub = sandbox.stub(nethserver, 'signalEvent').resolves();
        sandbox.stub(nethserver.system.users, 'getUser').resolves({'dummyuser': {}});
        sandbox.stub(nethserver.system.users, 'getGroupMembers').callsFake(fakeGroupMembers);
        sandbox.stub(nethserver.system.users, 'getUserMembership').resolves(['g1', 'g3']);

        return nethserver.system.users.editUser({
            key: 'dummyuser',
            expires: 'no',
            gecos: 'Dummy User',
            shell: '/bin/false',
            groups: ['g1', 'g2'],
        }).
        then(function(p){
            return p.promise;
        }).
        then(function(){
            signalEventStub.should.be.calledWith('user-modify');
            signalEventStub.should.not.be.calledWithMatch('group-modify', sinon.match.array.deepEquals(['g1', 'dummyuser']));
            signalEventStub.should.be.calledWithMatch('group-modify', sinon.match.array.deepEquals(['g2', 'dummyuser', 'otheruser']));
            signalEventStub.should.be.calledWithMatch('group-modify', sinon.match.array.deepEquals(['g3', 'otheruser']));
            signalEventStub.should.be.calledWith('password-policy-update');
        });

    });
});

mocha.checkLeaks();
mocha.globals(['jQuery', 'cockpit', 'nethserver']);
mocha.run();
