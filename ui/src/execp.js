/*
 * Copyright (C) 2020 Nethesis S.r.l.
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

export default function execp(arg, indata = null, showProgress = false) {
    var nethserver = window.nethserver
    return new Promise(function(resolve, reject) {
        nethserver.exec(typeof arg === 'string' ? [arg] : arg, indata, showProgress ? () => {} : null, resolve, (errResp, errData) => {
            var errObject;
            try {
                errObject = JSON.parse(errData)
            } catch {
                errObject = {}
            }
            errObject['extendedInfo'] = errResp
            reject(errObject)
        });
    })
    .then(function(output) {
        if(typeof output === 'string') {
            try {
                // convert to object:
                output = JSON.parse(output)
            } catch {
                // noop
            }
        }
        return output
    })
}
