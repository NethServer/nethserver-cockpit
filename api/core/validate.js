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

(function(ns, $){
    /**
     * Launch the "validate" command. The exit code can be:
     *
     * * 0 - success
     * * 1 - generic failure condition
     * * N - specific error code
     *
     * @memberof nethserver
     * @param {String} validator - Validation procedure name
     * @param {Array} args - Arguments to validation procedure
     * @return {Promise.<number>} The exit code of "validate" command
     */
    ns.validate = function(validator, args) {
        args = args.slice();
        args.unshift('/sbin/e-smith/validate', validator);

        return Promise.resolve(cockpit.spawn(args, {superuser: 'required', err: 'message'})).then(function(){
            return 0;
        }, function(err) {
            return err.exit_status;
        });
    };
}(nethserver, jQuery));
