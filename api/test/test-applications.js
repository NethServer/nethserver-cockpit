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

describe('nethserver.applications', function () {
    it('is defined', function() {
        should(typeof nethserver.applications === 'object').be.ok();
    });
});

describe('applications functions', function () {

    it('getApplications', function() {
        nethserver.applications.getApplications().then(function(apps) {
            apps[0].id.should.be.equal('nethserver-test');
        });
    });


    it('getApplication', function() {
        nethserver.applications.getApplication('nethserver-test').then(function(app) {
            app.id.should.be.equal('nethserver-test');
        });
    });

});


mocha.checkLeaks();
mocha.globals(['jQuery', 'cockpit']);
mocha.run();
