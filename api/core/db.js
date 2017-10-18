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

// Avoid double-inclusion from sub frames
if(ns.getDatabase) {
    return;
}

var TYPE = 0;
var PROP = 1;

/*
 states:
 O initial state
 E error
 C comment
 K key
 T type
 P prop
 V value
 ?e escape sequence
*/

var dfa1 = {
    'O': {
        '#': 'C',
        '\n': 'O',
        '': 'K'
    },

    'C': {
        '': 'C',
        '\n': 'O',
    },

    'E': {
        '': 'E'
    },

    'K': {
        '': 'K',
        '\\': 'Ke',
        '=': 'T',
        '\n': 'E'
    },

    'Ke': {'': 'K'},

    'T': {
        '': 'T',
        '\\': 'Te',
        '|': 'P',
        '\n': 'O'
    },

    'Te': {'': 'T'},

    'P': {
        '': 'P',
        '\\': 'Pe',
        '|': 'V',
        '\n': 'E'
    },

    'Pe': {'': 'P'},

    'V': {
        '': 'V',
        '\\': 'Ve',
        '|': 'P',
        '\n': 'O'
    },
};

var dbHeader = "# DO NOT MODIFY THIS FILE.\n" +
    "# This file is automatically maintained by NethServer\n" +
    "# configuration software.  Manually editing this file may put your\n" +
    "# system in an unknown state.\n";

function string2nsdb(payload) {
    var data = {};
    var line = 1;
    var column = 1;
    var sc = 'O';
    var sn = null;
    var Tr = dfa1;
    var tok = '';
    var tokens = [];
    var props = null;

    function esc(c) {
        if(c === 'n') {
            return '\n';
        }
        return c;
    }

    // Payload must end with a record separator:
    if(payload.charAt(payload.length - 1) !== '\n') {
        payload += '\n';
    }

    for(var i=0; i<payload.length; i++) {
        var c = payload.charAt(i);

        if(c in Tr[sc]) {
            sn = Tr[sc][c];
        } else {
            sn = Tr[sc][''];
        }

        if(sn === sc || sc == 'O') {
            tok += c;
        } else if(sc.endsWith('e') && sc.charAt(0) === sn.charAt(0)) {
            tok += esc(c);
        } else if(sc === 'C' && sn === 'O') {
            tok = '';
            tokens = [];
        } else if(sc !== 'O' && sn === 'O') {
            tokens.push(tok);
            line ++;
            props = {};
            for(var t=2; t < tokens.length; t+=2) {
                props[tokens[t]] = tokens[t+1];
            }
            data[tokens[0]] = [tokens[1], props];
            tok = '';
            tokens = [];
        } else if(sn === 'E') {
            throw new Error('Nsdb parse error at line ' + line + ' column' + column);
        } else {
            tokens.push(tok);
            tok = '';
        }
        sc = sn;
        column++;
    }
    return data;
}

function nsdbEscape(val) {
    // TODO: escape the pipe "|", equal "=", newline "\n" signs
    return val;
}

function nsdb2string(data) {
    var out = dbHeader;
    for(var key in data) {
        if(! data.hasOwnProperty(key)) {
            continue;
        }
        out += nsdbEscape(key) + '=' + nsdbEscape(data[key][TYPE]);
        for(var prop in data[key][PROP]) {
            if(! data[key][PROP].hasOwnProperty(prop)) {
                continue;
            }
            out += '|' + nsdbEscape(prop) + '|' + nsdbEscape(data[key][PROP][prop]);
        }
        out += '\n';
    }
    return out;
}


/**
 * @namespace nethserver.syntax
 */
ns.syntax = {
    trimWhitespace: {
        parse: function(data) {
            return String(data).trim();
        },
        stringify: function(o) {
            throw new Error('Not implemented');
        }
    },
    grepToObject: {
        parse: function (output) {
            var ret = {};
            $.each(output.split("\n"), function (i, line) {
                var pos = line.indexOf(":");
                if (pos !== -1)
                    ret[line.substring(0, pos)] = line.substring(pos + 1);
            });
            return ret;
        },
        stringify: function(o) {
            throw new Error('Not implemented');
        }
    },
};

var nsdbSyntax = {
    parse: string2nsdb,
    stringify: nsdb2string,
};

function canonicalizeDbPath(path) {
    if(path.substring(0, 1) === '/') {
        return path;
    }
    return '/var/lib/nethserver/db/' + path;
}

/**
 * A nethserver database instance
 * @see {@link #nethserver.getDatabase}
 * @class
 * @name Nsdb
 * @protected
 */
function Nsdb(path) {
    this.path = canonicalizeDbPath(path);
    this.data = null;
    this.tag = null;
    this.modified = false;
}

Nsdb.prototype = {

    /**
     * Return the object corresponding to the given key
     *
     * @example
     * var db = nethserver.getDatabase('configuration');
     * return db.open().then(function() {
     *   console.log(db.getObject('OrganizationContact'));
     * });
     * //Output:
     * {
     *   key: 'OrganizationContact',
     *   type: 'configuration',
     *   ...
     *   Company: 'Example Org',
     *   CountryCode: '',
     *   ...
     * }
     *
     * @param {String} key - Key name
     * @return {Object.<Record>} an object which represents the record, throws a NotFound error if the key is not inside the db.
     * Valid objects must have **key** and **type** fields, also each property is mapped on a field with
     * the same name of the property itself.
     *
     */
    getObject: function(key) {
        var ret = {};
        var type = this.getType(key);
        if (!type) {
            throw new nethserver.Error({
                id: 1508318713543,
                type: 'NotFound',
                attributes: {
                    'key': 'Object not found'
                }
            });
        }
        ret.key = key;
        ret.type = this.getType(key);
        var props = this.getProps(key);
        if (!$.isEmptyObject(props)) {
            for (var p in props) {
                ret[p] = props[p];
            }
        }
        return ret;
    },

    /**
     * Save and object inside the db.
     *
     * @example
     * var db = nethserver.getDatabase('configuration');
     * return db.open().then(function() {
     *   db.setProp({key: 'OrganizationContact', type: 'configuration', Company: 'Example Org', CountryCode: ''});
     * });
     * //Output:
     * {
     *   key: 'OrganizationContact',
     *   type: 'configuration',
     *   ...
     *   Company: 'Example Org',
     *   CountryCode: '',
     *   ...
     * }
     *
     * @param {Object.<Record>} obj - Object to be saved. The object must contains at least **key** and **type** fields
     * @return {Object.<Record>} on success the DB itself, or undefined on error
     *
     */
    setObject: function(obj) {
        if (jQuery.type(obj.key) == "undefined" || jQuery.type(obj.type) == "undefined") {
            return undefined;
        }
        var tmp = Object.assign({}, obj);
        delete tmp.key;
        delete tmp.type;
        return this.set(obj.key, obj.type, tmp);
    },

    /**
     * Return the properties of the given key
     *
     * @example
     * var db = nethserver.getDatabase('configuration');
     * return db.open().then(function() {
     *   console.log(db.getProps('OrganizationContact'));
     * });
     * //Output:
     * {
     *   ...
     *   Company: 'Example Org',
     *   CountryCode: '',
     *   ...
     * }
     *
     * @param {String} key - Key name
     * @return {Object.<Record>} an object which represent all the properties of the record, an empty object if the key is not inside the db.
     * Each property is mapped on a field with the same name of the property itself.
     *
     */
    getProps: function(key) {
        var props = {};
        var type = this.getType(key);
        if(type) {
            for (var k in this.data[key][PROP]) {
                props[k] = this.data[key][PROP][k];
            }
        }
        return props;
    },

    /**
     * Return the given key
     *
     * @example
     * var db = nethserver.getDatabase('configuration');
     * return db.open().then(function() {
     *   var muid = db.get('MinUid');
     * });
     *
     * @param {String} key - Key name
     * @return {String} the type of the given key or empty string if key does not exist
     */
    get: function(key) {
        return this.getType(key);
    },

    /**
     * Return the type of given key
     *
     * @example
     * var db = nethserver.getDatabase('configuration');
     * return db.open().then(function() {
     *   var type = db.getType('OrganizationContact'); //return "configuration"
     * });
     *
     * @param {String} key - Key name
     * @return {String} the type of the given key or empty string if key does not exist
     */
    getType: function(key) {
        if(! (key in this.data)) {
            return '';
        }
        return this.data[key][TYPE];
    },

    /**
     * Return the selected prop of given key
     *
     * @example
     * var db = nethserver.getDatabase('configuration');
     * return db.open().then(function() {
     *   var city = db.getProp('OrganizationContact', 'City');
     * });
     *
     * @param {String} key - Key name
     * @param {String} prop - Property name
     * @return {String} the prop value or empty string if key or prop does not exist
     */
    getProp: function(key, prop) {
        if(! (key in this.data) || ! (prop in this.data[key][PROP])) {
            return '';
        }
        return this.data[key][PROP][prop];
    },

    /**
     * Create a key if not exists, or ad edit an existing one.
     * Set key type and the value of selected props inside the given key
     *
     * @example
     * var db = nethserver.getDatabase('configuration');
     * return db.open().then(function() {
     *   db.set('OrganizationContact', 'configuration', {Street: "my street", City: "Bigapple"});
     *   return db.save();
     * }).then(function(){
     *   return nethserver.signalEvent('organization-save');
     * });
     *
     *
     * @param {String} key - Key name
     * @param {String} type - Type of the key
     * @param {Object} props - Object with properties map name => value
     * @return {Object} the DB object itself
     */
    set: function(key, type, props) {
        this.setType(key, type);
        this.setProps(key, props);
        return this;
    },

    /**
     * Set the type of given key
     *
     * @example
     * var db = nethserver.getDatabase('configuration');
     * return db.open().then(function() {
     *   db.set('MinUid', "5000");
     *   return db.save();
     * });
     *
     * @param {String} key - Key name
     * @param {String} type - Type of the key
     * @return {Object} the DB object itself
     */
    setType: function(key, type) {
        this.modified = true;
        if(! (key in this.data)) {
            this.data[key] = [null, null];
            this.data[key][TYPE] = String(type);
            this.data[key][PROP] = {};
        }
        this.data[key][TYPE] = type;
        return this;
    },

    /**
     * Set the value of selected prop inside the given key.
     * Key type is not changed.
     *
     * @example
     * var db = nethserver.getDatabase('configuration');
     * return db.open().then(function() {
     *   db.setProp('OrganizationContact', 'Street', 'my street');
     *   return db.save();
     * }).then(function(){
     *   return nethserver.signalEvent('organization-save');
     * });
     *
     *
     * @param {String} key - Key name
     * @param {String} prop - Property name
     * @param {String} value - Value of the property
     * @return {Object} the DB object itself
     */
    setProp: function(key, prop, value) {
        if(! (key in this.data)) {
            return this;
        }
        this.modified = true;
        this.data[key][PROP][prop] = String(value);
        return this;
    },

    /**
     * Set the value of selected props inside the giben key
     * Key type is not changed.
     *
     * @example
     * var db = nethserver.getDatabase('configuration');
     * return db.open().then(function() {
     *   db.setProps('OrganizationContact', {Street: "my street", City: "Bigapple"});
     *   return db.save();
     * }).then(function(){
     *   return nethserver.signalEvent('organization-save');
     * });
     *
     * @param {String} key - Key name
     * @param {Object} props - Object with properties map name => value
     * @return {Object} the DB object itself
     */
    setProps: function(key, props) {
        if(! (key in this.data)) {
            return this;
        }
        this.modified = true;
        $.extend(this.data[key][PROP], props);
        return this;
    },

    /**
     * Delete the given key
     *
     * @example
     * var db = nethserver.getDatabase('configuration');
     * db.delete('OrganizationContact');
     *
     * @param {String} key - Key name
     * @return {Object} the DB object itself
     */
    delete: function(key) {
        this.modified = true;
        delete this.data[key];
        return this;
    },

    /**
     * Delete selected prop inside given key
     *
     * @example
     * var db = nethserver.getDatabase('configuration');
     * db.delProp('OrganizationContact','City');
     *
     * @param {String} key - Key name
     * @param {String} prop - Property name
     * @return {Object} the DB object itself
     */
    delProp: function(key, prop) {
        if(! (key in this.data)) {
            return this;
        }
        this.modified = true;
        delete this.data[key][PROP][prop];
        return this;
    },

    /**
     * Delete selected props inside the given keys
     *
     * @example
     * var db = nethserver.getDatabase('configuration');
     * db.delProp('OrganizationContact',['City','Street']);
     *
     * @param {String} key - Key name
     * @param {Array} props - List of property names to be removed
     * @return {Object} the DB object itself
     */
    delProps: function(key, props) {
        for(var p in props) {
            this.delProp(key, p);
        }
        return this;
    },

    /**
     * Return a list of keys inside the current DB
     *
     *
     * @example
     * var db = nethserver.getDatabase('configuration');
     * var keys = db.keys();
     *
     * @return {Array} the keys in DB
     */
    keys: function() {
        return Object.keys(this.data);
    },

    /**
     * Open the database
     *
     * @example
     * var db = nethserver.getDatabase('configuration');
     * return db.open().then(function() {
     *   // do something like db.getProp(...)
     * })
     *
     * @return {Promise}
     */
    open: function() {
        var self = this;
        var fh = cockpit.file(this.path, {
            syntax: nsdbSyntax,
            superuser: 'try'
        });

        function closeFile() {
            fh.close();
            return self;
        }

        var p = Promise.resolve(fh.read().done(function(data, tag) {
                if(data === null && tag === '-') {
                    // non-existing file
                    data = {};
                }
                self.data = data;
                self.tag = tag;
            })).
            then(closeFile, closeFile);

        return p;
    },

    /**
     * Commit changes to the database
     *
     * @example
     * var db = nethserver.getDatabase('configuration');
     * return db.open().then(function() {
     *   // do setProp
     *   return db.save();
     * }).then(function(){
     *   // execute signal event
     * });
     *
     * @return {Promise}
     */
    save: function() {
        var self = this;

        if(this.modified === false) {
            return Promise.resolve(self);
        }

        var fh = cockpit.file(this.path, {
            syntax: nsdbSyntax,
            superuser: 'try'
        });

        return Promise.resolve(fh.modify(function(){}, self.data, self.tag).
                done(function(newdata, newtag){
                    self.data = newdata;
                    self.tag = newtag;
                    self.modified = false;
                }).
                always(function() {
                    fh.close();
                })).
                then(function(){
                    return self;
                });
    },
};

var nsdbCache = {};
/**
 * Retrieve a database object
 * @name nethserver.getDatabase
 * @function
 * @param {string} path The absolute file system path of the DB, or a DB name
 * @returns {Nsdb}
 * @example
 * var db = nethserver.getDatabase('configuration');
 * @example
 * var tmpdb = nethserver.getDatabase('/tmp/db.temporary');
 */
ns.getDatabase = function(path) {
    if(nsdbCache[path] === undefined) {
        nsdbCache[path] = new Nsdb(path);
    }
    return nsdbCache[path];
};

})(nethserver, jQuery);
