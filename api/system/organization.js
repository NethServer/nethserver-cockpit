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

(function ($) {
    nethserver.system.organization = {
        getInfo: function () {
            var db = nethserver.getDatabase('configuration');
            return db.open().then(function() {
                return {
                    'City': db.getProp('OrganizationContact', 'City'),
                    'Company': db.getProp('OrganizationContact', 'Company'),
                    'Department': db.getProp('OrganizationContact', 'Department'),
                    'PhoneNumber': db.getProp('OrganizationContact', 'PhoneNumber'),
                    'Street': db.getProp('OrganizationContact', 'Street'),
                };
            });
        },
        saveInfo: function (organization) {
            var db = nethserver.getDatabase('configuration');
            return db.open().then(function() {
                db.setProp('OrganizationContact', 'City', organization.City);
                db.setProp('OrganizationContact', 'Company', organization.Company);
                db.setProp('OrganizationContact', 'Department', organization.Department);
                db.setProp('OrganizationContact', 'PhoneNumber', organization.PhoneNumber);
                db.setProp('OrganizationContact', 'Street', organization.Street);
                return db.save();
            }).then(function(){
              return nethserver.signalEvent('organization-save');
            });
        },
    };
})(jQuery);
