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
var app = {};

(function (a, $) {
    /**
     * Trigger notification event on parent view
     * @function
     * @name app.showNotification
     * @param {Object} notification - {title: 'string', message: 'string', status: 'success|danger', type: 'info'}
     * @example
     * app.showNotification({ title: 'Saved', message: 'Configuration saved with success', status: 'success', type: 'info' });
     */
    a.showNotification = function (notification) {
        parent.$('body').trigger('showNotification', notification);
    };

    /**
     * Trigger events when any modal is shown or hidden
     */
    $('.modal').on('show.bs.modal', function () {
        parent.$('body').trigger('modalShow');
    });

    $('.modal').on('hide.bs.modal', function () {
        parent.$('body').trigger('modalHide');
    });
})(app, jQuery);