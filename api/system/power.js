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

(function(nethserver){
    // Avoid double-inclusion from sub frames
    if(nethserver.system.power) {
        return;
    }

    function shutdown(operation) {
        var arg = (operation == "poweroff") ? "--poweroff" : "--reboot";
        return cockpit.spawn(["shutdown", arg, "now"], { superuser: true, err: "message" });
    }

    /**
     * @namespace
     */
    nethserver.system.power = {

        /**
         * Immediately reboot the system: `shutdown --reboot now`
         *
         * return {Promise} A cockpit promise
         */
        reboot: function () {
            return shutdown('reboot');
        },

        /**
         * Immediately shutdown the system: shutdown --poweroff now
         *
         * return {Promise} A cockpit promise
         */
        poweroff: function () {
            return shutdown('poweroff');
        },

    };
})(nethserver);
