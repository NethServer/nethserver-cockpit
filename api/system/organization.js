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
 * @namespace nethserver.system.organization
 */
(function(ns){
    // Avoid double-inclusion from sub frames
    if(ns.system.organization) {
        return;
    }
    ns.system.organization = {
        getInfo: function () {
            var db = nethserver.getDatabase('configuration');
            return db.open().then(function() {
                return {
                    'city': db.getProp('OrganizationContact', 'City'),
                    'company': db.getProp('OrganizationContact', 'Company'),
                    'department': db.getProp('OrganizationContact', 'Department'),
                    'phoneNumber': db.getProp('OrganizationContact', 'PhoneNumber'),
                    'street': db.getProp('OrganizationContact', 'Street'),
                };
            });
        },
        saveInfo: function (organization) {
            var db = nethserver.getDatabase('configuration');
            return db.open().then(function() {
                db.setProp('OrganizationContact', 'City', organization.city);
                db.setProp('OrganizationContact', 'Company', organization.company);
                db.setProp('OrganizationContact', 'Department', organization.department);
                db.setProp('OrganizationContact', 'PhoneNumber', organization.phoneNumber);
                db.setProp('OrganizationContact', 'Street', organization.street);
                return db.save();
            }).then(function(){
              return nethserver.signalEvent('organization-save');
            });
        },
    };
})(nethserver);
