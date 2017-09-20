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

ns.Syntax = {
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

function Nsdb(path) {
    this.path = canonicalizeDbPath(path);
    this.data = null;
    this.tag = null;
    this.modified = false;
}

Nsdb.prototype = {

    /**
     * @param {String} key
     * @return {String} the type of the given key or empty string if key does not exist
     */
    get: function(key) {
        return this.getType(key);
    },

    /**
     * @param {String} key
     * @return {String} the type of the given key or empty string if key does not exist
     */
    getType: function(key) {
        if(! (key in this.data)) {
            return '';
        }
        return this.data[key][TYPE];
    },

    /**
     * @param {String} key
     * @param {String} prop
     * @return {String} the prop value or empty string if key or prop does not exist
     */
    getProp: function(key, prop) {
        if(! (key in this.data) || ! (prop in this.data[key][PROP])) {
            return '';
        }
        return this.data[key][PROP][prop];
    },

    /**
     * @param {String} key
     * @param {String} type
     * @param {Object} props
     * @return {Object} the DB object itself
     */
    set: function(key, type, props) {
        this.setType(key, type);
        this.setProps(key, props);
        return this;
    },

    /**
     * @param {String} key
     * @param {String} type
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
     * @param {String} key
     * @param {String} prop
     * @param {String} value
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
     * @param {String} key
     * @param {Object} props
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
     * @param {String} key
     * @return {Object} the DB object itself
     */
    delete: function(key) {
        this.modified = true;
        delete this.data[key];
        return this;
    },

    /**
     * @param {String} key
     * @param {String} prop
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
     * @param {String} key
     * @param {Array} props
     * @return {Object} the DB object itself
     */
    delProps: function(key, props) {
        for(var p in props) {
            this.delProp(key, p);
        }
        return this;
    },

    /**
     * @param {Object} props
     * @return {Array} the keys in DB
     */
    keys: function() {
        return Object.keys(this.data);
    },

    /**
     * @param {Function} [handler] added to Promise as done(handler)
     * @return {Promise}
     */
    open: function(handler) {
        var dfr = $.Deferred();
        var self = this;
        var fh = cockpit.file(this.path, {
            syntax: nsdbSyntax,
            superuser: 'try'
        });
        fh.read().
            done(function(data, tag) {
                if(data === null && tag === '-') {
                    // non-existing file
                    data = {};
                }
                self.data = data;
                self.tag = tag;
                dfr.resolve();
            }).
            fail(function(error) {
                dfr.reject(error);
            }).
            always(function() {
                fh.close();
            });

        if(handler !== undefined) {
            dfr.done(handler);
        }
        return dfr.promise();
    },

    /**
     * @param {Function} [handler] added to Promise as done(handler)
     * @return {Promise}
     */
    save: function(handler) {
        var dfr = $.Deferred();

        if(this.modified === false) {
            dfr.done(handler).resolve();
            return dfr;
        }

        var self = this;
        var fh = cockpit.file(this.path, {
            syntax: nsdbSyntax,
            superuser: 'try'
        });
        fh.modify(function(tag){
            if(tag !== self.tag) {
                dfr.reject(new Error('write-conflict'));
                return null;
            }
            return self.data;
        }, this.tag).
            done(function(data, tag){
                self.data = data;
                self.tag = tag;
                self.modified = false;
                dfr.resolve();
            }).
            fail(function(error){
                dfr.reject(error);
            }).
            always(function(){
                fh.close();
            });
        if(handler !== undefined) {
            dfr.done(handler);
        }
        return dfr.promise();
    },
};

var nsdbCache = {};
ns.getDatabase = function(path) {
    if(nsdbCache[path] === undefined) {
        nsdbCache[path] = new Nsdb(path);
    }
    return nsdbCache[path];
};

})(nethserver, jQuery);
