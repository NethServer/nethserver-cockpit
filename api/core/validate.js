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

(function(ns){

    // Avoid double-inclusion from sub frames
    if(ns.validate) {
        return;
    }

    /**
     * Launch the "validate" command. The exit code can be:
     * <ul>
     * <li> 0 - success
     * <li> 1 - generic failure condition
     * <li> N - specific error code
     * </ul>
     *
     * @function
     * @name nethserver.validate
     * @param {String} validator - Validation procedure name
     * @param {Array} args - Arguments to validation procedure
     * @param {Object} ex - Object thrown if validation fails as nethserver.Error object
     * @return {Promise.<Array>} - args itself
     * @see {@link #nethserver.Error}
     * @example
     * var validatorPromise = ns.validate('rsa-key', [keyFile], {
     *     id: 1508163908911,
     *     type: 'NotValid',
     *     attributes: {'privateKey': 'Invalid PEM-encoded RSA key'},
     * });
     */
    ns.validate = function(validator, args, ex) {
        return Promise.resolve(cockpit.spawn(['/sbin/e-smith/validate', validator].concat(args), {superuser: 'required', err: 'message'})).then(function(){
            return args;
        }, function(err) {
            if(ex) {
                throw new ns.Error(ex);
            } else if(err.exit_status == 2) {
                throw new ns.Error({
                    id: 1508227553760,
                    type: 'ValidatorFailed',
                    message: validator + ' error:' + err.message,
                });
            } else {
                throw new ns.Error({
                    id: 1508227553759,
                    type: 'NotValid',
                    message: validator + ' failed',
                });
            }
        });
    };

    /**
     * Resolve all given validator promises in parallel catching "NotValid" errors.
     *
     * @name nethserver.validateAll
     * @param {Array} validators - Each element of the array is resolved as a Promise
     * @returns {Promise} - The failure handler receives a nethserver.Error instance representing the failed validators.
     * @see {@link #nethserver.Error} {@link #nethserver.validate}
     * @example
     * validateAll([v1, v2, v3]); // v1, v2, v3 could be returned by nethserver.validate()
     */
    ns.validateAll = function(validators) {

        var validationErrors = [];
        var myValidators = [];

        validators.forEach(function(v){
            myValidators.push(Promise.resolve(v).catch(function(ex){
                if(ex.type == 'NotValid') {
                    validationErrors.push(ex);
                } else {
                    throw ex;
                }
            }));
        });

        return Promise.all(myValidators).then(function(){
            var attributes = {};
            var message;
            var id = 1508256802479;
            if(validationErrors.length === 1) {
                throw validationErrors[0];
            } else if(validationErrors.length > 1) {
                validationErrors.forEach(function(err) {
                    for(var prop in err.attributes) {
                        if(err.attributes.hasOwnProperty(prop)) {
                            attributes[prop] = err.attributes[prop];
                        }
                    }
                    if(err.message && ! message) {
                        message = err.message;
                    }
                    if(err.id && ! id) {
                        id = err.id;
                    }
                });
                throw new ns.Error({
                    id: id,
                    type: 'NotValid',
                    message: message,
                    attributes: attributes,
                });
            }
        });

    };
}(nethserver));
