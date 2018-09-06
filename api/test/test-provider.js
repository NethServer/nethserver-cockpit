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

describe('provider namespace', function(){
    it('joinDomain', function(){
        sandbox.stub(nethserver, 'validate').resolves();
        sandbox.stub(nethserver, 'signalEvent').resolves();

        var db = nethserver.getDatabase('configuration');
        sandbox.stub(db, 'save').resolves();
        var spawnStub = sandbox.stub(cockpit, 'spawn');

        spawnStub.
        withArgs(sinon.match.array.startsWith(['/usr/sbin/account-provider-test'])).
        callsFake(function(){
            return spawnStub.wrappedMethod(['/bin/echo', '{"Workgroup": "TEST"}']);
        });

        spawnStub.
        callsFake(function(){
            return spawnStub.wrappedMethod(['/bin/cat', '-']);
        });

        return nethserver.system.provider.joinDomain({
           "AdDns": "192.168.12.3",
           "BindDN" : "administrator",
           "LdapURI" : "ldap://nsdc.ad.nethesis.it",
           "StartTls" : "disabled",
           "UserDN" : "DC=ad,DC=nethesis,DC=it",
           "Realm" : "AD.NETHESIS.IT",
           "GroupDN" : "DC=ad,DC=nethesis,DC=it",
           "LdapUriDn" : "ldap:///dc%3Dad%2Cdc%3Dnethesis%2Cdc%3Dit",
           "BindPassword" : "password",
           "BaseDN" : "DC=ad,DC=nethesis,DC=it"
        }).
        then(function(p){
            return p.promise;
        }).
        then(function(){
            should(nethserver.signalEvent).be.calledTwice();
            should(spawnStub).be.calledTwice();
        }).
        catch(function(ex){
            console.error(ex);
            throw ex;
        });
    });
    it('joinDomain fails', function() {
        var saveStub = sandbox.stub(nethserver.getDatabase('configuration'), 'save');
        saveStub.resolves();

        sandbox.stub(nethserver, 'signalEvent').resolves();

        var spawnStub = sandbox.stub(cockpit, 'spawn');

        spawnStub.onCall(0).returns(Promise.reject({
            exit_status: 1,
            problem: 'fake',
            message: 'fake validation error',
        }));
        spawnStub.resolves();

        return nethserver.system.provider.joinDomain({
            "AdDns": "192.168.12.3",
            "Realm" : "AD.NETHESIS.IT",
        }).
        then(function(){
            throw new Error('should not happen');
        }).
        catch(function(ex){
            should(saveStub).be.calledOnce();
            should(spawnStub).be.calledOnce();
        });
    });
});

mocha.checkLeaks();
mocha.globals(['jQuery', 'cockpit', 'nethserver']);
mocha.run();
