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

function nsdb2string(data) {
    return "";
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
}

Nsdb.prototype = {
    get: function(key) {
        return this.getType(key);
    },
    getType: function(key) {
        if(! (key in this.data)) {
            return '';
        }
        return this.data[key][TYPE];
    },
    getProp: function(key, prop) {
        if(! (key in this.data) || ! (prop in this.data[key][PROP])) {
            return '';
        }
        return this.data[key][PROP][prop];
    },
    set: function(key, type, props) {

    },
    setType: function(key, type) {

    },
    setProp: function(key, prop, value) {

    },
    setProps: function(key, props) {

    },
    delete: function(key) {

    },
    delProp: function(key, prop) {

    },
    delProps: function(key, props) {

    },
    keys: function() {
        return Object.keys(this.data);
    },
    read: function(handler) {
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
                    dfr.reject(Error('not-found'));
                    return;
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
    write: function() {
        
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
