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

(function (ns, $) {
    /**
     * An object of type TaskProgress is attached to a CustomEvent as "detail"
     *
     * @typedef {Object} Notification
     * @param {string} title the title of notification
     * @param {string} message the message of notification
     * @param {string} status the status of notification (info|danger|success|warning)
     * @param {string} action the label of action, es. "Restart"
     * @param {Function} method the method to invoke
     * @param {string} [type="info"] the type of notification, (info|action)
     *
     */

    /**
     * This is a singleton instance of NotificationMonitor
     * @see {@link #NotificationMonitor}
     * @name nethserver.eventMonitor
     * @instance
     */
    ns.notificationMonitor = {};

    /**
     * Attach a callback to the NotificationMonitor object
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener}
     * @function
     * @name nethserver.notificationMonitor.addEventListener
     * @param {string} eventName - actually "nsnotification"
     * @param {EventListener} eventListener
     * @example
     * nethserver.notificationMonitor.addEventListener('nsnotification', function(notification) {});
     */
    cockpit.event_target(ns.notificationMonitor);

    /**
     * Attach a callback to the NotificationMonitor object
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent}
     * @function
     * @name nethserver.notificationMonitor.dispatchEvent
     * @param {string} eventName - actually "nsnotification"
     * @param {Notification} notification a notification object
     * @example
     * nethserver.notificationMonitor.dispatchEvent('nsnotification', {
     *    type: 'info',
     *    title: 'Failed',
     *    message: 'The value must be between 0 and 5',
     *    status: 'danger',
     *    action: 'Retry',
     *    method: function() {
     *      console.log("method called!");
     *    }
     * });
     */
    var dummy = 0;

})(nethserver, jQuery);
