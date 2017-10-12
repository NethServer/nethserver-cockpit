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
 * Namespace definition
 *
 *
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
         * @return {Array.<Application>} a list of installed applications
         */
        listApplications: function () {
            return cockpit.spawn(['/usr/libexec/nethserver/cockpit-list-applications']);
        }

    };
})(nethserver);
