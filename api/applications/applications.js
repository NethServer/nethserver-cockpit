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

/**
 * @namespace nethserver.applications
 */
(function(nethserver){
    // Avoid double-inclusion from sub frames
    if(nethserver.applications) {
        return;
    }

    nethserver.applications = {

        /**
         * List installed applications by searching json manifests inside /usr/share/cockpit/nethserver/applications/
         * See applications manifest for the format
         *
         * @return {Promise.<Array>} a promise with a list of installed applications, or undefined on error
         */
        getApplications: function () {
            return Promise.resolve(
                cockpit.spawn(['/usr/libexec/nethserver/cockpit-list-applications'])
            ).then(function(val) {
                return JSON.parse(val);
            });
        },

         /**
         * List installed applications by searching json manifests inside /usr/share/cockpit/nethserver/applications/
         * See applications manifest for the format
         *
         * @return {Promise.<Application>} on success a promise with the manifest object, throws an error otherwise
         */
        getApplication: function(name) {
            var path = "/usr/share/cockpit/nethserver/applications/"+name+".json";
            var manifest = cockpit.file(path, { syntax: JSON });
            return Promise.resolve(manifest.read().
                done(function(content, tag) {
                    return content; // this is already a JSON
                }).
                fail(function(err) {
                    console.log(err);
                    throw new nethserver.Error({
                        id: 1150781304387,
                        type: 'NotFound',
                        message: 'Application not found: '+name,
                    });
                }).
                always(function() {
                    manifest.close();
                })
            );
        }

    };
})(nethserver);
