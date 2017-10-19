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

(function (nethserver) {

    /**
     * Represents a localised error condition and optionally the reason of it,
     * if depends on the user input
     *
     * @typedef {Object} NsError
     * @param {integer} id - Unique identifier used to find the code which generated the error and to troubleshoot the problem
     * @param {string} type - Describes the type of the error
     * @param {Object} [attributes] - Each property of the object is associated to an input attribute. The corresponding value is the localised failure reason, caused by the attribute
     * @param {string} [message] - Generic, localised, end-user oriented description of the error
     * @param {string} [originalMessage] - Textual error message from a remote procedure that further describes the error cause
     * @param {Object} [detail] - A custom object. It is useful to pass it to the error handler procedure
     * @see {@link #nethserver.Error}
     */

    // Avoid double-inclusion from sub frames
    if (nethserver.Error) {
        return;
    }

    /**
     * Creates a nethserver.Error instance from a NsError object. The resulting
     * object has the same interface of NsError and can be thrown as an
     * exception.
     *
     * @class
     * @param {NsError} o - The error model
     * @see {@link #NsError}
     * @example
     * throw new nethserver.Error({
     *      id: 15083129133452,
     *      type: 'NotFound',
     *      message: 'The given object was not found'
     * });
     */
    nethserver.Error = function (o) {
        this.id = o.id;
        this.type = o.type;
        this.message = o.message || undefined;
        this.originalMessage = o.originalMessage || undefined;
        this.attributes = o.attributes || {};
        this.detail = o.detail || undefined;
    };
}(nethserver));
