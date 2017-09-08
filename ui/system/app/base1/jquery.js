(function(e, t) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = e.document ? t(e, true) : function(e) {
            if (!e.document) {
                throw new Error("jQuery requires a window with a document");
            }
            return t(e);
        };
    } else {
        t(e);
    }
})(typeof window !== "undefined" ? window : this, function(e, t) {
    var n = [];
    var i = n.slice;
    var r = n.concat;
    var o = n.push;
    var s = n.indexOf;
    var a = {};
    var l = a.toString;
    var f = a.hasOwnProperty;
    var u = {};
    var c = e.document, d = "2.1.4", p = function(e, t) {
        return new p.fn.init(e, t);
    }, h = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, g = /^-ms-/, v = /-([\da-z])/gi, m = function(e, t) {
        return t.toUpperCase();
    };
    p.fn = p.prototype = {
        jquery: d,
        constructor: p,
        selector: "",
        length: 0,
        toArray: function() {
            return i.call(this);
        },
        get: function(e) {
            return e != null ? e < 0 ? this[e + this.length] : this[e] : i.call(this);
        },
        pushStack: function(e) {
            var t = p.merge(this.constructor(), e);
            t.prevObject = this;
            t.context = this.context;
            return t;
        },
        each: function(e, t) {
            return p.each(this, e, t);
        },
        map: function(e) {
            return this.pushStack(p.map(this, function(t, n) {
                return e.call(t, n, t);
            }));
        },
        slice: function() {
            return this.pushStack(i.apply(this, arguments));
        },
        first: function() {
            return this.eq(0);
        },
        last: function() {
            return this.eq(-1);
        },
        eq: function(e) {
            var t = this.length, n = +e + (e < 0 ? t : 0);
            return this.pushStack(n >= 0 && n < t ? [ this[n] ] : []);
        },
        end: function() {
            return this.prevObject || this.constructor(null);
        },
        push: o,
        sort: n.sort,
        splice: n.splice
    };
    p.extend = p.fn.extend = function() {
        var e, t, n, i, r, o, s = arguments[0] || {}, a = 1, l = arguments.length, f = false;
        if (typeof s === "boolean") {
            f = s;
            s = arguments[a] || {};
            a++;
        }
        if (typeof s !== "object" && !p.isFunction(s)) {
            s = {};
        }
        if (a === l) {
            s = this;
            a--;
        }
        for (;a < l; a++) {
            if ((e = arguments[a]) != null) {
                for (t in e) {
                    n = s[t];
                    i = e[t];
                    if (s === i) {
                        continue;
                    }
                    if (f && i && (p.isPlainObject(i) || (r = p.isArray(i)))) {
                        if (r) {
                            r = false;
                            o = n && p.isArray(n) ? n : [];
                        } else {
                            o = n && p.isPlainObject(n) ? n : {};
                        }
                        s[t] = p.extend(f, o, i);
                    } else if (i !== undefined) {
                        s[t] = i;
                    }
                }
            }
        }
        return s;
    };
    p.extend({
        expando: "jQuery" + (d + Math.random()).replace(/\D/g, ""),
        isReady: true,
        error: function(e) {
            throw new Error(e);
        },
        noop: function() {},
        isFunction: function(e) {
            return p.type(e) === "function";
        },
        isArray: Array.isArray,
        isWindow: function(e) {
            return e != null && e === e.window;
        },
        isNumeric: function(e) {
            return !p.isArray(e) && e - parseFloat(e) + 1 >= 0;
        },
        isPlainObject: function(e) {
            if (p.type(e) !== "object" || e.nodeType || p.isWindow(e)) {
                return false;
            }
            if (e.constructor && !f.call(e.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
            return true;
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) {
                return false;
            }
            return true;
        },
        type: function(e) {
            if (e == null) {
                return e + "";
            }
            return typeof e === "object" || typeof e === "function" ? a[l.call(e)] || "object" : typeof e;
        },
        globalEval: function(e) {
            var t, n = eval;
            e = p.trim(e);
            if (e) {
                if (e.indexOf("use strict") === 1) {
                    t = c.createElement("script");
                    t.text = e;
                    c.head.appendChild(t).parentNode.removeChild(t);
                } else {
                    n(e);
                }
            }
        },
        camelCase: function(e) {
            return e.replace(g, "ms-").replace(v, m);
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
        },
        each: function(e, t, n) {
            var i, r = 0, o = e.length, s = y(e);
            if (n) {
                if (s) {
                    for (;r < o; r++) {
                        i = t.apply(e[r], n);
                        if (i === false) {
                            break;
                        }
                    }
                } else {
                    for (r in e) {
                        i = t.apply(e[r], n);
                        if (i === false) {
                            break;
                        }
                    }
                }
            } else {
                if (s) {
                    for (;r < o; r++) {
                        i = t.call(e[r], r, e[r]);
                        if (i === false) {
                            break;
                        }
                    }
                } else {
                    for (r in e) {
                        i = t.call(e[r], r, e[r]);
                        if (i === false) {
                            break;
                        }
                    }
                }
            }
            return e;
        },
        trim: function(e) {
            return e == null ? "" : (e + "").replace(h, "");
        },
        makeArray: function(e, t) {
            var n = t || [];
            if (e != null) {
                if (y(Object(e))) {
                    p.merge(n, typeof e === "string" ? [ e ] : e);
                } else {
                    o.call(n, e);
                }
            }
            return n;
        },
        inArray: function(e, t, n) {
            return t == null ? -1 : s.call(t, e, n);
        },
        merge: function(e, t) {
            var n = +t.length, i = 0, r = e.length;
            for (;i < n; i++) {
                e[r++] = t[i];
            }
            e.length = r;
            return e;
        },
        grep: function(e, t, n) {
            var i, r = [], o = 0, s = e.length, a = !n;
            for (;o < s; o++) {
                i = !t(e[o], o);
                if (i !== a) {
                    r.push(e[o]);
                }
            }
            return r;
        },
        map: function(e, t, n) {
            var i, o = 0, s = e.length, a = y(e), l = [];
            if (a) {
                for (;o < s; o++) {
                    i = t(e[o], o, n);
                    if (i != null) {
                        l.push(i);
                    }
                }
            } else {
                for (o in e) {
                    i = t(e[o], o, n);
                    if (i != null) {
                        l.push(i);
                    }
                }
            }
            return r.apply([], l);
        },
        guid: 1,
        proxy: function(e, t) {
            var n, r, o;
            if (typeof t === "string") {
                n = e[t];
                t = e;
                e = n;
            }
            if (!p.isFunction(e)) {
                return undefined;
            }
            r = i.call(arguments, 2);
            o = function() {
                return e.apply(t || this, r.concat(i.call(arguments)));
            };
            o.guid = e.guid = e.guid || p.guid++;
            return o;
        },
        now: Date.now,
        support: u
    });
    p.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
        a["[object " + t + "]"] = t.toLowerCase();
    });
    function y(e) {
        var t = "length" in e && e.length, n = p.type(e);
        if (n === "function" || p.isWindow(e)) {
            return false;
        }
        if (e.nodeType === 1 && t) {
            return true;
        }
        return n === "array" || t === 0 || typeof t === "number" && t > 0 && t - 1 in e;
    }
    var b = function(e) {
        var t, n, i, r, o, s, a, l, f, u, c, d, p, h, g, v, m, y, b, w = "sizzle" + 1 * new Date(), x = e.document, C = 0, T = 0, D = ae(), k = ae(), E = ae(), S = function(e, t) {
            if (e === t) {
                c = true;
            }
            return 0;
        }, $ = 1 << 31, N = {}.hasOwnProperty, A = [], j = A.pop, L = A.push, I = A.push, O = A.slice, P = function(e, t) {
            var n = 0, i = e.length;
            for (;n < i; n++) {
                if (e[n] === t) {
                    return n;
                }
            }
            return -1;
        }, R = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", H = "[\\x20\\t\\r\\n\\f]", F = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", q = F.replace("w", "w#"), M = "\\[" + H + "*(" + F + ")(?:" + H + "*([*^$|!~]?=)" + H + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + q + "))|)" + H + "*\\]", _ = ":(" + F + ")(?:\\((" + "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" + "((?:\\\\.|[^\\\\()[\\]]|" + M + ")*)|" + ".*" + ")\\)|)", B = new RegExp(H + "+", "g"), W = new RegExp("^" + H + "+|((?:^|[^\\\\])(?:\\\\.)*)" + H + "+$", "g"), U = new RegExp("^" + H + "*," + H + "*"), z = new RegExp("^" + H + "*([>+~]|" + H + ")" + H + "*"), G = new RegExp("=" + H + "*([^\\]'\"]*?)" + H + "*\\]", "g"), Q = new RegExp(_), V = new RegExp("^" + q + "$"), X = {
            ID: new RegExp("^#(" + F + ")"),
            CLASS: new RegExp("^\\.(" + F + ")"),
            TAG: new RegExp("^(" + F.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + M),
            PSEUDO: new RegExp("^" + _),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + H + "*(even|odd|(([+-]|)(\\d*)n|)" + H + "*(?:([+-]|)" + H + "*(\\d+)|))" + H + "*\\)|)", "i"),
            bool: new RegExp("^(?:" + R + ")$", "i"),
            needsContext: new RegExp("^" + H + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + H + "*((?:-\\d)?\\d*)" + H + "*\\)|)(?=[^-]|$)", "i")
        }, Y = /^(?:input|select|textarea|button)$/i, J = /^h\d$/i, K = /^[^{]+\{\s*\[native \w/, Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, ee = /[+~]/, te = /'|\\/g, ne = new RegExp("\\\\([\\da-f]{1,6}" + H + "?|(" + H + ")|.)", "ig"), ie = function(e, t, n) {
            var i = "0x" + t - 65536;
            return i !== i || n ? t : i < 0 ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, i & 1023 | 56320);
        }, re = function() {
            d();
        };
        try {
            I.apply(A = O.call(x.childNodes), x.childNodes);
            A[x.childNodes.length].nodeType;
        } catch (oe) {
            I = {
                apply: A.length ? function(e, t) {
                    L.apply(e, O.call(t));
                } : function(e, t) {
                    var n = e.length, i = 0;
                    while (e[n++] = t[i++]) {}
                    e.length = n - 1;
                }
            };
        }
        function se(e, t, i, r) {
            var o, a, f, u, c, h, m, y, C, T;
            if ((t ? t.ownerDocument || t : x) !== p) {
                d(t);
            }
            t = t || p;
            i = i || [];
            u = t.nodeType;
            if (typeof e !== "string" || !e || u !== 1 && u !== 9 && u !== 11) {
                return i;
            }
            if (!r && g) {
                if (u !== 11 && (o = Z.exec(e))) {
                    if (f = o[1]) {
                        if (u === 9) {
                            a = t.getElementById(f);
                            if (a && a.parentNode) {
                                if (a.id === f) {
                                    i.push(a);
                                    return i;
                                }
                            } else {
                                return i;
                            }
                        } else {
                            if (t.ownerDocument && (a = t.ownerDocument.getElementById(f)) && b(t, a) && a.id === f) {
                                i.push(a);
                                return i;
                            }
                        }
                    } else if (o[2]) {
                        I.apply(i, t.getElementsByTagName(e));
                        return i;
                    } else if ((f = o[3]) && n.getElementsByClassName) {
                        I.apply(i, t.getElementsByClassName(f));
                        return i;
                    }
                }
                if (n.qsa && (!v || !v.test(e))) {
                    y = m = w;
                    C = t;
                    T = u !== 1 && e;
                    if (u === 1 && t.nodeName.toLowerCase() !== "object") {
                        h = s(e);
                        if (m = t.getAttribute("id")) {
                            y = m.replace(te, "\\$&");
                        } else {
                            t.setAttribute("id", y);
                        }
                        y = "[id='" + y + "'] ";
                        c = h.length;
                        while (c--) {
                            h[c] = y + me(h[c]);
                        }
                        C = ee.test(e) && ge(t.parentNode) || t;
                        T = h.join(",");
                    }
                    if (T) {
                        try {
                            I.apply(i, C.querySelectorAll(T));
                            return i;
                        } catch (D) {} finally {
                            if (!m) {
                                t.removeAttribute("id");
                            }
                        }
                    }
                }
            }
            return l(e.replace(W, "$1"), t, i, r);
        }
        function ae() {
            var e = [];
            function t(n, r) {
                if (e.push(n + " ") > i.cacheLength) {
                    delete t[e.shift()];
                }
                return t[n + " "] = r;
            }
            return t;
        }
        function le(e) {
            e[w] = true;
            return e;
        }
        function fe(e) {
            var t = p.createElement("div");
            try {
                return !!e(t);
            } catch (n) {
                return false;
            } finally {
                if (t.parentNode) {
                    t.parentNode.removeChild(t);
                }
                t = null;
            }
        }
        function ue(e, t) {
            var n = e.split("|"), r = e.length;
            while (r--) {
                i.attrHandle[n[r]] = t;
            }
        }
        function ce(e, t) {
            var n = t && e, i = n && e.nodeType === 1 && t.nodeType === 1 && (~t.sourceIndex || $) - (~e.sourceIndex || $);
            if (i) {
                return i;
            }
            if (n) {
                while (n = n.nextSibling) {
                    if (n === t) {
                        return -1;
                    }
                }
            }
            return e ? 1 : -1;
        }
        function de(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return n === "input" && t.type === e;
            };
        }
        function pe(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return (n === "input" || n === "button") && t.type === e;
            };
        }
        function he(e) {
            return le(function(t) {
                t = +t;
                return le(function(n, i) {
                    var r, o = e([], n.length, t), s = o.length;
                    while (s--) {
                        if (n[r = o[s]]) {
                            n[r] = !(i[r] = n[r]);
                        }
                    }
                });
            });
        }
        function ge(e) {
            return e && typeof e.getElementsByTagName !== "undefined" && e;
        }
        n = se.support = {};
        o = se.isXML = function(e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return t ? t.nodeName !== "HTML" : false;
        };
        d = se.setDocument = function(e) {
            var t, r, s = e ? e.ownerDocument || e : x;
            if (s === p || s.nodeType !== 9 || !s.documentElement) {
                return p;
            }
            p = s;
            h = s.documentElement;
            r = s.defaultView;
            if (r && r !== r.top) {
                if (r.addEventListener) {
                    r.addEventListener("unload", re, false);
                } else if (r.attachEvent) {
                    r.attachEvent("onunload", re);
                }
            }
            g = !o(s);
            n.attributes = fe(function(e) {
                e.className = "i";
                return !e.getAttribute("className");
            });
            n.getElementsByTagName = fe(function(e) {
                e.appendChild(s.createComment(""));
                return !e.getElementsByTagName("*").length;
            });
            n.getElementsByClassName = K.test(s.getElementsByClassName);
            n.getById = fe(function(e) {
                h.appendChild(e).id = w;
                return !s.getElementsByName || !s.getElementsByName(w).length;
            });
            if (n.getById) {
                i.find["ID"] = function(e, t) {
                    if (typeof t.getElementById !== "undefined" && g) {
                        var n = t.getElementById(e);
                        return n && n.parentNode ? [ n ] : [];
                    }
                };
                i.filter["ID"] = function(e) {
                    var t = e.replace(ne, ie);
                    return function(e) {
                        return e.getAttribute("id") === t;
                    };
                };
            } else {
                delete i.find["ID"];
                i.filter["ID"] = function(e) {
                    var t = e.replace(ne, ie);
                    return function(e) {
                        var n = typeof e.getAttributeNode !== "undefined" && e.getAttributeNode("id");
                        return n && n.value === t;
                    };
                };
            }
            i.find["TAG"] = n.getElementsByTagName ? function(e, t) {
                if (typeof t.getElementsByTagName !== "undefined") {
                    return t.getElementsByTagName(e);
                } else if (n.qsa) {
                    return t.querySelectorAll(e);
                }
            } : function(e, t) {
                var n, i = [], r = 0, o = t.getElementsByTagName(e);
                if (e === "*") {
                    while (n = o[r++]) {
                        if (n.nodeType === 1) {
                            i.push(n);
                        }
                    }
                    return i;
                }
                return o;
            };
            i.find["CLASS"] = n.getElementsByClassName && function(e, t) {
                if (g) {
                    return t.getElementsByClassName(e);
                }
            };
            m = [];
            v = [];
            if (n.qsa = K.test(s.querySelectorAll)) {
                fe(function(e) {
                    h.appendChild(e).innerHTML = "<a id='" + w + "'></a>" + "<select id='" + w + "-\f]' msallowcapture=''>" + "<option selected=''></option></select>";
                    if (e.querySelectorAll("[msallowcapture^='']").length) {
                        v.push("[*^$]=" + H + "*(?:''|\"\")");
                    }
                    if (!e.querySelectorAll("[selected]").length) {
                        v.push("\\[" + H + "*(?:value|" + R + ")");
                    }
                    if (!e.querySelectorAll("[id~=" + w + "-]").length) {
                        v.push("~=");
                    }
                    if (!e.querySelectorAll(":checked").length) {
                        v.push(":checked");
                    }
                    if (!e.querySelectorAll("a#" + w + "+*").length) {
                        v.push(".#.+[+~]");
                    }
                });
                fe(function(e) {
                    var t = s.createElement("input");
                    t.setAttribute("type", "hidden");
                    e.appendChild(t).setAttribute("name", "D");
                    if (e.querySelectorAll("[name=d]").length) {
                        v.push("name" + H + "*[*^$|!~]?=");
                    }
                    if (!e.querySelectorAll(":enabled").length) {
                        v.push(":enabled", ":disabled");
                    }
                    e.querySelectorAll("*,:x");
                    v.push(",.*:");
                });
            }
            if (n.matchesSelector = K.test(y = h.matches || h.webkitMatchesSelector || h.mozMatchesSelector || h.oMatchesSelector || h.msMatchesSelector)) {
                fe(function(e) {
                    n.disconnectedMatch = y.call(e, "div");
                    y.call(e, "[s!='']:x");
                    m.push("!=", _);
                });
            }
            v = v.length && new RegExp(v.join("|"));
            m = m.length && new RegExp(m.join("|"));
            t = K.test(h.compareDocumentPosition);
            b = t || K.test(h.contains) ? function(e, t) {
                var n = e.nodeType === 9 ? e.documentElement : e, i = t && t.parentNode;
                return e === i || !!(i && i.nodeType === 1 && (n.contains ? n.contains(i) : e.compareDocumentPosition && e.compareDocumentPosition(i) & 16));
            } : function(e, t) {
                if (t) {
                    while (t = t.parentNode) {
                        if (t === e) {
                            return true;
                        }
                    }
                }
                return false;
            };
            S = t ? function(e, t) {
                if (e === t) {
                    c = true;
                    return 0;
                }
                var i = !e.compareDocumentPosition - !t.compareDocumentPosition;
                if (i) {
                    return i;
                }
                i = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1;
                if (i & 1 || !n.sortDetached && t.compareDocumentPosition(e) === i) {
                    if (e === s || e.ownerDocument === x && b(x, e)) {
                        return -1;
                    }
                    if (t === s || t.ownerDocument === x && b(x, t)) {
                        return 1;
                    }
                    return u ? P(u, e) - P(u, t) : 0;
                }
                return i & 4 ? -1 : 1;
            } : function(e, t) {
                if (e === t) {
                    c = true;
                    return 0;
                }
                var n, i = 0, r = e.parentNode, o = t.parentNode, a = [ e ], l = [ t ];
                if (!r || !o) {
                    return e === s ? -1 : t === s ? 1 : r ? -1 : o ? 1 : u ? P(u, e) - P(u, t) : 0;
                } else if (r === o) {
                    return ce(e, t);
                }
                n = e;
                while (n = n.parentNode) {
                    a.unshift(n);
                }
                n = t;
                while (n = n.parentNode) {
                    l.unshift(n);
                }
                while (a[i] === l[i]) {
                    i++;
                }
                return i ? ce(a[i], l[i]) : a[i] === x ? -1 : l[i] === x ? 1 : 0;
            };
            return s;
        };
        se.matches = function(e, t) {
            return se(e, null, null, t);
        };
        se.matchesSelector = function(e, t) {
            if ((e.ownerDocument || e) !== p) {
                d(e);
            }
            t = t.replace(G, "='$1']");
            if (n.matchesSelector && g && (!m || !m.test(t)) && (!v || !v.test(t))) {
                try {
                    var i = y.call(e, t);
                    if (i || n.disconnectedMatch || e.document && e.document.nodeType !== 11) {
                        return i;
                    }
                } catch (r) {}
            }
            return se(t, p, null, [ e ]).length > 0;
        };
        se.contains = function(e, t) {
            if ((e.ownerDocument || e) !== p) {
                d(e);
            }
            return b(e, t);
        };
        se.attr = function(e, t) {
            if ((e.ownerDocument || e) !== p) {
                d(e);
            }
            var r = i.attrHandle[t.toLowerCase()], o = r && N.call(i.attrHandle, t.toLowerCase()) ? r(e, t, !g) : undefined;
            return o !== undefined ? o : n.attributes || !g ? e.getAttribute(t) : (o = e.getAttributeNode(t)) && o.specified ? o.value : null;
        };
        se.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e);
        };
        se.uniqueSort = function(e) {
            var t, i = [], r = 0, o = 0;
            c = !n.detectDuplicates;
            u = !n.sortStable && e.slice(0);
            e.sort(S);
            if (c) {
                while (t = e[o++]) {
                    if (t === e[o]) {
                        r = i.push(o);
                    }
                }
                while (r--) {
                    e.splice(i[r], 1);
                }
            }
            u = null;
            return e;
        };
        r = se.getText = function(e) {
            var t, n = "", i = 0, o = e.nodeType;
            if (!o) {
                while (t = e[i++]) {
                    n += r(t);
                }
            } else if (o === 1 || o === 9 || o === 11) {
                if (typeof e.textContent === "string") {
                    return e.textContent;
                } else {
                    for (e = e.firstChild; e; e = e.nextSibling) {
                        n += r(e);
                    }
                }
            } else if (o === 3 || o === 4) {
                return e.nodeValue;
            }
            return n;
        };
        i = se.selectors = {
            cacheLength: 50,
            createPseudo: le,
            match: X,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: true
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: true
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    e[1] = e[1].replace(ne, ie);
                    e[3] = (e[3] || e[4] || e[5] || "").replace(ne, ie);
                    if (e[2] === "~=") {
                        e[3] = " " + e[3] + " ";
                    }
                    return e.slice(0, 4);
                },
                CHILD: function(e) {
                    e[1] = e[1].toLowerCase();
                    if (e[1].slice(0, 3) === "nth") {
                        if (!e[3]) {
                            se.error(e[0]);
                        }
                        e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * (e[3] === "even" || e[3] === "odd"));
                        e[5] = +(e[7] + e[8] || e[3] === "odd");
                    } else if (e[3]) {
                        se.error(e[0]);
                    }
                    return e;
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    if (X["CHILD"].test(e[0])) {
                        return null;
                    }
                    if (e[3]) {
                        e[2] = e[4] || e[5] || "";
                    } else if (n && Q.test(n) && (t = s(n, true)) && (t = n.indexOf(")", n.length - t) - n.length)) {
                        e[0] = e[0].slice(0, t);
                        e[2] = n.slice(0, t);
                    }
                    return e.slice(0, 3);
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(ne, ie).toLowerCase();
                    return e === "*" ? function() {
                        return true;
                    } : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t;
                    };
                },
                CLASS: function(e) {
                    var t = D[e + " "];
                    return t || (t = new RegExp("(^|" + H + ")" + e + "(" + H + "|$)")) && D(e, function(e) {
                        return t.test(typeof e.className === "string" && e.className || typeof e.getAttribute !== "undefined" && e.getAttribute("class") || "");
                    });
                },
                ATTR: function(e, t, n) {
                    return function(i) {
                        var r = se.attr(i, e);
                        if (r == null) {
                            return t === "!=";
                        }
                        if (!t) {
                            return true;
                        }
                        r += "";
                        return t === "=" ? r === n : t === "!=" ? r !== n : t === "^=" ? n && r.indexOf(n) === 0 : t === "*=" ? n && r.indexOf(n) > -1 : t === "$=" ? n && r.slice(-n.length) === n : t === "~=" ? (" " + r.replace(B, " ") + " ").indexOf(n) > -1 : t === "|=" ? r === n || r.slice(0, n.length + 1) === n + "-" : false;
                    };
                },
                CHILD: function(e, t, n, i, r) {
                    var o = e.slice(0, 3) !== "nth", s = e.slice(-4) !== "last", a = t === "of-type";
                    return i === 1 && r === 0 ? function(e) {
                        return !!e.parentNode;
                    } : function(t, n, l) {
                        var f, u, c, d, p, h, g = o !== s ? "nextSibling" : "previousSibling", v = t.parentNode, m = a && t.nodeName.toLowerCase(), y = !l && !a;
                        if (v) {
                            if (o) {
                                while (g) {
                                    c = t;
                                    while (c = c[g]) {
                                        if (a ? c.nodeName.toLowerCase() === m : c.nodeType === 1) {
                                            return false;
                                        }
                                    }
                                    h = g = e === "only" && !h && "nextSibling";
                                }
                                return true;
                            }
                            h = [ s ? v.firstChild : v.lastChild ];
                            if (s && y) {
                                u = v[w] || (v[w] = {});
                                f = u[e] || [];
                                p = f[0] === C && f[1];
                                d = f[0] === C && f[2];
                                c = p && v.childNodes[p];
                                while (c = ++p && c && c[g] || (d = p = 0) || h.pop()) {
                                    if (c.nodeType === 1 && ++d && c === t) {
                                        u[e] = [ C, p, d ];
                                        break;
                                    }
                                }
                            } else if (y && (f = (t[w] || (t[w] = {}))[e]) && f[0] === C) {
                                d = f[1];
                            } else {
                                while (c = ++p && c && c[g] || (d = p = 0) || h.pop()) {
                                    if ((a ? c.nodeName.toLowerCase() === m : c.nodeType === 1) && ++d) {
                                        if (y) {
                                            (c[w] || (c[w] = {}))[e] = [ C, d ];
                                        }
                                        if (c === t) {
                                            break;
                                        }
                                    }
                                }
                            }
                            d -= r;
                            return d === i || d % i === 0 && d / i >= 0;
                        }
                    };
                },
                PSEUDO: function(e, t) {
                    var n, r = i.pseudos[e] || i.setFilters[e.toLowerCase()] || se.error("unsupported pseudo: " + e);
                    if (r[w]) {
                        return r(t);
                    }
                    if (r.length > 1) {
                        n = [ e, e, "", t ];
                        return i.setFilters.hasOwnProperty(e.toLowerCase()) ? le(function(e, n) {
                            var i, o = r(e, t), s = o.length;
                            while (s--) {
                                i = P(e, o[s]);
                                e[i] = !(n[i] = o[s]);
                            }
                        }) : function(e) {
                            return r(e, 0, n);
                        };
                    }
                    return r;
                }
            },
            pseudos: {
                not: le(function(e) {
                    var t = [], n = [], i = a(e.replace(W, "$1"));
                    return i[w] ? le(function(e, t, n, r) {
                        var o, s = i(e, null, r, []), a = e.length;
                        while (a--) {
                            if (o = s[a]) {
                                e[a] = !(t[a] = o);
                            }
                        }
                    }) : function(e, r, o) {
                        t[0] = e;
                        i(t, null, o, n);
                        t[0] = null;
                        return !n.pop();
                    };
                }),
                has: le(function(e) {
                    return function(t) {
                        return se(e, t).length > 0;
                    };
                }),
                contains: le(function(e) {
                    e = e.replace(ne, ie);
                    return function(t) {
                        return (t.textContent || t.innerText || r(t)).indexOf(e) > -1;
                    };
                }),
                lang: le(function(e) {
                    if (!V.test(e || "")) {
                        se.error("unsupported lang: " + e);
                    }
                    e = e.replace(ne, ie).toLowerCase();
                    return function(t) {
                        var n;
                        do {
                            if (n = g ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) {
                                n = n.toLowerCase();
                                return n === e || n.indexOf(e + "-") === 0;
                            }
                        } while ((t = t.parentNode) && t.nodeType === 1);
                        return false;
                    };
                }),
                target: function(t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id;
                },
                root: function(e) {
                    return e === h;
                },
                focus: function(e) {
                    return e === p.activeElement && (!p.hasFocus || p.hasFocus()) && !!(e.type || e.href || ~e.tabIndex);
                },
                enabled: function(e) {
                    return e.disabled === false;
                },
                disabled: function(e) {
                    return e.disabled === true;
                },
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return t === "input" && !!e.checked || t === "option" && !!e.selected;
                },
                selected: function(e) {
                    if (e.parentNode) {
                        e.parentNode.selectedIndex;
                    }
                    return e.selected === true;
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling) {
                        if (e.nodeType < 6) {
                            return false;
                        }
                    }
                    return true;
                },
                parent: function(e) {
                    return !i.pseudos["empty"](e);
                },
                header: function(e) {
                    return J.test(e.nodeName);
                },
                input: function(e) {
                    return Y.test(e.nodeName);
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return t === "input" && e.type === "button" || t === "button";
                },
                text: function(e) {
                    var t;
                    return e.nodeName.toLowerCase() === "input" && e.type === "text" && ((t = e.getAttribute("type")) == null || t.toLowerCase() === "text");
                },
                first: he(function() {
                    return [ 0 ];
                }),
                last: he(function(e, t) {
                    return [ t - 1 ];
                }),
                eq: he(function(e, t, n) {
                    return [ n < 0 ? n + t : n ];
                }),
                even: he(function(e, t) {
                    var n = 0;
                    for (;n < t; n += 2) {
                        e.push(n);
                    }
                    return e;
                }),
                odd: he(function(e, t) {
                    var n = 1;
                    for (;n < t; n += 2) {
                        e.push(n);
                    }
                    return e;
                }),
                lt: he(function(e, t, n) {
                    var i = n < 0 ? n + t : n;
                    for (;--i >= 0; ) {
                        e.push(i);
                    }
                    return e;
                }),
                gt: he(function(e, t, n) {
                    var i = n < 0 ? n + t : n;
                    for (;++i < t; ) {
                        e.push(i);
                    }
                    return e;
                })
            }
        };
        i.pseudos["nth"] = i.pseudos["eq"];
        for (t in {
            radio: true,
            checkbox: true,
            file: true,
            password: true,
            image: true
        }) {
            i.pseudos[t] = de(t);
        }
        for (t in {
            submit: true,
            reset: true
        }) {
            i.pseudos[t] = pe(t);
        }
        function ve() {}
        ve.prototype = i.filters = i.pseudos;
        i.setFilters = new ve();
        s = se.tokenize = function(e, t) {
            var n, r, o, s, a, l, f, u = k[e + " "];
            if (u) {
                return t ? 0 : u.slice(0);
            }
            a = e;
            l = [];
            f = i.preFilter;
            while (a) {
                if (!n || (r = U.exec(a))) {
                    if (r) {
                        a = a.slice(r[0].length) || a;
                    }
                    l.push(o = []);
                }
                n = false;
                if (r = z.exec(a)) {
                    n = r.shift();
                    o.push({
                        value: n,
                        type: r[0].replace(W, " ")
                    });
                    a = a.slice(n.length);
                }
                for (s in i.filter) {
                    if ((r = X[s].exec(a)) && (!f[s] || (r = f[s](r)))) {
                        n = r.shift();
                        o.push({
                            value: n,
                            type: s,
                            matches: r
                        });
                        a = a.slice(n.length);
                    }
                }
                if (!n) {
                    break;
                }
            }
            return t ? a.length : a ? se.error(e) : k(e, l).slice(0);
        };
        function me(e) {
            var t = 0, n = e.length, i = "";
            for (;t < n; t++) {
                i += e[t].value;
            }
            return i;
        }
        function ye(e, t, n) {
            var i = t.dir, r = n && i === "parentNode", o = T++;
            return t.first ? function(t, n, o) {
                while (t = t[i]) {
                    if (t.nodeType === 1 || r) {
                        return e(t, n, o);
                    }
                }
            } : function(t, n, s) {
                var a, l, f = [ C, o ];
                if (s) {
                    while (t = t[i]) {
                        if (t.nodeType === 1 || r) {
                            if (e(t, n, s)) {
                                return true;
                            }
                        }
                    }
                } else {
                    while (t = t[i]) {
                        if (t.nodeType === 1 || r) {
                            l = t[w] || (t[w] = {});
                            if ((a = l[i]) && a[0] === C && a[1] === o) {
                                return f[2] = a[2];
                            } else {
                                l[i] = f;
                                if (f[2] = e(t, n, s)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            };
        }
        function be(e) {
            return e.length > 1 ? function(t, n, i) {
                var r = e.length;
                while (r--) {
                    if (!e[r](t, n, i)) {
                        return false;
                    }
                }
                return true;
            } : e[0];
        }
        function we(e, t, n) {
            var i = 0, r = t.length;
            for (;i < r; i++) {
                se(e, t[i], n);
            }
            return n;
        }
        function xe(e, t, n, i, r) {
            var o, s = [], a = 0, l = e.length, f = t != null;
            for (;a < l; a++) {
                if (o = e[a]) {
                    if (!n || n(o, i, r)) {
                        s.push(o);
                        if (f) {
                            t.push(a);
                        }
                    }
                }
            }
            return s;
        }
        function Ce(e, t, n, i, r, o) {
            if (i && !i[w]) {
                i = Ce(i);
            }
            if (r && !r[w]) {
                r = Ce(r, o);
            }
            return le(function(o, s, a, l) {
                var f, u, c, d = [], p = [], h = s.length, g = o || we(t || "*", a.nodeType ? [ a ] : a, []), v = e && (o || !t) ? xe(g, d, e, a, l) : g, m = n ? r || (o ? e : h || i) ? [] : s : v;
                if (n) {
                    n(v, m, a, l);
                }
                if (i) {
                    f = xe(m, p);
                    i(f, [], a, l);
                    u = f.length;
                    while (u--) {
                        if (c = f[u]) {
                            m[p[u]] = !(v[p[u]] = c);
                        }
                    }
                }
                if (o) {
                    if (r || e) {
                        if (r) {
                            f = [];
                            u = m.length;
                            while (u--) {
                                if (c = m[u]) {
                                    f.push(v[u] = c);
                                }
                            }
                            r(null, m = [], f, l);
                        }
                        u = m.length;
                        while (u--) {
                            if ((c = m[u]) && (f = r ? P(o, c) : d[u]) > -1) {
                                o[f] = !(s[f] = c);
                            }
                        }
                    }
                } else {
                    m = xe(m === s ? m.splice(h, m.length) : m);
                    if (r) {
                        r(null, s, m, l);
                    } else {
                        I.apply(s, m);
                    }
                }
            });
        }
        function Te(e) {
            var t, n, r, o = e.length, s = i.relative[e[0].type], a = s || i.relative[" "], l = s ? 1 : 0, u = ye(function(e) {
                return e === t;
            }, a, true), c = ye(function(e) {
                return P(t, e) > -1;
            }, a, true), d = [ function(e, n, i) {
                var r = !s && (i || n !== f) || ((t = n).nodeType ? u(e, n, i) : c(e, n, i));
                t = null;
                return r;
            } ];
            for (;l < o; l++) {
                if (n = i.relative[e[l].type]) {
                    d = [ ye(be(d), n) ];
                } else {
                    n = i.filter[e[l].type].apply(null, e[l].matches);
                    if (n[w]) {
                        r = ++l;
                        for (;r < o; r++) {
                            if (i.relative[e[r].type]) {
                                break;
                            }
                        }
                        return Ce(l > 1 && be(d), l > 1 && me(e.slice(0, l - 1).concat({
                            value: e[l - 2].type === " " ? "*" : ""
                        })).replace(W, "$1"), n, l < r && Te(e.slice(l, r)), r < o && Te(e = e.slice(r)), r < o && me(e));
                    }
                    d.push(n);
                }
            }
            return be(d);
        }
        function De(e, t) {
            var n = t.length > 0, r = e.length > 0, o = function(o, s, a, l, u) {
                var c, d, h, g = 0, v = "0", m = o && [], y = [], b = f, w = o || r && i.find["TAG"]("*", u), x = C += b == null ? 1 : Math.random() || .1, T = w.length;
                if (u) {
                    f = s !== p && s;
                }
                for (;v !== T && (c = w[v]) != null; v++) {
                    if (r && c) {
                        d = 0;
                        while (h = e[d++]) {
                            if (h(c, s, a)) {
                                l.push(c);
                                break;
                            }
                        }
                        if (u) {
                            C = x;
                        }
                    }
                    if (n) {
                        if (c = !h && c) {
                            g--;
                        }
                        if (o) {
                            m.push(c);
                        }
                    }
                }
                g += v;
                if (n && v !== g) {
                    d = 0;
                    while (h = t[d++]) {
                        h(m, y, s, a);
                    }
                    if (o) {
                        if (g > 0) {
                            while (v--) {
                                if (!(m[v] || y[v])) {
                                    y[v] = j.call(l);
                                }
                            }
                        }
                        y = xe(y);
                    }
                    I.apply(l, y);
                    if (u && !o && y.length > 0 && g + t.length > 1) {
                        se.uniqueSort(l);
                    }
                }
                if (u) {
                    C = x;
                    f = b;
                }
                return m;
            };
            return n ? le(o) : o;
        }
        a = se.compile = function(e, t) {
            var n, i = [], r = [], o = E[e + " "];
            if (!o) {
                if (!t) {
                    t = s(e);
                }
                n = t.length;
                while (n--) {
                    o = Te(t[n]);
                    if (o[w]) {
                        i.push(o);
                    } else {
                        r.push(o);
                    }
                }
                o = E(e, De(r, i));
                o.selector = e;
            }
            return o;
        };
        l = se.select = function(e, t, r, o) {
            var l, f, u, c, d, p = typeof e === "function" && e, h = !o && s(e = p.selector || e);
            r = r || [];
            if (h.length === 1) {
                f = h[0] = h[0].slice(0);
                if (f.length > 2 && (u = f[0]).type === "ID" && n.getById && t.nodeType === 9 && g && i.relative[f[1].type]) {
                    t = (i.find["ID"](u.matches[0].replace(ne, ie), t) || [])[0];
                    if (!t) {
                        return r;
                    } else if (p) {
                        t = t.parentNode;
                    }
                    e = e.slice(f.shift().value.length);
                }
                l = X["needsContext"].test(e) ? 0 : f.length;
                while (l--) {
                    u = f[l];
                    if (i.relative[c = u.type]) {
                        break;
                    }
                    if (d = i.find[c]) {
                        if (o = d(u.matches[0].replace(ne, ie), ee.test(f[0].type) && ge(t.parentNode) || t)) {
                            f.splice(l, 1);
                            e = o.length && me(f);
                            if (!e) {
                                I.apply(r, o);
                                return r;
                            }
                            break;
                        }
                    }
                }
            }
            (p || a(e, h))(o, t, !g, r, ee.test(e) && ge(t.parentNode) || t);
            return r;
        };
        n.sortStable = w.split("").sort(S).join("") === w;
        n.detectDuplicates = !!c;
        d();
        n.sortDetached = fe(function(e) {
            return e.compareDocumentPosition(p.createElement("div")) & 1;
        });
        if (!fe(function(e) {
            e.innerHTML = "<a href='#'></a>";
            return e.firstChild.getAttribute("href") === "#";
        })) {
            ue("type|href|height|width", function(e, t, n) {
                if (!n) {
                    return e.getAttribute(t, t.toLowerCase() === "type" ? 1 : 2);
                }
            });
        }
        if (!n.attributes || !fe(function(e) {
            e.innerHTML = "<input/>";
            e.firstChild.setAttribute("value", "");
            return e.firstChild.getAttribute("value") === "";
        })) {
            ue("value", function(e, t, n) {
                if (!n && e.nodeName.toLowerCase() === "input") {
                    return e.defaultValue;
                }
            });
        }
        if (!fe(function(e) {
            return e.getAttribute("disabled") == null;
        })) {
            ue(R, function(e, t, n) {
                var i;
                if (!n) {
                    return e[t] === true ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null;
                }
            });
        }
        return se;
    }(e);
    p.find = b;
    p.expr = b.selectors;
    p.expr[":"] = p.expr.pseudos;
    p.unique = b.uniqueSort;
    p.text = b.getText;
    p.isXMLDoc = b.isXML;
    p.contains = b.contains;
    var w = p.expr.match.needsContext;
    var x = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
    var C = /^.[^:#\[\.,]*$/;
    function T(e, t, n) {
        if (p.isFunction(t)) {
            return p.grep(e, function(e, i) {
                return !!t.call(e, i, e) !== n;
            });
        }
        if (t.nodeType) {
            return p.grep(e, function(e) {
                return e === t !== n;
            });
        }
        if (typeof t === "string") {
            if (C.test(t)) {
                return p.filter(t, e, n);
            }
            t = p.filter(t, e);
        }
        return p.grep(e, function(e) {
            return s.call(t, e) >= 0 !== n;
        });
    }
    p.filter = function(e, t, n) {
        var i = t[0];
        if (n) {
            e = ":not(" + e + ")";
        }
        return t.length === 1 && i.nodeType === 1 ? p.find.matchesSelector(i, e) ? [ i ] : [] : p.find.matches(e, p.grep(t, function(e) {
            return e.nodeType === 1;
        }));
    };
    p.fn.extend({
        find: function(e) {
            var t, n = this.length, i = [], r = this;
            if (typeof e !== "string") {
                return this.pushStack(p(e).filter(function() {
                    for (t = 0; t < n; t++) {
                        if (p.contains(r[t], this)) {
                            return true;
                        }
                    }
                }));
            }
            for (t = 0; t < n; t++) {
                p.find(e, r[t], i);
            }
            i = this.pushStack(n > 1 ? p.unique(i) : i);
            i.selector = this.selector ? this.selector + " " + e : e;
            return i;
        },
        filter: function(e) {
            return this.pushStack(T(this, e || [], false));
        },
        not: function(e) {
            return this.pushStack(T(this, e || [], true));
        },
        is: function(e) {
            return !!T(this, typeof e === "string" && w.test(e) ? p(e) : e || [], false).length;
        }
    });
    var D, k = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, E = p.fn.init = function(e, t) {
        var n, i;
        if (!e) {
            return this;
        }
        if (typeof e === "string") {
            if (e[0] === "<" && e[e.length - 1] === ">" && e.length >= 3) {
                n = [ null, e, null ];
            } else {
                n = k.exec(e);
            }
            if (n && (n[1] || !t)) {
                if (n[1]) {
                    t = t instanceof p ? t[0] : t;
                    p.merge(this, p.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : c, true));
                    if (x.test(n[1]) && p.isPlainObject(t)) {
                        for (n in t) {
                            if (p.isFunction(this[n])) {
                                this[n](t[n]);
                            } else {
                                this.attr(n, t[n]);
                            }
                        }
                    }
                    return this;
                } else {
                    i = c.getElementById(n[2]);
                    if (i && i.parentNode) {
                        this.length = 1;
                        this[0] = i;
                    }
                    this.context = c;
                    this.selector = e;
                    return this;
                }
            } else if (!t || t.jquery) {
                return (t || D).find(e);
            } else {
                return this.constructor(t).find(e);
            }
        } else if (e.nodeType) {
            this.context = this[0] = e;
            this.length = 1;
            return this;
        } else if (p.isFunction(e)) {
            return typeof D.ready !== "undefined" ? D.ready(e) : e(p);
        }
        if (e.selector !== undefined) {
            this.selector = e.selector;
            this.context = e.context;
        }
        return p.makeArray(e, this);
    };
    E.prototype = p.fn;
    D = p(c);
    var S = /^(?:parents|prev(?:Until|All))/, $ = {
        children: true,
        contents: true,
        next: true,
        prev: true
    };
    p.extend({
        dir: function(e, t, n) {
            var i = [], r = n !== undefined;
            while ((e = e[t]) && e.nodeType !== 9) {
                if (e.nodeType === 1) {
                    if (r && p(e).is(n)) {
                        break;
                    }
                    i.push(e);
                }
            }
            return i;
        },
        sibling: function(e, t) {
            var n = [];
            for (;e; e = e.nextSibling) {
                if (e.nodeType === 1 && e !== t) {
                    n.push(e);
                }
            }
            return n;
        }
    });
    p.fn.extend({
        has: function(e) {
            var t = p(e, this), n = t.length;
            return this.filter(function() {
                var e = 0;
                for (;e < n; e++) {
                    if (p.contains(this, t[e])) {
                        return true;
                    }
                }
            });
        },
        closest: function(e, t) {
            var n, i = 0, r = this.length, o = [], s = w.test(e) || typeof e !== "string" ? p(e, t || this.context) : 0;
            for (;i < r; i++) {
                for (n = this[i]; n && n !== t; n = n.parentNode) {
                    if (n.nodeType < 11 && (s ? s.index(n) > -1 : n.nodeType === 1 && p.find.matchesSelector(n, e))) {
                        o.push(n);
                        break;
                    }
                }
            }
            return this.pushStack(o.length > 1 ? p.unique(o) : o);
        },
        index: function(e) {
            if (!e) {
                return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
            }
            if (typeof e === "string") {
                return s.call(p(e), this[0]);
            }
            return s.call(this, e.jquery ? e[0] : e);
        },
        add: function(e, t) {
            return this.pushStack(p.unique(p.merge(this.get(), p(e, t))));
        },
        addBack: function(e) {
            return this.add(e == null ? this.prevObject : this.prevObject.filter(e));
        }
    });
    function N(e, t) {
        while ((e = e[t]) && e.nodeType !== 1) {}
        return e;
    }
    p.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && t.nodeType !== 11 ? t : null;
        },
        parents: function(e) {
            return p.dir(e, "parentNode");
        },
        parentsUntil: function(e, t, n) {
            return p.dir(e, "parentNode", n);
        },
        next: function(e) {
            return N(e, "nextSibling");
        },
        prev: function(e) {
            return N(e, "previousSibling");
        },
        nextAll: function(e) {
            return p.dir(e, "nextSibling");
        },
        prevAll: function(e) {
            return p.dir(e, "previousSibling");
        },
        nextUntil: function(e, t, n) {
            return p.dir(e, "nextSibling", n);
        },
        prevUntil: function(e, t, n) {
            return p.dir(e, "previousSibling", n);
        },
        siblings: function(e) {
            return p.sibling((e.parentNode || {}).firstChild, e);
        },
        children: function(e) {
            return p.sibling(e.firstChild);
        },
        contents: function(e) {
            return e.contentDocument || p.merge([], e.childNodes);
        }
    }, function(e, t) {
        p.fn[e] = function(n, i) {
            var r = p.map(this, t, n);
            if (e.slice(-5) !== "Until") {
                i = n;
            }
            if (i && typeof i === "string") {
                r = p.filter(i, r);
            }
            if (this.length > 1) {
                if (!$[e]) {
                    p.unique(r);
                }
                if (S.test(e)) {
                    r.reverse();
                }
            }
            return this.pushStack(r);
        };
    });
    var A = /\S+/g;
    var j = {};
    function L(e) {
        var t = j[e] = {};
        p.each(e.match(A) || [], function(e, n) {
            t[n] = true;
        });
        return t;
    }
    p.Callbacks = function(e) {
        e = typeof e === "string" ? j[e] || L(e) : p.extend({}, e);
        var t, n, i, r, o, s, a = [], l = !e.once && [], f = function(c) {
            t = e.memory && c;
            n = true;
            s = r || 0;
            r = 0;
            o = a.length;
            i = true;
            for (;a && s < o; s++) {
                if (a[s].apply(c[0], c[1]) === false && e.stopOnFalse) {
                    t = false;
                    break;
                }
            }
            i = false;
            if (a) {
                if (l) {
                    if (l.length) {
                        f(l.shift());
                    }
                } else if (t) {
                    a = [];
                } else {
                    u.disable();
                }
            }
        }, u = {
            add: function() {
                if (a) {
                    var n = a.length;
                    (function s(t) {
                        p.each(t, function(t, n) {
                            var i = p.type(n);
                            if (i === "function") {
                                if (!e.unique || !u.has(n)) {
                                    a.push(n);
                                }
                            } else if (n && n.length && i !== "string") {
                                s(n);
                            }
                        });
                    })(arguments);
                    if (i) {
                        o = a.length;
                    } else if (t) {
                        r = n;
                        f(t);
                    }
                }
                return this;
            },
            remove: function() {
                if (a) {
                    p.each(arguments, function(e, t) {
                        var n;
                        while ((n = p.inArray(t, a, n)) > -1) {
                            a.splice(n, 1);
                            if (i) {
                                if (n <= o) {
                                    o--;
                                }
                                if (n <= s) {
                                    s--;
                                }
                            }
                        }
                    });
                }
                return this;
            },
            has: function(e) {
                return e ? p.inArray(e, a) > -1 : !!(a && a.length);
            },
            empty: function() {
                a = [];
                o = 0;
                return this;
            },
            disable: function() {
                a = l = t = undefined;
                return this;
            },
            disabled: function() {
                return !a;
            },
            lock: function() {
                l = undefined;
                if (!t) {
                    u.disable();
                }
                return this;
            },
            locked: function() {
                return !l;
            },
            fireWith: function(e, t) {
                if (a && (!n || l)) {
                    t = t || [];
                    t = [ e, t.slice ? t.slice() : t ];
                    if (i) {
                        l.push(t);
                    } else {
                        f(t);
                    }
                }
                return this;
            },
            fire: function() {
                u.fireWith(this, arguments);
                return this;
            },
            fired: function() {
                return !!n;
            }
        };
        return u;
    };
    p.extend({
        Deferred: function(e) {
            var t = [ [ "resolve", "done", p.Callbacks("once memory"), "resolved" ], [ "reject", "fail", p.Callbacks("once memory"), "rejected" ], [ "notify", "progress", p.Callbacks("memory") ] ], n = "pending", i = {
                state: function() {
                    return n;
                },
                always: function() {
                    r.done(arguments).fail(arguments);
                    return this;
                },
                then: function() {
                    var e = arguments;
                    return p.Deferred(function(n) {
                        p.each(t, function(t, o) {
                            var s = p.isFunction(e[t]) && e[t];
                            r[o[1]](function() {
                                var e = s && s.apply(this, arguments);
                                if (e && p.isFunction(e.promise)) {
                                    e.promise().done(n.resolve).fail(n.reject).progress(n.notify);
                                } else {
                                    n[o[0] + "With"](this === i ? n.promise() : this, s ? [ e ] : arguments);
                                }
                            });
                        });
                        e = null;
                    }).promise();
                },
                promise: function(e) {
                    return e != null ? p.extend(e, i) : i;
                }
            }, r = {};
            i.pipe = i.then;
            p.each(t, function(e, o) {
                var s = o[2], a = o[3];
                i[o[1]] = s.add;
                if (a) {
                    s.add(function() {
                        n = a;
                    }, t[e ^ 1][2].disable, t[2][2].lock);
                }
                r[o[0]] = function() {
                    r[o[0] + "With"](this === r ? i : this, arguments);
                    return this;
                };
                r[o[0] + "With"] = s.fireWith;
            });
            i.promise(r);
            if (e) {
                e.call(r, r);
            }
            return r;
        },
        when: function(e) {
            var t = 0, n = i.call(arguments), r = n.length, o = r !== 1 || e && p.isFunction(e.promise) ? r : 0, s = o === 1 ? e : p.Deferred(), a = function(e, t, n) {
                return function(r) {
                    t[e] = this;
                    n[e] = arguments.length > 1 ? i.call(arguments) : r;
                    if (n === l) {
                        s.notifyWith(t, n);
                    } else if (!--o) {
                        s.resolveWith(t, n);
                    }
                };
            }, l, f, u;
            if (r > 1) {
                l = new Array(r);
                f = new Array(r);
                u = new Array(r);
                for (;t < r; t++) {
                    if (n[t] && p.isFunction(n[t].promise)) {
                        n[t].promise().done(a(t, u, n)).fail(s.reject).progress(a(t, f, l));
                    } else {
                        --o;
                    }
                }
            }
            if (!o) {
                s.resolveWith(u, n);
            }
            return s.promise();
        }
    });
    var I;
    p.fn.ready = function(e) {
        p.ready.promise().done(e);
        return this;
    };
    p.extend({
        isReady: false,
        readyWait: 1,
        holdReady: function(e) {
            if (e) {
                p.readyWait++;
            } else {
                p.ready(true);
            }
        },
        ready: function(e) {
            if (e === true ? --p.readyWait : p.isReady) {
                return;
            }
            p.isReady = true;
            if (e !== true && --p.readyWait > 0) {
                return;
            }
            I.resolveWith(c, [ p ]);
            if (p.fn.triggerHandler) {
                p(c).triggerHandler("ready");
                p(c).off("ready");
            }
        }
    });
    function O() {
        c.removeEventListener("DOMContentLoaded", O, false);
        e.removeEventListener("load", O, false);
        p.ready();
    }
    p.ready.promise = function(t) {
        if (!I) {
            I = p.Deferred();
            if (c.readyState === "complete") {
                setTimeout(p.ready);
            } else {
                c.addEventListener("DOMContentLoaded", O, false);
                e.addEventListener("load", O, false);
            }
        }
        return I.promise(t);
    };
    p.ready.promise();
    var P = p.access = function(e, t, n, i, r, o, s) {
        var a = 0, l = e.length, f = n == null;
        if (p.type(n) === "object") {
            r = true;
            for (a in n) {
                p.access(e, t, a, n[a], true, o, s);
            }
        } else if (i !== undefined) {
            r = true;
            if (!p.isFunction(i)) {
                s = true;
            }
            if (f) {
                if (s) {
                    t.call(e, i);
                    t = null;
                } else {
                    f = t;
                    t = function(e, t, n) {
                        return f.call(p(e), n);
                    };
                }
            }
            if (t) {
                for (;a < l; a++) {
                    t(e[a], n, s ? i : i.call(e[a], a, t(e[a], n)));
                }
            }
        }
        return r ? e : f ? t.call(e) : l ? t(e[0], n) : o;
    };
    p.acceptData = function(e) {
        return e.nodeType === 1 || e.nodeType === 9 || !+e.nodeType;
    };
    function R() {
        Object.defineProperty(this.cache = {}, 0, {
            get: function() {
                return {};
            }
        });
        this.expando = p.expando + R.uid++;
    }
    R.uid = 1;
    R.accepts = p.acceptData;
    R.prototype = {
        key: function(e) {
            if (!R.accepts(e)) {
                return 0;
            }
            var t = {}, n = e[this.expando];
            if (!n) {
                n = R.uid++;
                try {
                    t[this.expando] = {
                        value: n
                    };
                    Object.defineProperties(e, t);
                } catch (i) {
                    t[this.expando] = n;
                    p.extend(e, t);
                }
            }
            if (!this.cache[n]) {
                this.cache[n] = {};
            }
            return n;
        },
        set: function(e, t, n) {
            var i, r = this.key(e), o = this.cache[r];
            if (typeof t === "string") {
                o[t] = n;
            } else {
                if (p.isEmptyObject(o)) {
                    p.extend(this.cache[r], t);
                } else {
                    for (i in t) {
                        o[i] = t[i];
                    }
                }
            }
            return o;
        },
        get: function(e, t) {
            var n = this.cache[this.key(e)];
            return t === undefined ? n : n[t];
        },
        access: function(e, t, n) {
            var i;
            if (t === undefined || t && typeof t === "string" && n === undefined) {
                i = this.get(e, t);
                return i !== undefined ? i : this.get(e, p.camelCase(t));
            }
            this.set(e, t, n);
            return n !== undefined ? n : t;
        },
        remove: function(e, t) {
            var n, i, r, o = this.key(e), s = this.cache[o];
            if (t === undefined) {
                this.cache[o] = {};
            } else {
                if (p.isArray(t)) {
                    i = t.concat(t.map(p.camelCase));
                } else {
                    r = p.camelCase(t);
                    if (t in s) {
                        i = [ t, r ];
                    } else {
                        i = r;
                        i = i in s ? [ i ] : i.match(A) || [];
                    }
                }
                n = i.length;
                while (n--) {
                    delete s[i[n]];
                }
            }
        },
        hasData: function(e) {
            return !p.isEmptyObject(this.cache[e[this.expando]] || {});
        },
        discard: function(e) {
            if (e[this.expando]) {
                delete this.cache[e[this.expando]];
            }
        }
    };
    var H = new R();
    var F = new R();
    var q = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, M = /([A-Z])/g;
    function _(e, t, n) {
        var i;
        if (n === undefined && e.nodeType === 1) {
            i = "data-" + t.replace(M, "-$1").toLowerCase();
            n = e.getAttribute(i);
            if (typeof n === "string") {
                try {
                    n = n === "true" ? true : n === "false" ? false : n === "null" ? null : +n + "" === n ? +n : q.test(n) ? p.parseJSON(n) : n;
                } catch (r) {}
                F.set(e, t, n);
            } else {
                n = undefined;
            }
        }
        return n;
    }
    p.extend({
        hasData: function(e) {
            return F.hasData(e) || H.hasData(e);
        },
        data: function(e, t, n) {
            return F.access(e, t, n);
        },
        removeData: function(e, t) {
            F.remove(e, t);
        },
        _data: function(e, t, n) {
            return H.access(e, t, n);
        },
        _removeData: function(e, t) {
            H.remove(e, t);
        }
    });
    p.fn.extend({
        data: function(e, t) {
            var n, i, r, o = this[0], s = o && o.attributes;
            if (e === undefined) {
                if (this.length) {
                    r = F.get(o);
                    if (o.nodeType === 1 && !H.get(o, "hasDataAttrs")) {
                        n = s.length;
                        while (n--) {
                            if (s[n]) {
                                i = s[n].name;
                                if (i.indexOf("data-") === 0) {
                                    i = p.camelCase(i.slice(5));
                                    _(o, i, r[i]);
                                }
                            }
                        }
                        H.set(o, "hasDataAttrs", true);
                    }
                }
                return r;
            }
            if (typeof e === "object") {
                return this.each(function() {
                    F.set(this, e);
                });
            }
            return P(this, function(t) {
                var n, i = p.camelCase(e);
                if (o && t === undefined) {
                    n = F.get(o, e);
                    if (n !== undefined) {
                        return n;
                    }
                    n = F.get(o, i);
                    if (n !== undefined) {
                        return n;
                    }
                    n = _(o, i, undefined);
                    if (n !== undefined) {
                        return n;
                    }
                    return;
                }
                this.each(function() {
                    var n = F.get(this, i);
                    F.set(this, i, t);
                    if (e.indexOf("-") !== -1 && n !== undefined) {
                        F.set(this, e, t);
                    }
                });
            }, null, t, arguments.length > 1, null, true);
        },
        removeData: function(e) {
            return this.each(function() {
                F.remove(this, e);
            });
        }
    });
    p.extend({
        queue: function(e, t, n) {
            var i;
            if (e) {
                t = (t || "fx") + "queue";
                i = H.get(e, t);
                if (n) {
                    if (!i || p.isArray(n)) {
                        i = H.access(e, t, p.makeArray(n));
                    } else {
                        i.push(n);
                    }
                }
                return i || [];
            }
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = p.queue(e, t), i = n.length, r = n.shift(), o = p._queueHooks(e, t), s = function() {
                p.dequeue(e, t);
            };
            if (r === "inprogress") {
                r = n.shift();
                i--;
            }
            if (r) {
                if (t === "fx") {
                    n.unshift("inprogress");
                }
                delete o.stop;
                r.call(e, s, o);
            }
            if (!i && o) {
                o.empty.fire();
            }
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return H.get(e, n) || H.access(e, n, {
                empty: p.Callbacks("once memory").add(function() {
                    H.remove(e, [ t + "queue", n ]);
                })
            });
        }
    });
    p.fn.extend({
        queue: function(e, t) {
            var n = 2;
            if (typeof e !== "string") {
                t = e;
                e = "fx";
                n--;
            }
            if (arguments.length < n) {
                return p.queue(this[0], e);
            }
            return t === undefined ? this : this.each(function() {
                var n = p.queue(this, e, t);
                p._queueHooks(this, e);
                if (e === "fx" && n[0] !== "inprogress") {
                    p.dequeue(this, e);
                }
            });
        },
        dequeue: function(e) {
            return this.each(function() {
                p.dequeue(this, e);
            });
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", []);
        },
        promise: function(e, t) {
            var n, i = 1, r = p.Deferred(), o = this, s = this.length, a = function() {
                if (!--i) {
                    r.resolveWith(o, [ o ]);
                }
            };
            if (typeof e !== "string") {
                t = e;
                e = undefined;
            }
            e = e || "fx";
            while (s--) {
                n = H.get(o[s], e + "queueHooks");
                if (n && n.empty) {
                    i++;
                    n.empty.add(a);
                }
            }
            a();
            return r.promise(t);
        }
    });
    var B = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
    var W = [ "Top", "Right", "Bottom", "Left" ];
    var U = function(e, t) {
        e = t || e;
        return p.css(e, "display") === "none" || !p.contains(e.ownerDocument, e);
    };
    var z = /^(?:checkbox|radio)$/i;
    (function() {
        var e = c.createDocumentFragment(), t = e.appendChild(c.createElement("div")), n = c.createElement("input");
        n.setAttribute("type", "radio");
        n.setAttribute("checked", "checked");
        n.setAttribute("name", "t");
        t.appendChild(n);
        u.checkClone = t.cloneNode(true).cloneNode(true).lastChild.checked;
        t.innerHTML = "<textarea>x</textarea>";
        u.noCloneChecked = !!t.cloneNode(true).lastChild.defaultValue;
    })();
    var G = typeof undefined;
    u.focusinBubbles = "onfocusin" in e;
    var Q = /^key/, V = /^(?:mouse|pointer|contextmenu)|click/, X = /^(?:focusinfocus|focusoutblur)$/, Y = /^([^.]*)(?:\.(.+)|)$/;
    function J() {
        return true;
    }
    function K() {
        return false;
    }
    function Z() {
        try {
            return c.activeElement;
        } catch (e) {}
    }
    p.event = {
        global: {},
        add: function(e, t, n, i, r) {
            var o, s, a, l, f, u, c, d, h, g, v, m = H.get(e);
            if (!m) {
                return;
            }
            if (n.handler) {
                o = n;
                n = o.handler;
                r = o.selector;
            }
            if (!n.guid) {
                n.guid = p.guid++;
            }
            if (!(l = m.events)) {
                l = m.events = {};
            }
            if (!(s = m.handle)) {
                s = m.handle = function(t) {
                    return typeof p !== G && p.event.triggered !== t.type ? p.event.dispatch.apply(e, arguments) : undefined;
                };
            }
            t = (t || "").match(A) || [ "" ];
            f = t.length;
            while (f--) {
                a = Y.exec(t[f]) || [];
                h = v = a[1];
                g = (a[2] || "").split(".").sort();
                if (!h) {
                    continue;
                }
                c = p.event.special[h] || {};
                h = (r ? c.delegateType : c.bindType) || h;
                c = p.event.special[h] || {};
                u = p.extend({
                    type: h,
                    origType: v,
                    data: i,
                    handler: n,
                    guid: n.guid,
                    selector: r,
                    needsContext: r && p.expr.match.needsContext.test(r),
                    namespace: g.join(".")
                }, o);
                if (!(d = l[h])) {
                    d = l[h] = [];
                    d.delegateCount = 0;
                    if (!c.setup || c.setup.call(e, i, g, s) === false) {
                        if (e.addEventListener) {
                            e.addEventListener(h, s, false);
                        }
                    }
                }
                if (c.add) {
                    c.add.call(e, u);
                    if (!u.handler.guid) {
                        u.handler.guid = n.guid;
                    }
                }
                if (r) {
                    d.splice(d.delegateCount++, 0, u);
                } else {
                    d.push(u);
                }
                p.event.global[h] = true;
            }
        },
        remove: function(e, t, n, i, r) {
            var o, s, a, l, f, u, c, d, h, g, v, m = H.hasData(e) && H.get(e);
            if (!m || !(l = m.events)) {
                return;
            }
            t = (t || "").match(A) || [ "" ];
            f = t.length;
            while (f--) {
                a = Y.exec(t[f]) || [];
                h = v = a[1];
                g = (a[2] || "").split(".").sort();
                if (!h) {
                    for (h in l) {
                        p.event.remove(e, h + t[f], n, i, true);
                    }
                    continue;
                }
                c = p.event.special[h] || {};
                h = (i ? c.delegateType : c.bindType) || h;
                d = l[h] || [];
                a = a[2] && new RegExp("(^|\\.)" + g.join("\\.(?:.*\\.|)") + "(\\.|$)");
                s = o = d.length;
                while (o--) {
                    u = d[o];
                    if ((r || v === u.origType) && (!n || n.guid === u.guid) && (!a || a.test(u.namespace)) && (!i || i === u.selector || i === "**" && u.selector)) {
                        d.splice(o, 1);
                        if (u.selector) {
                            d.delegateCount--;
                        }
                        if (c.remove) {
                            c.remove.call(e, u);
                        }
                    }
                }
                if (s && !d.length) {
                    if (!c.teardown || c.teardown.call(e, g, m.handle) === false) {
                        p.removeEvent(e, h, m.handle);
                    }
                    delete l[h];
                }
            }
            if (p.isEmptyObject(l)) {
                delete m.handle;
                H.remove(e, "events");
            }
        },
        trigger: function(t, n, i, r) {
            var o, s, a, l, u, d, h, g = [ i || c ], v = f.call(t, "type") ? t.type : t, m = f.call(t, "namespace") ? t.namespace.split(".") : [];
            s = a = i = i || c;
            if (i.nodeType === 3 || i.nodeType === 8) {
                return;
            }
            if (X.test(v + p.event.triggered)) {
                return;
            }
            if (v.indexOf(".") >= 0) {
                m = v.split(".");
                v = m.shift();
                m.sort();
            }
            u = v.indexOf(":") < 0 && "on" + v;
            t = t[p.expando] ? t : new p.Event(v, typeof t === "object" && t);
            t.isTrigger = r ? 2 : 3;
            t.namespace = m.join(".");
            t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
            t.result = undefined;
            if (!t.target) {
                t.target = i;
            }
            n = n == null ? [ t ] : p.makeArray(n, [ t ]);
            h = p.event.special[v] || {};
            if (!r && h.trigger && h.trigger.apply(i, n) === false) {
                return;
            }
            if (!r && !h.noBubble && !p.isWindow(i)) {
                l = h.delegateType || v;
                if (!X.test(l + v)) {
                    s = s.parentNode;
                }
                for (;s; s = s.parentNode) {
                    g.push(s);
                    a = s;
                }
                if (a === (i.ownerDocument || c)) {
                    g.push(a.defaultView || a.parentWindow || e);
                }
            }
            o = 0;
            while ((s = g[o++]) && !t.isPropagationStopped()) {
                t.type = o > 1 ? l : h.bindType || v;
                d = (H.get(s, "events") || {})[t.type] && H.get(s, "handle");
                if (d) {
                    d.apply(s, n);
                }
                d = u && s[u];
                if (d && d.apply && p.acceptData(s)) {
                    t.result = d.apply(s, n);
                    if (t.result === false) {
                        t.preventDefault();
                    }
                }
            }
            t.type = v;
            if (!r && !t.isDefaultPrevented()) {
                if ((!h._default || h._default.apply(g.pop(), n) === false) && p.acceptData(i)) {
                    if (u && p.isFunction(i[v]) && !p.isWindow(i)) {
                        a = i[u];
                        if (a) {
                            i[u] = null;
                        }
                        p.event.triggered = v;
                        i[v]();
                        p.event.triggered = undefined;
                        if (a) {
                            i[u] = a;
                        }
                    }
                }
            }
            return t.result;
        },
        dispatch: function(e) {
            e = p.event.fix(e);
            var t, n, r, o, s, a = [], l = i.call(arguments), f = (H.get(this, "events") || {})[e.type] || [], u = p.event.special[e.type] || {};
            l[0] = e;
            e.delegateTarget = this;
            if (u.preDispatch && u.preDispatch.call(this, e) === false) {
                return;
            }
            a = p.event.handlers.call(this, e, f);
            t = 0;
            while ((o = a[t++]) && !e.isPropagationStopped()) {
                e.currentTarget = o.elem;
                n = 0;
                while ((s = o.handlers[n++]) && !e.isImmediatePropagationStopped()) {
                    if (!e.namespace_re || e.namespace_re.test(s.namespace)) {
                        e.handleObj = s;
                        e.data = s.data;
                        r = ((p.event.special[s.origType] || {}).handle || s.handler).apply(o.elem, l);
                        if (r !== undefined) {
                            if ((e.result = r) === false) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        }
                    }
                }
            }
            if (u.postDispatch) {
                u.postDispatch.call(this, e);
            }
            return e.result;
        },
        handlers: function(e, t) {
            var n, i, r, o, s = [], a = t.delegateCount, l = e.target;
            if (a && l.nodeType && (!e.button || e.type !== "click")) {
                for (;l !== this; l = l.parentNode || this) {
                    if (l.disabled !== true || e.type !== "click") {
                        i = [];
                        for (n = 0; n < a; n++) {
                            o = t[n];
                            r = o.selector + " ";
                            if (i[r] === undefined) {
                                i[r] = o.needsContext ? p(r, this).index(l) >= 0 : p.find(r, this, null, [ l ]).length;
                            }
                            if (i[r]) {
                                i.push(o);
                            }
                        }
                        if (i.length) {
                            s.push({
                                elem: l,
                                handlers: i
                            });
                        }
                    }
                }
            }
            if (a < t.length) {
                s.push({
                    elem: this,
                    handlers: t.slice(a)
                });
            }
            return s;
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                if (e.which == null) {
                    e.which = t.charCode != null ? t.charCode : t.keyCode;
                }
                return e;
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(e, t) {
                var n, i, r, o = t.button;
                if (e.pageX == null && t.clientX != null) {
                    n = e.target.ownerDocument || c;
                    i = n.documentElement;
                    r = n.body;
                    e.pageX = t.clientX + (i && i.scrollLeft || r && r.scrollLeft || 0) - (i && i.clientLeft || r && r.clientLeft || 0);
                    e.pageY = t.clientY + (i && i.scrollTop || r && r.scrollTop || 0) - (i && i.clientTop || r && r.clientTop || 0);
                }
                if (!e.which && o !== undefined) {
                    e.which = o & 1 ? 1 : o & 2 ? 3 : o & 4 ? 2 : 0;
                }
                return e;
            }
        },
        fix: function(e) {
            if (e[p.expando]) {
                return e;
            }
            var t, n, i, r = e.type, o = e, s = this.fixHooks[r];
            if (!s) {
                this.fixHooks[r] = s = V.test(r) ? this.mouseHooks : Q.test(r) ? this.keyHooks : {};
            }
            i = s.props ? this.props.concat(s.props) : this.props;
            e = new p.Event(o);
            t = i.length;
            while (t--) {
                n = i[t];
                e[n] = o[n];
            }
            if (!e.target) {
                e.target = c;
            }
            if (e.target.nodeType === 3) {
                e.target = e.target.parentNode;
            }
            return s.filter ? s.filter(e, o) : e;
        },
        special: {
            load: {
                noBubble: true
            },
            focus: {
                trigger: function() {
                    if (this !== Z() && this.focus) {
                        this.focus();
                        return false;
                    }
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === Z() && this.blur) {
                        this.blur();
                        return false;
                    }
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    if (this.type === "checkbox" && this.click && p.nodeName(this, "input")) {
                        this.click();
                        return false;
                    }
                },
                _default: function(e) {
                    return p.nodeName(e.target, "a");
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    if (e.result !== undefined && e.originalEvent) {
                        e.originalEvent.returnValue = e.result;
                    }
                }
            }
        },
        simulate: function(e, t, n, i) {
            var r = p.extend(new p.Event(), n, {
                type: e,
                isSimulated: true,
                originalEvent: {}
            });
            if (i) {
                p.event.trigger(r, null, t);
            } else {
                p.event.dispatch.call(t, r);
            }
            if (r.isDefaultPrevented()) {
                n.preventDefault();
            }
        }
    };
    p.removeEvent = function(e, t, n) {
        if (e.removeEventListener) {
            e.removeEventListener(t, n, false);
        }
    };
    p.Event = function(e, t) {
        if (!(this instanceof p.Event)) {
            return new p.Event(e, t);
        }
        if (e && e.type) {
            this.originalEvent = e;
            this.type = e.type;
            this.isDefaultPrevented = e.defaultPrevented || e.defaultPrevented === undefined && e.returnValue === false ? J : K;
        } else {
            this.type = e;
        }
        if (t) {
            p.extend(this, t);
        }
        this.timeStamp = e && e.timeStamp || p.now();
        this[p.expando] = true;
    };
    p.Event.prototype = {
        isDefaultPrevented: K,
        isPropagationStopped: K,
        isImmediatePropagationStopped: K,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = J;
            if (e && e.preventDefault) {
                e.preventDefault();
            }
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = J;
            if (e && e.stopPropagation) {
                e.stopPropagation();
            }
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = J;
            if (e && e.stopImmediatePropagation) {
                e.stopImmediatePropagation();
            }
            this.stopPropagation();
        }
    };
    p.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, t) {
        p.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n, i = this, r = e.relatedTarget, o = e.handleObj;
                if (!r || r !== i && !p.contains(i, r)) {
                    e.type = o.origType;
                    n = o.handler.apply(this, arguments);
                    e.type = t;
                }
                return n;
            }
        };
    });
    if (!u.focusinBubbles) {
        p.each({
            focus: "focusin",
            blur: "focusout"
        }, function(e, t) {
            var n = function(e) {
                p.event.simulate(t, e.target, p.event.fix(e), true);
            };
            p.event.special[t] = {
                setup: function() {
                    var i = this.ownerDocument || this, r = H.access(i, t);
                    if (!r) {
                        i.addEventListener(e, n, true);
                    }
                    H.access(i, t, (r || 0) + 1);
                },
                teardown: function() {
                    var i = this.ownerDocument || this, r = H.access(i, t) - 1;
                    if (!r) {
                        i.removeEventListener(e, n, true);
                        H.remove(i, t);
                    } else {
                        H.access(i, t, r);
                    }
                }
            };
        });
    }
    p.fn.extend({
        on: function(e, t, n, i, r) {
            var o, s;
            if (typeof e === "object") {
                if (typeof t !== "string") {
                    n = n || t;
                    t = undefined;
                }
                for (s in e) {
                    this.on(s, t, n, e[s], r);
                }
                return this;
            }
            if (n == null && i == null) {
                i = t;
                n = t = undefined;
            } else if (i == null) {
                if (typeof t === "string") {
                    i = n;
                    n = undefined;
                } else {
                    i = n;
                    n = t;
                    t = undefined;
                }
            }
            if (i === false) {
                i = K;
            } else if (!i) {
                return this;
            }
            if (r === 1) {
                o = i;
                i = function(e) {
                    p().off(e);
                    return o.apply(this, arguments);
                };
                i.guid = o.guid || (o.guid = p.guid++);
            }
            return this.each(function() {
                p.event.add(this, e, i, n, t);
            });
        },
        one: function(e, t, n, i) {
            return this.on(e, t, n, i, 1);
        },
        off: function(e, t, n) {
            var i, r;
            if (e && e.preventDefault && e.handleObj) {
                i = e.handleObj;
                p(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler);
                return this;
            }
            if (typeof e === "object") {
                for (r in e) {
                    this.off(r, t, e[r]);
                }
                return this;
            }
            if (t === false || typeof t === "function") {
                n = t;
                t = undefined;
            }
            if (n === false) {
                n = K;
            }
            return this.each(function() {
                p.event.remove(this, e, n, t);
            });
        },
        trigger: function(e, t) {
            return this.each(function() {
                p.event.trigger(e, t, this);
            });
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            if (n) {
                return p.event.trigger(e, t, n, true);
            }
        }
    });
    var ee = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, te = /<([\w:]+)/, ne = /<|&#?\w+;/, ie = /<(?:script|style|link)/i, re = /checked\s*(?:[^=]|=\s*.checked.)/i, oe = /^$|\/(?:java|ecma)script/i, se = /^true\/(.*)/, ae = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, le = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        thead: [ 1, "<table>", "</table>" ],
        col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        _default: [ 0, "", "" ]
    };
    le.optgroup = le.option;
    le.tbody = le.tfoot = le.colgroup = le.caption = le.thead;
    le.th = le.td;
    function fe(e, t) {
        return p.nodeName(e, "table") && p.nodeName(t.nodeType !== 11 ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e;
    }
    function ue(e) {
        e.type = (e.getAttribute("type") !== null) + "/" + e.type;
        return e;
    }
    function ce(e) {
        var t = se.exec(e.type);
        if (t) {
            e.type = t[1];
        } else {
            e.removeAttribute("type");
        }
        return e;
    }
    function de(e, t) {
        var n = 0, i = e.length;
        for (;n < i; n++) {
            H.set(e[n], "globalEval", !t || H.get(t[n], "globalEval"));
        }
    }
    function pe(e, t) {
        var n, i, r, o, s, a, l, f;
        if (t.nodeType !== 1) {
            return;
        }
        if (H.hasData(e)) {
            o = H.access(e);
            s = H.set(t, o);
            f = o.events;
            if (f) {
                delete s.handle;
                s.events = {};
                for (r in f) {
                    for (n = 0, i = f[r].length; n < i; n++) {
                        p.event.add(t, r, f[r][n]);
                    }
                }
            }
        }
        if (F.hasData(e)) {
            a = F.access(e);
            l = p.extend({}, a);
            F.set(t, l);
        }
    }
    function he(e, t) {
        var n = e.getElementsByTagName ? e.getElementsByTagName(t || "*") : e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
        return t === undefined || t && p.nodeName(e, t) ? p.merge([ e ], n) : n;
    }
    function ge(e, t) {
        var n = t.nodeName.toLowerCase();
        if (n === "input" && z.test(e.type)) {
            t.checked = e.checked;
        } else if (n === "input" || n === "textarea") {
            t.defaultValue = e.defaultValue;
        }
    }
    p.extend({
        clone: function(e, t, n) {
            var i, r, o, s, a = e.cloneNode(true), l = p.contains(e.ownerDocument, e);
            if (!u.noCloneChecked && (e.nodeType === 1 || e.nodeType === 11) && !p.isXMLDoc(e)) {
                s = he(a);
                o = he(e);
                for (i = 0, r = o.length; i < r; i++) {
                    ge(o[i], s[i]);
                }
            }
            if (t) {
                if (n) {
                    o = o || he(e);
                    s = s || he(a);
                    for (i = 0, r = o.length; i < r; i++) {
                        pe(o[i], s[i]);
                    }
                } else {
                    pe(e, a);
                }
            }
            s = he(a, "script");
            if (s.length > 0) {
                de(s, !l && he(e, "script"));
            }
            return a;
        },
        buildFragment: function(e, t, n, i) {
            var r, o, s, a, l, f, u = t.createDocumentFragment(), c = [], d = 0, h = e.length;
            for (;d < h; d++) {
                r = e[d];
                if (r || r === 0) {
                    if (p.type(r) === "object") {
                        p.merge(c, r.nodeType ? [ r ] : r);
                    } else if (!ne.test(r)) {
                        c.push(t.createTextNode(r));
                    } else {
                        o = o || u.appendChild(t.createElement("div"));
                        s = (te.exec(r) || [ "", "" ])[1].toLowerCase();
                        a = le[s] || le._default;
                        o.innerHTML = a[1] + r.replace(ee, "<$1></$2>") + a[2];
                        f = a[0];
                        while (f--) {
                            o = o.lastChild;
                        }
                        p.merge(c, o.childNodes);
                        o = u.firstChild;
                        o.textContent = "";
                    }
                }
            }
            u.textContent = "";
            d = 0;
            while (r = c[d++]) {
                if (i && p.inArray(r, i) !== -1) {
                    continue;
                }
                l = p.contains(r.ownerDocument, r);
                o = he(u.appendChild(r), "script");
                if (l) {
                    de(o);
                }
                if (n) {
                    f = 0;
                    while (r = o[f++]) {
                        if (oe.test(r.type || "")) {
                            n.push(r);
                        }
                    }
                }
            }
            return u;
        },
        cleanData: function(e) {
            var t, n, i, r, o = p.event.special, s = 0;
            for (;(n = e[s]) !== undefined; s++) {
                if (p.acceptData(n)) {
                    r = n[H.expando];
                    if (r && (t = H.cache[r])) {
                        if (t.events) {
                            for (i in t.events) {
                                if (o[i]) {
                                    p.event.remove(n, i);
                                } else {
                                    p.removeEvent(n, i, t.handle);
                                }
                            }
                        }
                        if (H.cache[r]) {
                            delete H.cache[r];
                        }
                    }
                }
                delete F.cache[n[F.expando]];
            }
        }
    });
    p.fn.extend({
        text: function(e) {
            return P(this, function(e) {
                return e === undefined ? p.text(this) : this.empty().each(function() {
                    if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                        this.textContent = e;
                    }
                });
            }, null, e, arguments.length);
        },
        append: function() {
            return this.domManip(arguments, function(e) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var t = fe(this, e);
                    t.appendChild(e);
                }
            });
        },
        prepend: function() {
            return this.domManip(arguments, function(e) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var t = fe(this, e);
                    t.insertBefore(e, t.firstChild);
                }
            });
        },
        before: function() {
            return this.domManip(arguments, function(e) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(e, this);
                }
            });
        },
        after: function() {
            return this.domManip(arguments, function(e) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(e, this.nextSibling);
                }
            });
        },
        remove: function(e, t) {
            var n, i = e ? p.filter(e, this) : this, r = 0;
            for (;(n = i[r]) != null; r++) {
                if (!t && n.nodeType === 1) {
                    p.cleanData(he(n));
                }
                if (n.parentNode) {
                    if (t && p.contains(n.ownerDocument, n)) {
                        de(he(n, "script"));
                    }
                    n.parentNode.removeChild(n);
                }
            }
            return this;
        },
        empty: function() {
            var e, t = 0;
            for (;(e = this[t]) != null; t++) {
                if (e.nodeType === 1) {
                    p.cleanData(he(e, false));
                    e.textContent = "";
                }
            }
            return this;
        },
        clone: function(e, t) {
            e = e == null ? false : e;
            t = t == null ? e : t;
            return this.map(function() {
                return p.clone(this, e, t);
            });
        },
        html: function(e) {
            return P(this, function(e) {
                var t = this[0] || {}, n = 0, i = this.length;
                if (e === undefined && t.nodeType === 1) {
                    return t.innerHTML;
                }
                if (typeof e === "string" && !ie.test(e) && !le[(te.exec(e) || [ "", "" ])[1].toLowerCase()]) {
                    e = e.replace(ee, "<$1></$2>");
                    try {
                        for (;n < i; n++) {
                            t = this[n] || {};
                            if (t.nodeType === 1) {
                                p.cleanData(he(t, false));
                                t.innerHTML = e;
                            }
                        }
                        t = 0;
                    } catch (r) {}
                }
                if (t) {
                    this.empty().append(e);
                }
            }, null, e, arguments.length);
        },
        replaceWith: function() {
            var e = arguments[0];
            this.domManip(arguments, function(t) {
                e = this.parentNode;
                p.cleanData(he(this));
                if (e) {
                    e.replaceChild(t, this);
                }
            });
            return e && (e.length || e.nodeType) ? this : this.remove();
        },
        detach: function(e) {
            return this.remove(e, true);
        },
        domManip: function(e, t) {
            e = r.apply([], e);
            var n, i, o, s, a, l, f = 0, c = this.length, d = this, h = c - 1, g = e[0], v = p.isFunction(g);
            if (v || c > 1 && typeof g === "string" && !u.checkClone && re.test(g)) {
                return this.each(function(n) {
                    var i = d.eq(n);
                    if (v) {
                        e[0] = g.call(this, n, i.html());
                    }
                    i.domManip(e, t);
                });
            }
            if (c) {
                n = p.buildFragment(e, this[0].ownerDocument, false, this);
                i = n.firstChild;
                if (n.childNodes.length === 1) {
                    n = i;
                }
                if (i) {
                    o = p.map(he(n, "script"), ue);
                    s = o.length;
                    for (;f < c; f++) {
                        a = n;
                        if (f !== h) {
                            a = p.clone(a, true, true);
                            if (s) {
                                p.merge(o, he(a, "script"));
                            }
                        }
                        t.call(this[f], a, f);
                    }
                    if (s) {
                        l = o[o.length - 1].ownerDocument;
                        p.map(o, ce);
                        for (f = 0; f < s; f++) {
                            a = o[f];
                            if (oe.test(a.type || "") && !H.access(a, "globalEval") && p.contains(l, a)) {
                                if (a.src) {
                                    if (p._evalUrl) {
                                        p._evalUrl(a.src);
                                    }
                                } else {
                                    p.globalEval(a.textContent.replace(ae, ""));
                                }
                            }
                        }
                    }
                }
            }
            return this;
        }
    });
    p.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        p.fn[e] = function(e) {
            var n, i = [], r = p(e), s = r.length - 1, a = 0;
            for (;a <= s; a++) {
                n = a === s ? this : this.clone(true);
                p(r[a])[t](n);
                o.apply(i, n.get());
            }
            return this.pushStack(i);
        };
    });
    var ve, me = {};
    function ye(t, n) {
        var i, r = p(n.createElement(t)).appendTo(n.body), o = e.getDefaultComputedStyle && (i = e.getDefaultComputedStyle(r[0])) ? i.display : p.css(r[0], "display");
        r.detach();
        return o;
    }
    function be(e) {
        var t = c, n = me[e];
        if (!n) {
            n = ye(e, t);
            if (n === "none" || !n) {
                ve = (ve || p("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement);
                t = ve[0].contentDocument;
                t.write();
                t.close();
                n = ye(e, t);
                ve.detach();
            }
            me[e] = n;
        }
        return n;
    }
    var we = /^margin/;
    var xe = new RegExp("^(" + B + ")(?!px)[a-z%]+$", "i");
    var Ce = function(t) {
        if (t.ownerDocument.defaultView.opener) {
            return t.ownerDocument.defaultView.getComputedStyle(t, null);
        }
        return e.getComputedStyle(t, null);
    };
    function Te(e, t, n) {
        var i, r, o, s, a = e.style;
        n = n || Ce(e);
        if (n) {
            s = n.getPropertyValue(t) || n[t];
        }
        if (n) {
            if (s === "" && !p.contains(e.ownerDocument, e)) {
                s = p.style(e, t);
            }
            if (xe.test(s) && we.test(t)) {
                i = a.width;
                r = a.minWidth;
                o = a.maxWidth;
                a.minWidth = a.maxWidth = a.width = s;
                s = n.width;
                a.width = i;
                a.minWidth = r;
                a.maxWidth = o;
            }
        }
        return s !== undefined ? s + "" : s;
    }
    function De(e, t) {
        return {
            get: function() {
                if (e()) {
                    delete this.get;
                    return;
                }
                return (this.get = t).apply(this, arguments);
            }
        };
    }
    (function() {
        var t, n, i = c.documentElement, r = c.createElement("div"), o = c.createElement("div");
        if (!o.style) {
            return;
        }
        o.style.backgroundClip = "content-box";
        o.cloneNode(true).style.backgroundClip = "";
        u.clearCloneStyle = o.style.backgroundClip === "content-box";
        r.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" + "position:absolute";
        r.appendChild(o);
        function s() {
            o.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" + "box-sizing:border-box;display:block;margin-top:1%;top:1%;" + "border:1px;padding:1px;width:4px;position:absolute";
            o.innerHTML = "";
            i.appendChild(r);
            var s = e.getComputedStyle(o, null);
            t = s.top !== "1%";
            n = s.width === "4px";
            i.removeChild(r);
        }
        if (e.getComputedStyle) {
            p.extend(u, {
                pixelPosition: function() {
                    s();
                    return t;
                },
                boxSizingReliable: function() {
                    if (n == null) {
                        s();
                    }
                    return n;
                },
                reliableMarginRight: function() {
                    var t, n = o.appendChild(c.createElement("div"));
                    n.style.cssText = o.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" + "box-sizing:content-box;display:block;margin:0;border:0;padding:0";
                    n.style.marginRight = n.style.width = "0";
                    o.style.width = "1px";
                    i.appendChild(r);
                    t = !parseFloat(e.getComputedStyle(n, null).marginRight);
                    i.removeChild(r);
                    o.removeChild(n);
                    return t;
                }
            });
        }
    })();
    p.swap = function(e, t, n, i) {
        var r, o, s = {};
        for (o in t) {
            s[o] = e.style[o];
            e.style[o] = t[o];
        }
        r = n.apply(e, i || []);
        for (o in t) {
            e.style[o] = s[o];
        }
        return r;
    };
    var ke = /^(none|table(?!-c[ea]).+)/, Ee = new RegExp("^(" + B + ")(.*)$", "i"), Se = new RegExp("^([+-])=(" + B + ")", "i"), $e = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, Ne = {
        letterSpacing: "0",
        fontWeight: "400"
    }, Ae = [ "Webkit", "O", "Moz", "ms" ];
    function je(e, t) {
        if (t in e) {
            return t;
        }
        var n = t[0].toUpperCase() + t.slice(1), i = t, r = Ae.length;
        while (r--) {
            t = Ae[r] + n;
            if (t in e) {
                return t;
            }
        }
        return i;
    }
    function Le(e, t, n) {
        var i = Ee.exec(t);
        return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t;
    }
    function Ie(e, t, n, i, r) {
        var o = n === (i ? "border" : "content") ? 4 : t === "width" ? 1 : 0, s = 0;
        for (;o < 4; o += 2) {
            if (n === "margin") {
                s += p.css(e, n + W[o], true, r);
            }
            if (i) {
                if (n === "content") {
                    s -= p.css(e, "padding" + W[o], true, r);
                }
                if (n !== "margin") {
                    s -= p.css(e, "border" + W[o] + "Width", true, r);
                }
            } else {
                s += p.css(e, "padding" + W[o], true, r);
                if (n !== "padding") {
                    s += p.css(e, "border" + W[o] + "Width", true, r);
                }
            }
        }
        return s;
    }
    function Oe(e, t, n) {
        var i = true, r = t === "width" ? e.offsetWidth : e.offsetHeight, o = Ce(e), s = p.css(e, "boxSizing", false, o) === "border-box";
        if (r <= 0 || r == null) {
            r = Te(e, t, o);
            if (r < 0 || r == null) {
                r = e.style[t];
            }
            if (xe.test(r)) {
                return r;
            }
            i = s && (u.boxSizingReliable() || r === e.style[t]);
            r = parseFloat(r) || 0;
        }
        return r + Ie(e, t, n || (s ? "border" : "content"), i, o) + "px";
    }
    function Pe(e, t) {
        var n, i, r, o = [], s = 0, a = e.length;
        for (;s < a; s++) {
            i = e[s];
            if (!i.style) {
                continue;
            }
            o[s] = H.get(i, "olddisplay");
            n = i.style.display;
            if (t) {
                if (!o[s] && n === "none") {
                    i.style.display = "";
                }
                if (i.style.display === "" && U(i)) {
                    o[s] = H.access(i, "olddisplay", be(i.nodeName));
                }
            } else {
                r = U(i);
                if (n !== "none" || !r) {
                    H.set(i, "olddisplay", r ? n : p.css(i, "display"));
                }
            }
        }
        for (s = 0; s < a; s++) {
            i = e[s];
            if (!i.style) {
                continue;
            }
            if (!t || i.style.display === "none" || i.style.display === "") {
                i.style.display = t ? o[s] || "" : "none";
            }
        }
        return e;
    }
    p.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = Te(e, "opacity");
                        return n === "" ? "1" : n;
                    }
                }
            }
        },
        cssNumber: {
            columnCount: true,
            fillOpacity: true,
            flexGrow: true,
            flexShrink: true,
            fontWeight: true,
            lineHeight: true,
            opacity: true,
            order: true,
            orphans: true,
            widows: true,
            zIndex: true,
            zoom: true
        },
        cssProps: {
            "float": "cssFloat"
        },
        style: function(e, t, n, i) {
            if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style) {
                return;
            }
            var r, o, s, a = p.camelCase(t), l = e.style;
            t = p.cssProps[a] || (p.cssProps[a] = je(l, a));
            s = p.cssHooks[t] || p.cssHooks[a];
            if (n !== undefined) {
                o = typeof n;
                if (o === "string" && (r = Se.exec(n))) {
                    n = (r[1] + 1) * r[2] + parseFloat(p.css(e, t));
                    o = "number";
                }
                if (n == null || n !== n) {
                    return;
                }
                if (o === "number" && !p.cssNumber[a]) {
                    n += "px";
                }
                if (!u.clearCloneStyle && n === "" && t.indexOf("background") === 0) {
                    l[t] = "inherit";
                }
                if (!s || !("set" in s) || (n = s.set(e, n, i)) !== undefined) {
                    l[t] = n;
                }
            } else {
                if (s && "get" in s && (r = s.get(e, false, i)) !== undefined) {
                    return r;
                }
                return l[t];
            }
        },
        css: function(e, t, n, i) {
            var r, o, s, a = p.camelCase(t);
            t = p.cssProps[a] || (p.cssProps[a] = je(e.style, a));
            s = p.cssHooks[t] || p.cssHooks[a];
            if (s && "get" in s) {
                r = s.get(e, true, n);
            }
            if (r === undefined) {
                r = Te(e, t, i);
            }
            if (r === "normal" && t in Ne) {
                r = Ne[t];
            }
            if (n === "" || n) {
                o = parseFloat(r);
                return n === true || p.isNumeric(o) ? o || 0 : r;
            }
            return r;
        }
    });
    p.each([ "height", "width" ], function(e, t) {
        p.cssHooks[t] = {
            get: function(e, n, i) {
                if (n) {
                    return ke.test(p.css(e, "display")) && e.offsetWidth === 0 ? p.swap(e, $e, function() {
                        return Oe(e, t, i);
                    }) : Oe(e, t, i);
                }
            },
            set: function(e, n, i) {
                var r = i && Ce(e);
                return Le(e, n, i ? Ie(e, t, i, p.css(e, "boxSizing", false, r) === "border-box", r) : 0);
            }
        };
    });
    p.cssHooks.marginRight = De(u.reliableMarginRight, function(e, t) {
        if (t) {
            return p.swap(e, {
                display: "inline-block"
            }, Te, [ e, "marginRight" ]);
        }
    });
    p.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        p.cssHooks[e + t] = {
            expand: function(n) {
                var i = 0, r = {}, o = typeof n === "string" ? n.split(" ") : [ n ];
                for (;i < 4; i++) {
                    r[e + W[i] + t] = o[i] || o[i - 2] || o[0];
                }
                return r;
            }
        };
        if (!we.test(e)) {
            p.cssHooks[e + t].set = Le;
        }
    });
    p.fn.extend({
        css: function(e, t) {
            return P(this, function(e, t, n) {
                var i, r, o = {}, s = 0;
                if (p.isArray(t)) {
                    i = Ce(e);
                    r = t.length;
                    for (;s < r; s++) {
                        o[t[s]] = p.css(e, t[s], false, i);
                    }
                    return o;
                }
                return n !== undefined ? p.style(e, t, n) : p.css(e, t);
            }, e, t, arguments.length > 1);
        },
        show: function() {
            return Pe(this, true);
        },
        hide: function() {
            return Pe(this);
        },
        toggle: function(e) {
            if (typeof e === "boolean") {
                return e ? this.show() : this.hide();
            }
            return this.each(function() {
                if (U(this)) {
                    p(this).show();
                } else {
                    p(this).hide();
                }
            });
        }
    });
    function Re(e, t, n, i, r) {
        return new Re.prototype.init(e, t, n, i, r);
    }
    p.Tween = Re;
    Re.prototype = {
        constructor: Re,
        init: function(e, t, n, i, r, o) {
            this.elem = e;
            this.prop = n;
            this.easing = r || "swing";
            this.options = t;
            this.start = this.now = this.cur();
            this.end = i;
            this.unit = o || (p.cssNumber[n] ? "" : "px");
        },
        cur: function() {
            var e = Re.propHooks[this.prop];
            return e && e.get ? e.get(this) : Re.propHooks._default.get(this);
        },
        run: function(e) {
            var t, n = Re.propHooks[this.prop];
            if (this.options.duration) {
                this.pos = t = p.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration);
            } else {
                this.pos = t = e;
            }
            this.now = (this.end - this.start) * t + this.start;
            if (this.options.step) {
                this.options.step.call(this.elem, this.now, this);
            }
            if (n && n.set) {
                n.set(this);
            } else {
                Re.propHooks._default.set(this);
            }
            return this;
        }
    };
    Re.prototype.init.prototype = Re.prototype;
    Re.propHooks = {
        _default: {
            get: function(e) {
                var t;
                if (e.elem[e.prop] != null && (!e.elem.style || e.elem.style[e.prop] == null)) {
                    return e.elem[e.prop];
                }
                t = p.css(e.elem, e.prop, "");
                return !t || t === "auto" ? 0 : t;
            },
            set: function(e) {
                if (p.fx.step[e.prop]) {
                    p.fx.step[e.prop](e);
                } else if (e.elem.style && (e.elem.style[p.cssProps[e.prop]] != null || p.cssHooks[e.prop])) {
                    p.style(e.elem, e.prop, e.now + e.unit);
                } else {
                    e.elem[e.prop] = e.now;
                }
            }
        }
    };
    Re.propHooks.scrollTop = Re.propHooks.scrollLeft = {
        set: function(e) {
            if (e.elem.nodeType && e.elem.parentNode) {
                e.elem[e.prop] = e.now;
            }
        }
    };
    p.easing = {
        linear: function(e) {
            return e;
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2;
        }
    };
    p.fx = Re.prototype.init;
    p.fx.step = {};
    var He, Fe, qe = /^(?:toggle|show|hide)$/, Me = new RegExp("^(?:([+-])=|)(" + B + ")([a-z%]*)$", "i"), _e = /queueHooks$/, Be = [ Qe ], We = {
        "*": [ function(e, t) {
            var n = this.createTween(e, t), i = n.cur(), r = Me.exec(t), o = r && r[3] || (p.cssNumber[e] ? "" : "px"), s = (p.cssNumber[e] || o !== "px" && +i) && Me.exec(p.css(n.elem, e)), a = 1, l = 20;
            if (s && s[3] !== o) {
                o = o || s[3];
                r = r || [];
                s = +i || 1;
                do {
                    a = a || ".5";
                    s = s / a;
                    p.style(n.elem, e, s + o);
                } while (a !== (a = n.cur() / i) && a !== 1 && --l);
            }
            if (r) {
                s = n.start = +s || +i || 0;
                n.unit = o;
                n.end = r[1] ? s + (r[1] + 1) * r[2] : +r[2];
            }
            return n;
        } ]
    };
    function Ue() {
        setTimeout(function() {
            He = undefined;
        });
        return He = p.now();
    }
    function ze(e, t) {
        var n, i = 0, r = {
            height: e
        };
        t = t ? 1 : 0;
        for (;i < 4; i += 2 - t) {
            n = W[i];
            r["margin" + n] = r["padding" + n] = e;
        }
        if (t) {
            r.opacity = r.width = e;
        }
        return r;
    }
    function Ge(e, t, n) {
        var i, r = (We[t] || []).concat(We["*"]), o = 0, s = r.length;
        for (;o < s; o++) {
            if (i = r[o].call(n, t, e)) {
                return i;
            }
        }
    }
    function Qe(e, t, n) {
        var i, r, o, s, a, l, f, u, c = this, d = {}, h = e.style, g = e.nodeType && U(e), v = H.get(e, "fxshow");
        if (!n.queue) {
            a = p._queueHooks(e, "fx");
            if (a.unqueued == null) {
                a.unqueued = 0;
                l = a.empty.fire;
                a.empty.fire = function() {
                    if (!a.unqueued) {
                        l();
                    }
                };
            }
            a.unqueued++;
            c.always(function() {
                c.always(function() {
                    a.unqueued--;
                    if (!p.queue(e, "fx").length) {
                        a.empty.fire();
                    }
                });
            });
        }
        if (e.nodeType === 1 && ("height" in t || "width" in t)) {
            n.overflow = [ h.overflow, h.overflowX, h.overflowY ];
            f = p.css(e, "display");
            u = f === "none" ? H.get(e, "olddisplay") || be(e.nodeName) : f;
            if (u === "inline" && p.css(e, "float") === "none") {
                h.display = "inline-block";
            }
        }
        if (n.overflow) {
            h.overflow = "hidden";
            c.always(function() {
                h.overflow = n.overflow[0];
                h.overflowX = n.overflow[1];
                h.overflowY = n.overflow[2];
            });
        }
        for (i in t) {
            r = t[i];
            if (qe.exec(r)) {
                delete t[i];
                o = o || r === "toggle";
                if (r === (g ? "hide" : "show")) {
                    if (r === "show" && v && v[i] !== undefined) {
                        g = true;
                    } else {
                        continue;
                    }
                }
                d[i] = v && v[i] || p.style(e, i);
            } else {
                f = undefined;
            }
        }
        if (!p.isEmptyObject(d)) {
            if (v) {
                if ("hidden" in v) {
                    g = v.hidden;
                }
            } else {
                v = H.access(e, "fxshow", {});
            }
            if (o) {
                v.hidden = !g;
            }
            if (g) {
                p(e).show();
            } else {
                c.done(function() {
                    p(e).hide();
                });
            }
            c.done(function() {
                var t;
                H.remove(e, "fxshow");
                for (t in d) {
                    p.style(e, t, d[t]);
                }
            });
            for (i in d) {
                s = Ge(g ? v[i] : 0, i, c);
                if (!(i in v)) {
                    v[i] = s.start;
                    if (g) {
                        s.end = s.start;
                        s.start = i === "width" || i === "height" ? 1 : 0;
                    }
                }
            }
        } else if ((f === "none" ? be(e.nodeName) : f) === "inline") {
            h.display = f;
        }
    }
    function Ve(e, t) {
        var n, i, r, o, s;
        for (n in e) {
            i = p.camelCase(n);
            r = t[i];
            o = e[n];
            if (p.isArray(o)) {
                r = o[1];
                o = e[n] = o[0];
            }
            if (n !== i) {
                e[i] = o;
                delete e[n];
            }
            s = p.cssHooks[i];
            if (s && "expand" in s) {
                o = s.expand(o);
                delete e[i];
                for (n in o) {
                    if (!(n in e)) {
                        e[n] = o[n];
                        t[n] = r;
                    }
                }
            } else {
                t[i] = r;
            }
        }
    }
    function Xe(e, t, n) {
        var i, r, o = 0, s = Be.length, a = p.Deferred().always(function() {
            delete l.elem;
        }), l = function() {
            if (r) {
                return false;
            }
            var t = He || Ue(), n = Math.max(0, f.startTime + f.duration - t), i = n / f.duration || 0, o = 1 - i, s = 0, l = f.tweens.length;
            for (;s < l; s++) {
                f.tweens[s].run(o);
            }
            a.notifyWith(e, [ f, o, n ]);
            if (o < 1 && l) {
                return n;
            } else {
                a.resolveWith(e, [ f ]);
                return false;
            }
        }, f = a.promise({
            elem: e,
            props: p.extend({}, t),
            opts: p.extend(true, {
                specialEasing: {}
            }, n),
            originalProperties: t,
            originalOptions: n,
            startTime: He || Ue(),
            duration: n.duration,
            tweens: [],
            createTween: function(t, n) {
                var i = p.Tween(e, f.opts, t, n, f.opts.specialEasing[t] || f.opts.easing);
                f.tweens.push(i);
                return i;
            },
            stop: function(t) {
                var n = 0, i = t ? f.tweens.length : 0;
                if (r) {
                    return this;
                }
                r = true;
                for (;n < i; n++) {
                    f.tweens[n].run(1);
                }
                if (t) {
                    a.resolveWith(e, [ f, t ]);
                } else {
                    a.rejectWith(e, [ f, t ]);
                }
                return this;
            }
        }), u = f.props;
        Ve(u, f.opts.specialEasing);
        for (;o < s; o++) {
            i = Be[o].call(f, e, u, f.opts);
            if (i) {
                return i;
            }
        }
        p.map(u, Ge, f);
        if (p.isFunction(f.opts.start)) {
            f.opts.start.call(e, f);
        }
        p.fx.timer(p.extend(l, {
            elem: e,
            anim: f,
            queue: f.opts.queue
        }));
        return f.progress(f.opts.progress).done(f.opts.done, f.opts.complete).fail(f.opts.fail).always(f.opts.always);
    }
    p.Animation = p.extend(Xe, {
        tweener: function(e, t) {
            if (p.isFunction(e)) {
                t = e;
                e = [ "*" ];
            } else {
                e = e.split(" ");
            }
            var n, i = 0, r = e.length;
            for (;i < r; i++) {
                n = e[i];
                We[n] = We[n] || [];
                We[n].unshift(t);
            }
        },
        prefilter: function(e, t) {
            if (t) {
                Be.unshift(e);
            } else {
                Be.push(e);
            }
        }
    });
    p.speed = function(e, t, n) {
        var i = e && typeof e === "object" ? p.extend({}, e) : {
            complete: n || !n && t || p.isFunction(e) && e,
            duration: e,
            easing: n && t || t && !p.isFunction(t) && t
        };
        i.duration = p.fx.off ? 0 : typeof i.duration === "number" ? i.duration : i.duration in p.fx.speeds ? p.fx.speeds[i.duration] : p.fx.speeds._default;
        if (i.queue == null || i.queue === true) {
            i.queue = "fx";
        }
        i.old = i.complete;
        i.complete = function() {
            if (p.isFunction(i.old)) {
                i.old.call(this);
            }
            if (i.queue) {
                p.dequeue(this, i.queue);
            }
        };
        return i;
    };
    p.fn.extend({
        fadeTo: function(e, t, n, i) {
            return this.filter(U).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, i);
        },
        animate: function(e, t, n, i) {
            var r = p.isEmptyObject(e), o = p.speed(t, n, i), s = function() {
                var t = Xe(this, p.extend({}, e), o);
                if (r || H.get(this, "finish")) {
                    t.stop(true);
                }
            };
            s.finish = s;
            return r || o.queue === false ? this.each(s) : this.queue(o.queue, s);
        },
        stop: function(e, t, n) {
            var i = function(e) {
                var t = e.stop;
                delete e.stop;
                t(n);
            };
            if (typeof e !== "string") {
                n = t;
                t = e;
                e = undefined;
            }
            if (t && e !== false) {
                this.queue(e || "fx", []);
            }
            return this.each(function() {
                var t = true, r = e != null && e + "queueHooks", o = p.timers, s = H.get(this);
                if (r) {
                    if (s[r] && s[r].stop) {
                        i(s[r]);
                    }
                } else {
                    for (r in s) {
                        if (s[r] && s[r].stop && _e.test(r)) {
                            i(s[r]);
                        }
                    }
                }
                for (r = o.length; r--; ) {
                    if (o[r].elem === this && (e == null || o[r].queue === e)) {
                        o[r].anim.stop(n);
                        t = false;
                        o.splice(r, 1);
                    }
                }
                if (t || !n) {
                    p.dequeue(this, e);
                }
            });
        },
        finish: function(e) {
            if (e !== false) {
                e = e || "fx";
            }
            return this.each(function() {
                var t, n = H.get(this), i = n[e + "queue"], r = n[e + "queueHooks"], o = p.timers, s = i ? i.length : 0;
                n.finish = true;
                p.queue(this, e, []);
                if (r && r.stop) {
                    r.stop.call(this, true);
                }
                for (t = o.length; t--; ) {
                    if (o[t].elem === this && o[t].queue === e) {
                        o[t].anim.stop(true);
                        o.splice(t, 1);
                    }
                }
                for (t = 0; t < s; t++) {
                    if (i[t] && i[t].finish) {
                        i[t].finish.call(this);
                    }
                }
                delete n.finish;
            });
        }
    });
    p.each([ "toggle", "show", "hide" ], function(e, t) {
        var n = p.fn[t];
        p.fn[t] = function(e, i, r) {
            return e == null || typeof e === "boolean" ? n.apply(this, arguments) : this.animate(ze(t, true), e, i, r);
        };
    });
    p.each({
        slideDown: ze("show"),
        slideUp: ze("hide"),
        slideToggle: ze("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, t) {
        p.fn[e] = function(e, n, i) {
            return this.animate(t, e, n, i);
        };
    });
    p.timers = [];
    p.fx.tick = function() {
        var e, t = 0, n = p.timers;
        He = p.now();
        for (;t < n.length; t++) {
            e = n[t];
            if (!e() && n[t] === e) {
                n.splice(t--, 1);
            }
        }
        if (!n.length) {
            p.fx.stop();
        }
        He = undefined;
    };
    p.fx.timer = function(e) {
        p.timers.push(e);
        if (e()) {
            p.fx.start();
        } else {
            p.timers.pop();
        }
    };
    p.fx.interval = 13;
    p.fx.start = function() {
        if (!Fe) {
            Fe = setInterval(p.fx.tick, p.fx.interval);
        }
    };
    p.fx.stop = function() {
        clearInterval(Fe);
        Fe = null;
    };
    p.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    };
    p.fn.delay = function(e, t) {
        e = p.fx ? p.fx.speeds[e] || e : e;
        t = t || "fx";
        return this.queue(t, function(t, n) {
            var i = setTimeout(t, e);
            n.stop = function() {
                clearTimeout(i);
            };
        });
    };
    (function() {
        var e = c.createElement("input"), t = c.createElement("select"), n = t.appendChild(c.createElement("option"));
        e.type = "checkbox";
        u.checkOn = e.value !== "";
        u.optSelected = n.selected;
        t.disabled = true;
        u.optDisabled = !n.disabled;
        e = c.createElement("input");
        e.value = "t";
        e.type = "radio";
        u.radioValue = e.value === "t";
    })();
    var Ye, Je, Ke = p.expr.attrHandle;
    p.fn.extend({
        attr: function(e, t) {
            return P(this, p.attr, e, t, arguments.length > 1);
        },
        removeAttr: function(e) {
            return this.each(function() {
                p.removeAttr(this, e);
            });
        }
    });
    p.extend({
        attr: function(e, t, n) {
            var i, r, o = e.nodeType;
            if (!e || o === 3 || o === 8 || o === 2) {
                return;
            }
            if (typeof e.getAttribute === G) {
                return p.prop(e, t, n);
            }
            if (o !== 1 || !p.isXMLDoc(e)) {
                t = t.toLowerCase();
                i = p.attrHooks[t] || (p.expr.match.bool.test(t) ? Je : Ye);
            }
            if (n !== undefined) {
                if (n === null) {
                    p.removeAttr(e, t);
                } else if (i && "set" in i && (r = i.set(e, n, t)) !== undefined) {
                    return r;
                } else {
                    e.setAttribute(t, n + "");
                    return n;
                }
            } else if (i && "get" in i && (r = i.get(e, t)) !== null) {
                return r;
            } else {
                r = p.find.attr(e, t);
                return r == null ? undefined : r;
            }
        },
        removeAttr: function(e, t) {
            var n, i, r = 0, o = t && t.match(A);
            if (o && e.nodeType === 1) {
                while (n = o[r++]) {
                    i = p.propFix[n] || n;
                    if (p.expr.match.bool.test(n)) {
                        e[i] = false;
                    }
                    e.removeAttribute(n);
                }
            }
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!u.radioValue && t === "radio" && p.nodeName(e, "input")) {
                        var n = e.value;
                        e.setAttribute("type", t);
                        if (n) {
                            e.value = n;
                        }
                        return t;
                    }
                }
            }
        }
    });
    Je = {
        set: function(e, t, n) {
            if (t === false) {
                p.removeAttr(e, n);
            } else {
                e.setAttribute(n, n);
            }
            return n;
        }
    };
    p.each(p.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var n = Ke[t] || p.find.attr;
        Ke[t] = function(e, t, i) {
            var r, o;
            if (!i) {
                o = Ke[t];
                Ke[t] = r;
                r = n(e, t, i) != null ? t.toLowerCase() : null;
                Ke[t] = o;
            }
            return r;
        };
    });
    var Ze = /^(?:input|select|textarea|button)$/i;
    p.fn.extend({
        prop: function(e, t) {
            return P(this, p.prop, e, t, arguments.length > 1);
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[p.propFix[e] || e];
            });
        }
    });
    p.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(e, t, n) {
            var i, r, o, s = e.nodeType;
            if (!e || s === 3 || s === 8 || s === 2) {
                return;
            }
            o = s !== 1 || !p.isXMLDoc(e);
            if (o) {
                t = p.propFix[t] || t;
                r = p.propHooks[t];
            }
            if (n !== undefined) {
                return r && "set" in r && (i = r.set(e, n, t)) !== undefined ? i : e[t] = n;
            } else {
                return r && "get" in r && (i = r.get(e, t)) !== null ? i : e[t];
            }
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    return e.hasAttribute("tabindex") || Ze.test(e.nodeName) || e.href ? e.tabIndex : -1;
                }
            }
        }
    });
    if (!u.optSelected) {
        p.propHooks.selected = {
            get: function(e) {
                var t = e.parentNode;
                if (t && t.parentNode) {
                    t.parentNode.selectedIndex;
                }
                return null;
            }
        };
    }
    p.each([ "tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable" ], function() {
        p.propFix[this.toLowerCase()] = this;
    });
    var et = /[\t\r\n\f]/g;
    p.fn.extend({
        addClass: function(e) {
            var t, n, i, r, o, s, a = typeof e === "string" && e, l = 0, f = this.length;
            if (p.isFunction(e)) {
                return this.each(function(t) {
                    p(this).addClass(e.call(this, t, this.className));
                });
            }
            if (a) {
                t = (e || "").match(A) || [];
                for (;l < f; l++) {
                    n = this[l];
                    i = n.nodeType === 1 && (n.className ? (" " + n.className + " ").replace(et, " ") : " ");
                    if (i) {
                        o = 0;
                        while (r = t[o++]) {
                            if (i.indexOf(" " + r + " ") < 0) {
                                i += r + " ";
                            }
                        }
                        s = p.trim(i);
                        if (n.className !== s) {
                            n.className = s;
                        }
                    }
                }
            }
            return this;
        },
        removeClass: function(e) {
            var t, n, i, r, o, s, a = arguments.length === 0 || typeof e === "string" && e, l = 0, f = this.length;
            if (p.isFunction(e)) {
                return this.each(function(t) {
                    p(this).removeClass(e.call(this, t, this.className));
                });
            }
            if (a) {
                t = (e || "").match(A) || [];
                for (;l < f; l++) {
                    n = this[l];
                    i = n.nodeType === 1 && (n.className ? (" " + n.className + " ").replace(et, " ") : "");
                    if (i) {
                        o = 0;
                        while (r = t[o++]) {
                            while (i.indexOf(" " + r + " ") >= 0) {
                                i = i.replace(" " + r + " ", " ");
                            }
                        }
                        s = e ? p.trim(i) : "";
                        if (n.className !== s) {
                            n.className = s;
                        }
                    }
                }
            }
            return this;
        },
        toggleClass: function(e, t) {
            var n = typeof e;
            if (typeof t === "boolean" && n === "string") {
                return t ? this.addClass(e) : this.removeClass(e);
            }
            if (p.isFunction(e)) {
                return this.each(function(n) {
                    p(this).toggleClass(e.call(this, n, this.className, t), t);
                });
            }
            return this.each(function() {
                if (n === "string") {
                    var t, i = 0, r = p(this), o = e.match(A) || [];
                    while (t = o[i++]) {
                        if (r.hasClass(t)) {
                            r.removeClass(t);
                        } else {
                            r.addClass(t);
                        }
                    }
                } else if (n === G || n === "boolean") {
                    if (this.className) {
                        H.set(this, "__className__", this.className);
                    }
                    this.className = this.className || e === false ? "" : H.get(this, "__className__") || "";
                }
            });
        },
        hasClass: function(e) {
            var t = " " + e + " ", n = 0, i = this.length;
            for (;n < i; n++) {
                if (this[n].nodeType === 1 && (" " + this[n].className + " ").replace(et, " ").indexOf(t) >= 0) {
                    return true;
                }
            }
            return false;
        }
    });
    var tt = /\r/g;
    p.fn.extend({
        val: function(e) {
            var t, n, i, r = this[0];
            if (!arguments.length) {
                if (r) {
                    t = p.valHooks[r.type] || p.valHooks[r.nodeName.toLowerCase()];
                    if (t && "get" in t && (n = t.get(r, "value")) !== undefined) {
                        return n;
                    }
                    n = r.value;
                    return typeof n === "string" ? n.replace(tt, "") : n == null ? "" : n;
                }
                return;
            }
            i = p.isFunction(e);
            return this.each(function(n) {
                var r;
                if (this.nodeType !== 1) {
                    return;
                }
                if (i) {
                    r = e.call(this, n, p(this).val());
                } else {
                    r = e;
                }
                if (r == null) {
                    r = "";
                } else if (typeof r === "number") {
                    r += "";
                } else if (p.isArray(r)) {
                    r = p.map(r, function(e) {
                        return e == null ? "" : e + "";
                    });
                }
                t = p.valHooks[this.type] || p.valHooks[this.nodeName.toLowerCase()];
                if (!t || !("set" in t) || t.set(this, r, "value") === undefined) {
                    this.value = r;
                }
            });
        }
    });
    p.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = p.find.attr(e, "value");
                    return t != null ? t : p.trim(p.text(e));
                }
            },
            select: {
                get: function(e) {
                    var t, n, i = e.options, r = e.selectedIndex, o = e.type === "select-one" || r < 0, s = o ? null : [], a = o ? r + 1 : i.length, l = r < 0 ? a : o ? r : 0;
                    for (;l < a; l++) {
                        n = i[l];
                        if ((n.selected || l === r) && (u.optDisabled ? !n.disabled : n.getAttribute("disabled") === null) && (!n.parentNode.disabled || !p.nodeName(n.parentNode, "optgroup"))) {
                            t = p(n).val();
                            if (o) {
                                return t;
                            }
                            s.push(t);
                        }
                    }
                    return s;
                },
                set: function(e, t) {
                    var n, i, r = e.options, o = p.makeArray(t), s = r.length;
                    while (s--) {
                        i = r[s];
                        if (i.selected = p.inArray(i.value, o) >= 0) {
                            n = true;
                        }
                    }
                    if (!n) {
                        e.selectedIndex = -1;
                    }
                    return o;
                }
            }
        }
    });
    p.each([ "radio", "checkbox" ], function() {
        p.valHooks[this] = {
            set: function(e, t) {
                if (p.isArray(t)) {
                    return e.checked = p.inArray(p(e).val(), t) >= 0;
                }
            }
        };
        if (!u.checkOn) {
            p.valHooks[this].get = function(e) {
                return e.getAttribute("value") === null ? "on" : e.value;
            };
        }
    });
    p.each(("blur focus focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup error contextmenu").split(" "), function(e, t) {
        p.fn[t] = function(e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t);
        };
    });
    p.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e);
        },
        bind: function(e, t, n) {
            return this.on(e, null, t, n);
        },
        unbind: function(e, t) {
            return this.off(e, null, t);
        },
        delegate: function(e, t, n, i) {
            return this.on(t, e, n, i);
        },
        undelegate: function(e, t, n) {
            return arguments.length === 1 ? this.off(e, "**") : this.off(t, e || "**", n);
        }
    });
    var nt = p.now();
    var it = /\?/;
    p.parseJSON = function(e) {
        return JSON.parse(e + "");
    };
    p.parseXML = function(e) {
        var t, n;
        if (!e || typeof e !== "string") {
            return null;
        }
        try {
            n = new DOMParser();
            t = n.parseFromString(e, "text/xml");
        } catch (i) {
            t = undefined;
        }
        if (!t || t.getElementsByTagName("parsererror").length) {
            p.error("Invalid XML: " + e);
        }
        return t;
    };
    var rt = /#.*$/, ot = /([?&])_=[^&]*/, st = /^(.*?):[ \t]*([^\r\n]*)$/gm, at = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, lt = /^(?:GET|HEAD)$/, ft = /^\/\//, ut = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, ct = {}, dt = {}, pt = "*/".concat("*"), ht = e.location.href, gt = ut.exec(ht.toLowerCase()) || [];
    function vt(e) {
        return function(t, n) {
            if (typeof t !== "string") {
                n = t;
                t = "*";
            }
            var i, r = 0, o = t.toLowerCase().match(A) || [];
            if (p.isFunction(n)) {
                while (i = o[r++]) {
                    if (i[0] === "+") {
                        i = i.slice(1) || "*";
                        (e[i] = e[i] || []).unshift(n);
                    } else {
                        (e[i] = e[i] || []).push(n);
                    }
                }
            }
        };
    }
    function mt(e, t, n, i) {
        var r = {}, o = e === dt;
        function s(a) {
            var l;
            r[a] = true;
            p.each(e[a] || [], function(e, a) {
                var f = a(t, n, i);
                if (typeof f === "string" && !o && !r[f]) {
                    t.dataTypes.unshift(f);
                    s(f);
                    return false;
                } else if (o) {
                    return !(l = f);
                }
            });
            return l;
        }
        return s(t.dataTypes[0]) || !r["*"] && s("*");
    }
    function yt(e, t) {
        var n, i, r = p.ajaxSettings.flatOptions || {};
        for (n in t) {
            if (t[n] !== undefined) {
                (r[n] ? e : i || (i = {}))[n] = t[n];
            }
        }
        if (i) {
            p.extend(true, e, i);
        }
        return e;
    }
    function bt(e, t, n) {
        var i, r, o, s, a = e.contents, l = e.dataTypes;
        while (l[0] === "*") {
            l.shift();
            if (i === undefined) {
                i = e.mimeType || t.getResponseHeader("Content-Type");
            }
        }
        if (i) {
            for (r in a) {
                if (a[r] && a[r].test(i)) {
                    l.unshift(r);
                    break;
                }
            }
        }
        if (l[0] in n) {
            o = l[0];
        } else {
            for (r in n) {
                if (!l[0] || e.converters[r + " " + l[0]]) {
                    o = r;
                    break;
                }
                if (!s) {
                    s = r;
                }
            }
            o = o || s;
        }
        if (o) {
            if (o !== l[0]) {
                l.unshift(o);
            }
            return n[o];
        }
    }
    function wt(e, t, n, i) {
        var r, o, s, a, l, f = {}, u = e.dataTypes.slice();
        if (u[1]) {
            for (s in e.converters) {
                f[s.toLowerCase()] = e.converters[s];
            }
        }
        o = u.shift();
        while (o) {
            if (e.responseFields[o]) {
                n[e.responseFields[o]] = t;
            }
            if (!l && i && e.dataFilter) {
                t = e.dataFilter(t, e.dataType);
            }
            l = o;
            o = u.shift();
            if (o) {
                if (o === "*") {
                    o = l;
                } else if (l !== "*" && l !== o) {
                    s = f[l + " " + o] || f["* " + o];
                    if (!s) {
                        for (r in f) {
                            a = r.split(" ");
                            if (a[1] === o) {
                                s = f[l + " " + a[0]] || f["* " + a[0]];
                                if (s) {
                                    if (s === true) {
                                        s = f[r];
                                    } else if (f[r] !== true) {
                                        o = a[0];
                                        u.unshift(a[1]);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    if (s !== true) {
                        if (s && e["throws"]) {
                            t = s(t);
                        } else {
                            try {
                                t = s(t);
                            } catch (c) {
                                return {
                                    state: "parsererror",
                                    error: s ? c : "No conversion from " + l + " to " + o
                                };
                            }
                        }
                    }
                }
            }
        }
        return {
            state: "success",
            data: t
        };
    }
    p.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: ht,
            type: "GET",
            isLocal: at.test(gt[1]),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": pt,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": true,
                "text json": p.parseJSON,
                "text xml": p.parseXML
            },
            flatOptions: {
                url: true,
                context: true
            }
        },
        ajaxSetup: function(e, t) {
            return t ? yt(yt(e, p.ajaxSettings), t) : yt(p.ajaxSettings, e);
        },
        ajaxPrefilter: vt(ct),
        ajaxTransport: vt(dt),
        ajax: function(e, t) {
            if (typeof e === "object") {
                t = e;
                e = undefined;
            }
            t = t || {};
            var n, i, r, o, s, a, l, f, u = p.ajaxSetup({}, t), c = u.context || u, d = u.context && (c.nodeType || c.jquery) ? p(c) : p.event, h = p.Deferred(), g = p.Callbacks("once memory"), v = u.statusCode || {}, m = {}, y = {}, b = 0, w = "canceled", x = {
                readyState: 0,
                getResponseHeader: function(e) {
                    var t;
                    if (b === 2) {
                        if (!o) {
                            o = {};
                            while (t = st.exec(r)) {
                                o[t[1].toLowerCase()] = t[2];
                            }
                        }
                        t = o[e.toLowerCase()];
                    }
                    return t == null ? null : t;
                },
                getAllResponseHeaders: function() {
                    return b === 2 ? r : null;
                },
                setRequestHeader: function(e, t) {
                    var n = e.toLowerCase();
                    if (!b) {
                        e = y[n] = y[n] || e;
                        m[e] = t;
                    }
                    return this;
                },
                overrideMimeType: function(e) {
                    if (!b) {
                        u.mimeType = e;
                    }
                    return this;
                },
                statusCode: function(e) {
                    var t;
                    if (e) {
                        if (b < 2) {
                            for (t in e) {
                                v[t] = [ v[t], e[t] ];
                            }
                        } else {
                            x.always(e[x.status]);
                        }
                    }
                    return this;
                },
                abort: function(e) {
                    var t = e || w;
                    if (n) {
                        n.abort(t);
                    }
                    T(0, t);
                    return this;
                }
            };
            h.promise(x).complete = g.add;
            x.success = x.done;
            x.error = x.fail;
            u.url = ((e || u.url || ht) + "").replace(rt, "").replace(ft, gt[1] + "//");
            u.type = t.method || t.type || u.method || u.type;
            u.dataTypes = p.trim(u.dataType || "*").toLowerCase().match(A) || [ "" ];
            if (u.crossDomain == null) {
                a = ut.exec(u.url.toLowerCase());
                u.crossDomain = !!(a && (a[1] !== gt[1] || a[2] !== gt[2] || (a[3] || (a[1] === "http:" ? "80" : "443")) !== (gt[3] || (gt[1] === "http:" ? "80" : "443"))));
            }
            if (u.data && u.processData && typeof u.data !== "string") {
                u.data = p.param(u.data, u.traditional);
            }
            mt(ct, u, t, x);
            if (b === 2) {
                return x;
            }
            l = p.event && u.global;
            if (l && p.active++ === 0) {
                p.event.trigger("ajaxStart");
            }
            u.type = u.type.toUpperCase();
            u.hasContent = !lt.test(u.type);
            i = u.url;
            if (!u.hasContent) {
                if (u.data) {
                    i = u.url += (it.test(i) ? "&" : "?") + u.data;
                    delete u.data;
                }
                if (u.cache === false) {
                    u.url = ot.test(i) ? i.replace(ot, "$1_=" + nt++) : i + (it.test(i) ? "&" : "?") + "_=" + nt++;
                }
            }
            if (u.ifModified) {
                if (p.lastModified[i]) {
                    x.setRequestHeader("If-Modified-Since", p.lastModified[i]);
                }
                if (p.etag[i]) {
                    x.setRequestHeader("If-None-Match", p.etag[i]);
                }
            }
            if (u.data && u.hasContent && u.contentType !== false || t.contentType) {
                x.setRequestHeader("Content-Type", u.contentType);
            }
            x.setRequestHeader("Accept", u.dataTypes[0] && u.accepts[u.dataTypes[0]] ? u.accepts[u.dataTypes[0]] + (u.dataTypes[0] !== "*" ? ", " + pt + "; q=0.01" : "") : u.accepts["*"]);
            for (f in u.headers) {
                x.setRequestHeader(f, u.headers[f]);
            }
            if (u.beforeSend && (u.beforeSend.call(c, x, u) === false || b === 2)) {
                return x.abort();
            }
            w = "abort";
            for (f in {
                success: 1,
                error: 1,
                complete: 1
            }) {
                x[f](u[f]);
            }
            n = mt(dt, u, t, x);
            if (!n) {
                T(-1, "No Transport");
            } else {
                x.readyState = 1;
                if (l) {
                    d.trigger("ajaxSend", [ x, u ]);
                }
                if (u.async && u.timeout > 0) {
                    s = setTimeout(function() {
                        x.abort("timeout");
                    }, u.timeout);
                }
                try {
                    b = 1;
                    n.send(m, T);
                } catch (C) {
                    if (b < 2) {
                        T(-1, C);
                    } else {
                        throw C;
                    }
                }
            }
            function T(e, t, o, a) {
                var f, m, y, w, C, T = t;
                if (b === 2) {
                    return;
                }
                b = 2;
                if (s) {
                    clearTimeout(s);
                }
                n = undefined;
                r = a || "";
                x.readyState = e > 0 ? 4 : 0;
                f = e >= 200 && e < 300 || e === 304;
                if (o) {
                    w = bt(u, x, o);
                }
                w = wt(u, w, x, f);
                if (f) {
                    if (u.ifModified) {
                        C = x.getResponseHeader("Last-Modified");
                        if (C) {
                            p.lastModified[i] = C;
                        }
                        C = x.getResponseHeader("etag");
                        if (C) {
                            p.etag[i] = C;
                        }
                    }
                    if (e === 204 || u.type === "HEAD") {
                        T = "nocontent";
                    } else if (e === 304) {
                        T = "notmodified";
                    } else {
                        T = w.state;
                        m = w.data;
                        y = w.error;
                        f = !y;
                    }
                } else {
                    y = T;
                    if (e || !T) {
                        T = "error";
                        if (e < 0) {
                            e = 0;
                        }
                    }
                }
                x.status = e;
                x.statusText = (t || T) + "";
                if (f) {
                    h.resolveWith(c, [ m, T, x ]);
                } else {
                    h.rejectWith(c, [ x, T, y ]);
                }
                x.statusCode(v);
                v = undefined;
                if (l) {
                    d.trigger(f ? "ajaxSuccess" : "ajaxError", [ x, u, f ? m : y ]);
                }
                g.fireWith(c, [ x, T ]);
                if (l) {
                    d.trigger("ajaxComplete", [ x, u ]);
                    if (!--p.active) {
                        p.event.trigger("ajaxStop");
                    }
                }
            }
            return x;
        },
        getJSON: function(e, t, n) {
            return p.get(e, t, n, "json");
        },
        getScript: function(e, t) {
            return p.get(e, undefined, t, "script");
        }
    });
    p.each([ "get", "post" ], function(e, t) {
        p[t] = function(e, n, i, r) {
            if (p.isFunction(n)) {
                r = r || i;
                i = n;
                n = undefined;
            }
            return p.ajax({
                url: e,
                type: t,
                dataType: r,
                data: n,
                success: i
            });
        };
    });
    p._evalUrl = function(e) {
        return p.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            async: false,
            global: false,
            "throws": true
        });
    };
    p.fn.extend({
        wrapAll: function(e) {
            var t;
            if (p.isFunction(e)) {
                return this.each(function(t) {
                    p(this).wrapAll(e.call(this, t));
                });
            }
            if (this[0]) {
                t = p(e, this[0].ownerDocument).eq(0).clone(true);
                if (this[0].parentNode) {
                    t.insertBefore(this[0]);
                }
                t.map(function() {
                    var e = this;
                    while (e.firstElementChild) {
                        e = e.firstElementChild;
                    }
                    return e;
                }).append(this);
            }
            return this;
        },
        wrapInner: function(e) {
            if (p.isFunction(e)) {
                return this.each(function(t) {
                    p(this).wrapInner(e.call(this, t));
                });
            }
            return this.each(function() {
                var t = p(this), n = t.contents();
                if (n.length) {
                    n.wrapAll(e);
                } else {
                    t.append(e);
                }
            });
        },
        wrap: function(e) {
            var t = p.isFunction(e);
            return this.each(function(n) {
                p(this).wrapAll(t ? e.call(this, n) : e);
            });
        },
        unwrap: function() {
            return this.parent().each(function() {
                if (!p.nodeName(this, "body")) {
                    p(this).replaceWith(this.childNodes);
                }
            }).end();
        }
    });
    p.expr.filters.hidden = function(e) {
        return e.offsetWidth <= 0 && e.offsetHeight <= 0;
    };
    p.expr.filters.visible = function(e) {
        return !p.expr.filters.hidden(e);
    };
    var xt = /%20/g, Ct = /\[\]$/, Tt = /\r?\n/g, Dt = /^(?:submit|button|image|reset|file)$/i, kt = /^(?:input|select|textarea|keygen)/i;
    function Et(e, t, n, i) {
        var r;
        if (p.isArray(t)) {
            p.each(t, function(t, r) {
                if (n || Ct.test(e)) {
                    i(e, r);
                } else {
                    Et(e + "[" + (typeof r === "object" ? t : "") + "]", r, n, i);
                }
            });
        } else if (!n && p.type(t) === "object") {
            for (r in t) {
                Et(e + "[" + r + "]", t[r], n, i);
            }
        } else {
            i(e, t);
        }
    }
    p.param = function(e, t) {
        var n, i = [], r = function(e, t) {
            t = p.isFunction(t) ? t() : t == null ? "" : t;
            i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t);
        };
        if (t === undefined) {
            t = p.ajaxSettings && p.ajaxSettings.traditional;
        }
        if (p.isArray(e) || e.jquery && !p.isPlainObject(e)) {
            p.each(e, function() {
                r(this.name, this.value);
            });
        } else {
            for (n in e) {
                Et(n, e[n], t, r);
            }
        }
        return i.join("&").replace(xt, "+");
    };
    p.fn.extend({
        serialize: function() {
            return p.param(this.serializeArray());
        },
        serializeArray: function() {
            return this.map(function() {
                var e = p.prop(this, "elements");
                return e ? p.makeArray(e) : this;
            }).filter(function() {
                var e = this.type;
                return this.name && !p(this).is(":disabled") && kt.test(this.nodeName) && !Dt.test(e) && (this.checked || !z.test(e));
            }).map(function(e, t) {
                var n = p(this).val();
                return n == null ? null : p.isArray(n) ? p.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(Tt, "\r\n")
                    };
                }) : {
                    name: t.name,
                    value: n.replace(Tt, "\r\n")
                };
            }).get();
        }
    });
    p.ajaxSettings.xhr = function() {
        try {
            return new XMLHttpRequest();
        } catch (e) {}
    };
    var St = 0, $t = {}, Nt = {
        0: 200,
        1223: 204
    }, At = p.ajaxSettings.xhr();
    if (e.attachEvent) {
        e.attachEvent("onunload", function() {
            for (var e in $t) {
                $t[e]();
            }
        });
    }
    u.cors = !!At && "withCredentials" in At;
    u.ajax = At = !!At;
    p.ajaxTransport(function(e) {
        var t;
        if (u.cors || At && !e.crossDomain) {
            return {
                send: function(n, i) {
                    var r, o = e.xhr(), s = ++St;
                    o.open(e.type, e.url, e.async, e.username, e.password);
                    if (e.xhrFields) {
                        for (r in e.xhrFields) {
                            o[r] = e.xhrFields[r];
                        }
                    }
                    if (e.mimeType && o.overrideMimeType) {
                        o.overrideMimeType(e.mimeType);
                    }
                    if (!e.crossDomain && !n["X-Requested-With"]) {
                        n["X-Requested-With"] = "XMLHttpRequest";
                    }
                    for (r in n) {
                        o.setRequestHeader(r, n[r]);
                    }
                    t = function(e) {
                        return function() {
                            if (t) {
                                delete $t[s];
                                t = o.onload = o.onerror = null;
                                if (e === "abort") {
                                    o.abort();
                                } else if (e === "error") {
                                    i(o.status, o.statusText);
                                } else {
                                    i(Nt[o.status] || o.status, o.statusText, typeof o.responseText === "string" ? {
                                        text: o.responseText
                                    } : undefined, o.getAllResponseHeaders());
                                }
                            }
                        };
                    };
                    o.onload = t();
                    o.onerror = t("error");
                    t = $t[s] = t("abort");
                    try {
                        o.send(e.hasContent && e.data || null);
                    } catch (a) {
                        if (t) {
                            throw a;
                        }
                    }
                },
                abort: function() {
                    if (t) {
                        t();
                    }
                }
            };
        }
    });
    p.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(e) {
                p.globalEval(e);
                return e;
            }
        }
    });
    p.ajaxPrefilter("script", function(e) {
        if (e.cache === undefined) {
            e.cache = false;
        }
        if (e.crossDomain) {
            e.type = "GET";
        }
    });
    p.ajaxTransport("script", function(e) {
        if (e.crossDomain) {
            var t, n;
            return {
                send: function(i, r) {
                    t = p("<script>").prop({
                        async: true,
                        charset: e.scriptCharset,
                        src: e.url
                    }).on("load error", n = function(e) {
                        t.remove();
                        n = null;
                        if (e) {
                            r(e.type === "error" ? 404 : 200, e.type);
                        }
                    });
                    c.head.appendChild(t[0]);
                },
                abort: function() {
                    if (n) {
                        n();
                    }
                }
            };
        }
    });
    var jt = [], Lt = /(=)\?(?=&|$)|\?\?/;
    p.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = jt.pop() || p.expando + "_" + nt++;
            this[e] = true;
            return e;
        }
    });
    p.ajaxPrefilter("json jsonp", function(t, n, i) {
        var r, o, s, a = t.jsonp !== false && (Lt.test(t.url) ? "url" : typeof t.data === "string" && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && Lt.test(t.data) && "data");
        if (a || t.dataTypes[0] === "jsonp") {
            r = t.jsonpCallback = p.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback;
            if (a) {
                t[a] = t[a].replace(Lt, "$1" + r);
            } else if (t.jsonp !== false) {
                t.url += (it.test(t.url) ? "&" : "?") + t.jsonp + "=" + r;
            }
            t.converters["script json"] = function() {
                if (!s) {
                    p.error(r + " was not called");
                }
                return s[0];
            };
            t.dataTypes[0] = "json";
            o = e[r];
            e[r] = function() {
                s = arguments;
            };
            i.always(function() {
                e[r] = o;
                if (t[r]) {
                    t.jsonpCallback = n.jsonpCallback;
                    jt.push(r);
                }
                if (s && p.isFunction(o)) {
                    o(s[0]);
                }
                s = o = undefined;
            });
            return "script";
        }
    });
    p.parseHTML = function(e, t, n) {
        if (!e || typeof e !== "string") {
            return null;
        }
        if (typeof t === "boolean") {
            n = t;
            t = false;
        }
        t = t || c;
        var i = x.exec(e), r = !n && [];
        if (i) {
            return [ t.createElement(i[1]) ];
        }
        i = p.buildFragment([ e ], t, r);
        if (r && r.length) {
            p(r).remove();
        }
        return p.merge([], i.childNodes);
    };
    var It = p.fn.load;
    p.fn.load = function(e, t, n) {
        if (typeof e !== "string" && It) {
            return It.apply(this, arguments);
        }
        var i, r, o, s = this, a = e.indexOf(" ");
        if (a >= 0) {
            i = p.trim(e.slice(a));
            e = e.slice(0, a);
        }
        if (p.isFunction(t)) {
            n = t;
            t = undefined;
        } else if (t && typeof t === "object") {
            r = "POST";
        }
        if (s.length > 0) {
            p.ajax({
                url: e,
                type: r,
                dataType: "html",
                data: t
            }).done(function(e) {
                o = arguments;
                s.html(i ? p("<div>").append(p.parseHTML(e)).find(i) : e);
            }).complete(n && function(e, t) {
                s.each(n, o || [ e.responseText, t, e ]);
            });
        }
        return this;
    };
    p.each([ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function(e, t) {
        p.fn[t] = function(e) {
            return this.on(t, e);
        };
    });
    p.expr.filters.animated = function(e) {
        return p.grep(p.timers, function(t) {
            return e === t.elem;
        }).length;
    };
    var Ot = e.document.documentElement;
    function Pt(e) {
        return p.isWindow(e) ? e : e.nodeType === 9 && e.defaultView;
    }
    p.offset = {
        setOffset: function(e, t, n) {
            var i, r, o, s, a, l, f, u = p.css(e, "position"), c = p(e), d = {};
            if (u === "static") {
                e.style.position = "relative";
            }
            a = c.offset();
            o = p.css(e, "top");
            l = p.css(e, "left");
            f = (u === "absolute" || u === "fixed") && (o + l).indexOf("auto") > -1;
            if (f) {
                i = c.position();
                s = i.top;
                r = i.left;
            } else {
                s = parseFloat(o) || 0;
                r = parseFloat(l) || 0;
            }
            if (p.isFunction(t)) {
                t = t.call(e, n, a);
            }
            if (t.top != null) {
                d.top = t.top - a.top + s;
            }
            if (t.left != null) {
                d.left = t.left - a.left + r;
            }
            if ("using" in t) {
                t.using.call(e, d);
            } else {
                c.css(d);
            }
        }
    };
    p.fn.extend({
        offset: function(e) {
            if (arguments.length) {
                return e === undefined ? this : this.each(function(t) {
                    p.offset.setOffset(this, e, t);
                });
            }
            var t, n, i = this[0], r = {
                top: 0,
                left: 0
            }, o = i && i.ownerDocument;
            if (!o) {
                return;
            }
            t = o.documentElement;
            if (!p.contains(t, i)) {
                return r;
            }
            if (typeof i.getBoundingClientRect !== G) {
                r = i.getBoundingClientRect();
            }
            n = Pt(o);
            return {
                top: r.top + n.pageYOffset - t.clientTop,
                left: r.left + n.pageXOffset - t.clientLeft
            };
        },
        position: function() {
            if (!this[0]) {
                return;
            }
            var e, t, n = this[0], i = {
                top: 0,
                left: 0
            };
            if (p.css(n, "position") === "fixed") {
                t = n.getBoundingClientRect();
            } else {
                e = this.offsetParent();
                t = this.offset();
                if (!p.nodeName(e[0], "html")) {
                    i = e.offset();
                }
                i.top += p.css(e[0], "borderTopWidth", true);
                i.left += p.css(e[0], "borderLeftWidth", true);
            }
            return {
                top: t.top - i.top - p.css(n, "marginTop", true),
                left: t.left - i.left - p.css(n, "marginLeft", true)
            };
        },
        offsetParent: function() {
            return this.map(function() {
                var e = this.offsetParent || Ot;
                while (e && (!p.nodeName(e, "html") && p.css(e, "position") === "static")) {
                    e = e.offsetParent;
                }
                return e || Ot;
            });
        }
    });
    p.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(t, n) {
        var i = "pageYOffset" === n;
        p.fn[t] = function(r) {
            return P(this, function(t, r, o) {
                var s = Pt(t);
                if (o === undefined) {
                    return s ? s[n] : t[r];
                }
                if (s) {
                    s.scrollTo(!i ? o : e.pageXOffset, i ? o : e.pageYOffset);
                } else {
                    t[r] = o;
                }
            }, t, r, arguments.length, null);
        };
    });
    p.each([ "top", "left" ], function(e, t) {
        p.cssHooks[t] = De(u.pixelPosition, function(e, n) {
            if (n) {
                n = Te(e, t);
                return xe.test(n) ? p(e).position()[t] + "px" : n;
            }
        });
    });
    p.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        p.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(n, i) {
            p.fn[i] = function(i, r) {
                var o = arguments.length && (n || typeof i !== "boolean"), s = n || (i === true || r === true ? "margin" : "border");
                return P(this, function(t, n, i) {
                    var r;
                    if (p.isWindow(t)) {
                        return t.document.documentElement["client" + e];
                    }
                    if (t.nodeType === 9) {
                        r = t.documentElement;
                        return Math.max(t.body["scroll" + e], r["scroll" + e], t.body["offset" + e], r["offset" + e], r["client" + e]);
                    }
                    return i === undefined ? p.css(t, n, s) : p.style(t, n, i, s);
                }, t, o ? i : undefined, o, null);
            };
        });
    });
    p.fn.size = function() {
        return this.length;
    };
    p.fn.andSelf = p.fn.addBack;
    if (typeof define === "function" && define.amd) {
        define("jquery", [], function() {
            return p;
        });
    }
    var Rt = e.jQuery, Ht = e.$;
    p.noConflict = function(t) {
        if (e.$ === p) {
            e.$ = Ht;
        }
        if (t && e.jQuery === p) {
            e.jQuery = Rt;
        }
        return p;
    };
    if (typeof t === G) {
        e.jQuery = e.$ = p;
    }
    return p;
});

if (typeof jQuery === "undefined") {
    throw new Error("Bootstrap's JavaScript requires jQuery");
}

+function(e) {
    "use strict";
    var t = e.fn.jquery.split(" ")[0].split(".");
    if (t[0] < 2 && t[1] < 9 || t[0] == 1 && t[1] == 9 && t[2] < 1 || t[0] > 3) {
        throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4");
    }
}(jQuery);

+function(e) {
    "use strict";
    function t() {
        var e = document.createElement("bootstrap");
        var t = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        for (var n in t) {
            if (e.style[n] !== undefined) {
                return {
                    end: t[n]
                };
            }
        }
        return false;
    }
    e.fn.emulateTransitionEnd = function(t) {
        var n = false;
        var i = this;
        e(this).one("bsTransitionEnd", function() {
            n = true;
        });
        var r = function() {
            if (!n) e(i).trigger(e.support.transition.end);
        };
        setTimeout(r, t);
        return this;
    };
    e(function() {
        e.support.transition = t();
        if (!e.support.transition) return;
        e.event.special.bsTransitionEnd = {
            bindType: e.support.transition.end,
            delegateType: e.support.transition.end,
            handle: function(t) {
                if (e(t.target).is(this)) return t.handleObj.handler.apply(this, arguments);
            }
        };
    });
}(jQuery);

+function(e) {
    "use strict";
    var t = '[data-dismiss="alert"]';
    var n = function(n) {
        e(n).on("click", t, this.close);
    };
    n.VERSION = "3.3.7";
    n.TRANSITION_DURATION = 150;
    n.prototype.close = function(t) {
        var i = e(this);
        var r = i.attr("data-target");
        if (!r) {
            r = i.attr("href");
            r = r && r.replace(/.*(?=#[^\s]*$)/, "");
        }
        var o = e(r === "#" ? [] : r);
        if (t) t.preventDefault();
        if (!o.length) {
            o = i.closest(".alert");
        }
        o.trigger(t = e.Event("close.bs.alert"));
        if (t.isDefaultPrevented()) return;
        o.removeClass("in");
        function s() {
            o.detach().trigger("closed.bs.alert").remove();
        }
        e.support.transition && o.hasClass("fade") ? o.one("bsTransitionEnd", s).emulateTransitionEnd(n.TRANSITION_DURATION) : s();
    };
    function i(t) {
        return this.each(function() {
            var i = e(this);
            var r = i.data("bs.alert");
            if (!r) i.data("bs.alert", r = new n(this));
            if (typeof t == "string") r[t].call(i);
        });
    }
    var r = e.fn.alert;
    e.fn.alert = i;
    e.fn.alert.Constructor = n;
    e.fn.alert.noConflict = function() {
        e.fn.alert = r;
        return this;
    };
    e(document).on("click.bs.alert.data-api", t, n.prototype.close);
}(jQuery);

+function(e) {
    "use strict";
    var t = function(n, i) {
        this.$element = e(n);
        this.options = e.extend({}, t.DEFAULTS, i);
        this.isLoading = false;
    };
    t.VERSION = "3.3.7";
    t.DEFAULTS = {
        loadingText: "loading..."
    };
    t.prototype.setState = function(t) {
        var n = "disabled";
        var i = this.$element;
        var r = i.is("input") ? "val" : "html";
        var o = i.data();
        t += "Text";
        if (o.resetText == null) i.data("resetText", i[r]());
        setTimeout(e.proxy(function() {
            i[r](o[t] == null ? this.options[t] : o[t]);
            if (t == "loadingText") {
                this.isLoading = true;
                i.addClass(n).attr(n, n).prop(n, true);
            } else if (this.isLoading) {
                this.isLoading = false;
                i.removeClass(n).removeAttr(n).prop(n, false);
            }
        }, this), 0);
    };
    t.prototype.toggle = function() {
        var e = true;
        var t = this.$element.closest('[data-toggle="buttons"]');
        if (t.length) {
            var n = this.$element.find("input");
            if (n.prop("type") == "radio") {
                if (n.prop("checked")) e = false;
                t.find(".active").removeClass("active");
                this.$element.addClass("active");
            } else if (n.prop("type") == "checkbox") {
                if (n.prop("checked") !== this.$element.hasClass("active")) e = false;
                this.$element.toggleClass("active");
            }
            n.prop("checked", this.$element.hasClass("active"));
            if (e) n.trigger("change");
        } else {
            this.$element.attr("aria-pressed", !this.$element.hasClass("active"));
            this.$element.toggleClass("active");
        }
    };
    function n(n) {
        return this.each(function() {
            var i = e(this);
            var r = i.data("bs.button");
            var o = typeof n == "object" && n;
            if (!r) i.data("bs.button", r = new t(this, o));
            if (n == "toggle") r.toggle(); else if (n) r.setState(n);
        });
    }
    var i = e.fn.button;
    e.fn.button = n;
    e.fn.button.Constructor = t;
    e.fn.button.noConflict = function() {
        e.fn.button = i;
        return this;
    };
    e(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(t) {
        var i = e(t.target).closest(".btn");
        n.call(i, "toggle");
        if (!e(t.target).is('input[type="radio"], input[type="checkbox"]')) {
            t.preventDefault();
            if (i.is("input,button")) i.trigger("focus"); else i.find("input:visible,button:visible").first().trigger("focus");
        }
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function(t) {
        e(t.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(t.type));
    });
}(jQuery);

+function(e) {
    "use strict";
    var t = function(t, n) {
        this.$element = e(t);
        this.$indicators = this.$element.find(".carousel-indicators");
        this.options = n;
        this.paused = null;
        this.sliding = null;
        this.interval = null;
        this.$active = null;
        this.$items = null;
        this.options.keyboard && this.$element.on("keydown.bs.carousel", e.proxy(this.keydown, this));
        this.options.pause == "hover" && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", e.proxy(this.pause, this)).on("mouseleave.bs.carousel", e.proxy(this.cycle, this));
    };
    t.VERSION = "3.3.7";
    t.TRANSITION_DURATION = 600;
    t.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: true,
        keyboard: true
    };
    t.prototype.keydown = function(e) {
        if (/input|textarea/i.test(e.target.tagName)) return;
        switch (e.which) {
          case 37:
            this.prev();
            break;

          case 39:
            this.next();
            break;

          default:
            return;
        }
        e.preventDefault();
    };
    t.prototype.cycle = function(t) {
        t || (this.paused = false);
        this.interval && clearInterval(this.interval);
        this.options.interval && !this.paused && (this.interval = setInterval(e.proxy(this.next, this), this.options.interval));
        return this;
    };
    t.prototype.getItemIndex = function(e) {
        this.$items = e.parent().children(".item");
        return this.$items.index(e || this.$active);
    };
    t.prototype.getItemForDirection = function(e, t) {
        var n = this.getItemIndex(t);
        var i = e == "prev" && n === 0 || e == "next" && n == this.$items.length - 1;
        if (i && !this.options.wrap) return t;
        var r = e == "prev" ? -1 : 1;
        var o = (n + r) % this.$items.length;
        return this.$items.eq(o);
    };
    t.prototype.to = function(e) {
        var t = this;
        var n = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        if (e > this.$items.length - 1 || e < 0) return;
        if (this.sliding) return this.$element.one("slid.bs.carousel", function() {
            t.to(e);
        });
        if (n == e) return this.pause().cycle();
        return this.slide(e > n ? "next" : "prev", this.$items.eq(e));
    };
    t.prototype.pause = function(t) {
        t || (this.paused = true);
        if (this.$element.find(".next, .prev").length && e.support.transition) {
            this.$element.trigger(e.support.transition.end);
            this.cycle(true);
        }
        this.interval = clearInterval(this.interval);
        return this;
    };
    t.prototype.next = function() {
        if (this.sliding) return;
        return this.slide("next");
    };
    t.prototype.prev = function() {
        if (this.sliding) return;
        return this.slide("prev");
    };
    t.prototype.slide = function(n, i) {
        var r = this.$element.find(".item.active");
        var o = i || this.getItemForDirection(n, r);
        var s = this.interval;
        var a = n == "next" ? "left" : "right";
        var l = this;
        if (o.hasClass("active")) return this.sliding = false;
        var f = o[0];
        var u = e.Event("slide.bs.carousel", {
            relatedTarget: f,
            direction: a
        });
        this.$element.trigger(u);
        if (u.isDefaultPrevented()) return;
        this.sliding = true;
        s && this.pause();
        if (this.$indicators.length) {
            this.$indicators.find(".active").removeClass("active");
            var c = e(this.$indicators.children()[this.getItemIndex(o)]);
            c && c.addClass("active");
        }
        var d = e.Event("slid.bs.carousel", {
            relatedTarget: f,
            direction: a
        });
        if (e.support.transition && this.$element.hasClass("slide")) {
            o.addClass(n);
            o[0].offsetWidth;
            r.addClass(a);
            o.addClass(a);
            r.one("bsTransitionEnd", function() {
                o.removeClass([ n, a ].join(" ")).addClass("active");
                r.removeClass([ "active", a ].join(" "));
                l.sliding = false;
                setTimeout(function() {
                    l.$element.trigger(d);
                }, 0);
            }).emulateTransitionEnd(t.TRANSITION_DURATION);
        } else {
            r.removeClass("active");
            o.addClass("active");
            this.sliding = false;
            this.$element.trigger(d);
        }
        s && this.cycle();
        return this;
    };
    function n(n) {
        return this.each(function() {
            var i = e(this);
            var r = i.data("bs.carousel");
            var o = e.extend({}, t.DEFAULTS, i.data(), typeof n == "object" && n);
            var s = typeof n == "string" ? n : o.slide;
            if (!r) i.data("bs.carousel", r = new t(this, o));
            if (typeof n == "number") r.to(n); else if (s) r[s](); else if (o.interval) r.pause().cycle();
        });
    }
    var i = e.fn.carousel;
    e.fn.carousel = n;
    e.fn.carousel.Constructor = t;
    e.fn.carousel.noConflict = function() {
        e.fn.carousel = i;
        return this;
    };
    var r = function(t) {
        var i;
        var r = e(this);
        var o = e(r.attr("data-target") || (i = r.attr("href")) && i.replace(/.*(?=#[^\s]+$)/, ""));
        if (!o.hasClass("carousel")) return;
        var s = e.extend({}, o.data(), r.data());
        var a = r.attr("data-slide-to");
        if (a) s.interval = false;
        n.call(o, s);
        if (a) {
            o.data("bs.carousel").to(a);
        }
        t.preventDefault();
    };
    e(document).on("click.bs.carousel.data-api", "[data-slide]", r).on("click.bs.carousel.data-api", "[data-slide-to]", r);
    e(window).on("load", function() {
        e('[data-ride="carousel"]').each(function() {
            var t = e(this);
            n.call(t, t.data());
        });
    });
}(jQuery);

+function(e) {
    "use strict";
    var t = function(n, i) {
        this.$element = e(n);
        this.options = e.extend({}, t.DEFAULTS, i);
        this.$trigger = e('[data-toggle="collapse"][href="#' + n.id + '"],' + '[data-toggle="collapse"][data-target="#' + n.id + '"]');
        this.transitioning = null;
        if (this.options.parent) {
            this.$parent = this.getParent();
        } else {
            this.addAriaAndCollapsedClass(this.$element, this.$trigger);
        }
        if (this.options.toggle) this.toggle();
    };
    t.VERSION = "3.3.7";
    t.TRANSITION_DURATION = 350;
    t.DEFAULTS = {
        toggle: true
    };
    t.prototype.dimension = function() {
        var e = this.$element.hasClass("width");
        return e ? "width" : "height";
    };
    t.prototype.show = function() {
        if (this.transitioning || this.$element.hasClass("in")) return;
        var n;
        var r = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
        if (r && r.length) {
            n = r.data("bs.collapse");
            if (n && n.transitioning) return;
        }
        var o = e.Event("show.bs.collapse");
        this.$element.trigger(o);
        if (o.isDefaultPrevented()) return;
        if (r && r.length) {
            i.call(r, "hide");
            n || r.data("bs.collapse", null);
        }
        var s = this.dimension();
        this.$element.removeClass("collapse").addClass("collapsing")[s](0).attr("aria-expanded", true);
        this.$trigger.removeClass("collapsed").attr("aria-expanded", true);
        this.transitioning = 1;
        var a = function() {
            this.$element.removeClass("collapsing").addClass("collapse in")[s]("");
            this.transitioning = 0;
            this.$element.trigger("shown.bs.collapse");
        };
        if (!e.support.transition) return a.call(this);
        var l = e.camelCase([ "scroll", s ].join("-"));
        this.$element.one("bsTransitionEnd", e.proxy(a, this)).emulateTransitionEnd(t.TRANSITION_DURATION)[s](this.$element[0][l]);
    };
    t.prototype.hide = function() {
        if (this.transitioning || !this.$element.hasClass("in")) return;
        var n = e.Event("hide.bs.collapse");
        this.$element.trigger(n);
        if (n.isDefaultPrevented()) return;
        var i = this.dimension();
        this.$element[i](this.$element[i]())[0].offsetHeight;
        this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", false);
        this.$trigger.addClass("collapsed").attr("aria-expanded", false);
        this.transitioning = 1;
        var r = function() {
            this.transitioning = 0;
            this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse");
        };
        if (!e.support.transition) return r.call(this);
        this.$element[i](0).one("bsTransitionEnd", e.proxy(r, this)).emulateTransitionEnd(t.TRANSITION_DURATION);
    };
    t.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]();
    };
    t.prototype.getParent = function() {
        return e(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(e.proxy(function(t, i) {
            var r = e(i);
            this.addAriaAndCollapsedClass(n(r), r);
        }, this)).end();
    };
    t.prototype.addAriaAndCollapsedClass = function(e, t) {
        var n = e.hasClass("in");
        e.attr("aria-expanded", n);
        t.toggleClass("collapsed", !n).attr("aria-expanded", n);
    };
    function n(t) {
        var n;
        var i = t.attr("data-target") || (n = t.attr("href")) && n.replace(/.*(?=#[^\s]+$)/, "");
        return e(i);
    }
    function i(n) {
        return this.each(function() {
            var i = e(this);
            var r = i.data("bs.collapse");
            var o = e.extend({}, t.DEFAULTS, i.data(), typeof n == "object" && n);
            if (!r && o.toggle && /show|hide/.test(n)) o.toggle = false;
            if (!r) i.data("bs.collapse", r = new t(this, o));
            if (typeof n == "string") r[n]();
        });
    }
    var r = e.fn.collapse;
    e.fn.collapse = i;
    e.fn.collapse.Constructor = t;
    e.fn.collapse.noConflict = function() {
        e.fn.collapse = r;
        return this;
    };
    e(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(t) {
        var r = e(this);
        if (!r.attr("data-target")) t.preventDefault();
        var o = n(r);
        var s = o.data("bs.collapse");
        var a = s ? "toggle" : r.data();
        i.call(o, a);
    });
}(jQuery);

+function(e) {
    "use strict";
    var t = ".dropdown-backdrop";
    var n = '[data-toggle="dropdown"]';
    var i = function(t) {
        e(t).on("click.bs.dropdown", this.toggle);
    };
    i.VERSION = "3.3.7";
    function r(t) {
        var n = t.attr("data-target");
        if (!n) {
            n = t.attr("href");
            n = n && /#[A-Za-z]/.test(n) && n.replace(/.*(?=#[^\s]*$)/, "");
        }
        var i = n && e(n);
        return i && i.length ? i : t.parent();
    }
    function o(i) {
        if (i && i.which === 3) return;
        e(t).remove();
        e(n).each(function() {
            var t = e(this);
            var n = r(t);
            var o = {
                relatedTarget: this
            };
            if (!n.hasClass("open")) return;
            if (i && i.type == "click" && /input|textarea/i.test(i.target.tagName) && e.contains(n[0], i.target)) return;
            n.trigger(i = e.Event("hide.bs.dropdown", o));
            if (i.isDefaultPrevented()) return;
            t.attr("aria-expanded", "false");
            n.removeClass("open").trigger(e.Event("hidden.bs.dropdown", o));
        });
    }
    i.prototype.toggle = function(t) {
        var n = e(this);
        if (n.is(".disabled, :disabled")) return;
        var i = r(n);
        var s = i.hasClass("open");
        o();
        if (!s) {
            if ("ontouchstart" in document.documentElement && !i.closest(".navbar-nav").length) {
                e(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(e(this)).on("click", o);
            }
            var a = {
                relatedTarget: this
            };
            i.trigger(t = e.Event("show.bs.dropdown", a));
            if (t.isDefaultPrevented()) return;
            n.trigger("focus").attr("aria-expanded", "true");
            i.toggleClass("open").trigger(e.Event("shown.bs.dropdown", a));
        }
        return false;
    };
    i.prototype.keydown = function(t) {
        if (!/(38|40|27|32)/.test(t.which) || /input|textarea/i.test(t.target.tagName)) return;
        var i = e(this);
        t.preventDefault();
        t.stopPropagation();
        if (i.is(".disabled, :disabled")) return;
        var o = r(i);
        var s = o.hasClass("open");
        if (!s && t.which != 27 || s && t.which == 27) {
            if (t.which == 27) o.find(n).trigger("focus");
            return i.trigger("click");
        }
        var a = " li:not(.disabled):visible a";
        var l = o.find(".dropdown-menu" + a);
        if (!l.length) return;
        var f = l.index(t.target);
        if (t.which == 38 && f > 0) f--;
        if (t.which == 40 && f < l.length - 1) f++;
        if (!~f) f = 0;
        l.eq(f).trigger("focus");
    };
    function s(t) {
        return this.each(function() {
            var n = e(this);
            var r = n.data("bs.dropdown");
            if (!r) n.data("bs.dropdown", r = new i(this));
            if (typeof t == "string") r[t].call(n);
        });
    }
    var a = e.fn.dropdown;
    e.fn.dropdown = s;
    e.fn.dropdown.Constructor = i;
    e.fn.dropdown.noConflict = function() {
        e.fn.dropdown = a;
        return this;
    };
    e(document).on("click.bs.dropdown.data-api", o).on("click.bs.dropdown.data-api", ".dropdown form", function(e) {
        e.stopPropagation();
    }).on("click.bs.dropdown.data-api", n, i.prototype.toggle).on("keydown.bs.dropdown.data-api", n, i.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", i.prototype.keydown);
}(jQuery);

+function(e) {
    "use strict";
    var t = function(t, n) {
        this.options = n;
        this.$body = e(document.body);
        this.$element = e(t);
        this.$dialog = this.$element.find(".modal-dialog");
        this.$backdrop = null;
        this.isShown = null;
        this.originalBodyPad = null;
        this.scrollbarWidth = 0;
        this.ignoreBackdropClick = false;
        if (this.options.remote) {
            this.$element.find(".modal-content").load(this.options.remote, e.proxy(function() {
                this.$element.trigger("loaded.bs.modal");
            }, this));
        }
    };
    t.VERSION = "3.3.7";
    t.TRANSITION_DURATION = 300;
    t.BACKDROP_TRANSITION_DURATION = 150;
    t.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    };
    t.prototype.toggle = function(e) {
        return this.isShown ? this.hide() : this.show(e);
    };
    t.prototype.show = function(n) {
        var i = this;
        var r = e.Event("show.bs.modal", {
            relatedTarget: n
        });
        this.$element.trigger(r);
        if (this.isShown || r.isDefaultPrevented()) return;
        this.isShown = true;
        this.checkScrollbar();
        this.setScrollbar();
        this.$body.addClass("modal-open");
        this.escape();
        this.resize();
        this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', e.proxy(this.hide, this));
        this.$dialog.on("mousedown.dismiss.bs.modal", function() {
            i.$element.one("mouseup.dismiss.bs.modal", function(t) {
                if (e(t.target).is(i.$element)) i.ignoreBackdropClick = true;
            });
        });
        this.backdrop(function() {
            var r = e.support.transition && i.$element.hasClass("fade");
            if (!i.$element.parent().length) {
                i.$element.appendTo(i.$body);
            }
            i.$element.show().scrollTop(0);
            i.adjustDialog();
            if (r) {
                i.$element[0].offsetWidth;
            }
            i.$element.addClass("in");
            i.enforceFocus();
            var o = e.Event("shown.bs.modal", {
                relatedTarget: n
            });
            r ? i.$dialog.one("bsTransitionEnd", function() {
                i.$element.trigger("focus").trigger(o);
            }).emulateTransitionEnd(t.TRANSITION_DURATION) : i.$element.trigger("focus").trigger(o);
        });
    };
    t.prototype.hide = function(n) {
        if (n) n.preventDefault();
        n = e.Event("hide.bs.modal");
        this.$element.trigger(n);
        if (!this.isShown || n.isDefaultPrevented()) return;
        this.isShown = false;
        this.escape();
        this.resize();
        e(document).off("focusin.bs.modal");
        this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal");
        this.$dialog.off("mousedown.dismiss.bs.modal");
        e.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", e.proxy(this.hideModal, this)).emulateTransitionEnd(t.TRANSITION_DURATION) : this.hideModal();
    };
    t.prototype.enforceFocus = function() {
        e(document).off("focusin.bs.modal").on("focusin.bs.modal", e.proxy(function(e) {
            if (document !== e.target && this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                this.$element.trigger("focus");
            }
        }, this));
    };
    t.prototype.escape = function() {
        if (this.isShown && this.options.keyboard) {
            this.$element.on("keydown.dismiss.bs.modal", e.proxy(function(e) {
                e.which == 27 && this.hide();
            }, this));
        } else if (!this.isShown) {
            this.$element.off("keydown.dismiss.bs.modal");
        }
    };
    t.prototype.resize = function() {
        if (this.isShown) {
            e(window).on("resize.bs.modal", e.proxy(this.handleUpdate, this));
        } else {
            e(window).off("resize.bs.modal");
        }
    };
    t.prototype.hideModal = function() {
        var e = this;
        this.$element.hide();
        this.backdrop(function() {
            e.$body.removeClass("modal-open");
            e.resetAdjustments();
            e.resetScrollbar();
            e.$element.trigger("hidden.bs.modal");
        });
    };
    t.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
    };
    t.prototype.backdrop = function(n) {
        var i = this;
        var r = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var o = e.support.transition && r;
            this.$backdrop = e(document.createElement("div")).addClass("modal-backdrop " + r).appendTo(this.$body);
            this.$element.on("click.dismiss.bs.modal", e.proxy(function(e) {
                if (this.ignoreBackdropClick) {
                    this.ignoreBackdropClick = false;
                    return;
                }
                if (e.target !== e.currentTarget) return;
                this.options.backdrop == "static" ? this.$element[0].focus() : this.hide();
            }, this));
            if (o) this.$backdrop[0].offsetWidth;
            this.$backdrop.addClass("in");
            if (!n) return;
            o ? this.$backdrop.one("bsTransitionEnd", n).emulateTransitionEnd(t.BACKDROP_TRANSITION_DURATION) : n();
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var s = function() {
                i.removeBackdrop();
                n && n();
            };
            e.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", s).emulateTransitionEnd(t.BACKDROP_TRANSITION_DURATION) : s();
        } else if (n) {
            n();
        }
    };
    t.prototype.handleUpdate = function() {
        this.adjustDialog();
    };
    t.prototype.adjustDialog = function() {
        var e = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && e ? this.scrollbarWidth : "",
            paddingRight: this.bodyIsOverflowing && !e ? this.scrollbarWidth : ""
        });
    };
    t.prototype.resetAdjustments = function() {
        this.$element.css({
            paddingLeft: "",
            paddingRight: ""
        });
    };
    t.prototype.checkScrollbar = function() {
        var e = window.innerWidth;
        if (!e) {
            var t = document.documentElement.getBoundingClientRect();
            e = t.right - Math.abs(t.left);
        }
        this.bodyIsOverflowing = document.body.clientWidth < e;
        this.scrollbarWidth = this.measureScrollbar();
    };
    t.prototype.setScrollbar = function() {
        var e = parseInt(this.$body.css("padding-right") || 0, 10);
        this.originalBodyPad = document.body.style.paddingRight || "";
        if (this.bodyIsOverflowing) this.$body.css("padding-right", e + this.scrollbarWidth);
    };
    t.prototype.resetScrollbar = function() {
        this.$body.css("padding-right", this.originalBodyPad);
    };
    t.prototype.measureScrollbar = function() {
        var e = document.createElement("div");
        e.className = "modal-scrollbar-measure";
        this.$body.append(e);
        var t = e.offsetWidth - e.clientWidth;
        this.$body[0].removeChild(e);
        return t;
    };
    function n(n, i) {
        return this.each(function() {
            var r = e(this);
            var o = r.data("bs.modal");
            var s = e.extend({}, t.DEFAULTS, r.data(), typeof n == "object" && n);
            if (!o) r.data("bs.modal", o = new t(this, s));
            if (typeof n == "string") o[n](i); else if (s.show) o.show(i);
        });
    }
    var i = e.fn.modal;
    e.fn.modal = n;
    e.fn.modal.Constructor = t;
    e.fn.modal.noConflict = function() {
        e.fn.modal = i;
        return this;
    };
    e(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(t) {
        var i = e(this);
        var r = i.attr("href");
        var o = e(i.attr("data-target") || r && r.replace(/.*(?=#[^\s]+$)/, ""));
        var s = o.data("bs.modal") ? "toggle" : e.extend({
            remote: !/#/.test(r) && r
        }, o.data(), i.data());
        if (i.is("a")) t.preventDefault();
        o.one("show.bs.modal", function(e) {
            if (e.isDefaultPrevented()) return;
            o.one("hidden.bs.modal", function() {
                i.is(":visible") && i.trigger("focus");
            });
        });
        n.call(o, s, this);
    });
}(jQuery);

+function(e) {
    "use strict";
    var t = function(e, t) {
        this.type = null;
        this.options = null;
        this.enabled = null;
        this.timeout = null;
        this.hoverState = null;
        this.$element = null;
        this.inState = null;
        this.init("tooltip", e, t);
    };
    t.VERSION = "3.3.7";
    t.TRANSITION_DURATION = 150;
    t.DEFAULTS = {
        animation: true,
        placement: "top",
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: "body",
            padding: 0
        }
    };
    t.prototype.init = function(t, n, i) {
        this.enabled = true;
        this.type = t;
        this.$element = e(n);
        this.options = this.getOptions(i);
        this.$viewport = this.options.viewport && e(e.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport);
        this.inState = {
            click: false,
            hover: false,
            focus: false
        };
        if (this.$element[0] instanceof document.constructor && !this.options.selector) {
            throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
        }
        var r = this.options.trigger.split(" ");
        for (var o = r.length; o--; ) {
            var s = r[o];
            if (s == "click") {
                this.$element.on("click." + this.type, this.options.selector, e.proxy(this.toggle, this));
            } else if (s != "manual") {
                var a = s == "hover" ? "mouseenter" : "focusin";
                var l = s == "hover" ? "mouseleave" : "focusout";
                this.$element.on(a + "." + this.type, this.options.selector, e.proxy(this.enter, this));
                this.$element.on(l + "." + this.type, this.options.selector, e.proxy(this.leave, this));
            }
        }
        this.options.selector ? this._options = e.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle();
    };
    t.prototype.getDefaults = function() {
        return t.DEFAULTS;
    };
    t.prototype.getOptions = function(t) {
        t = e.extend({}, this.getDefaults(), this.$element.data(), t);
        if (t.delay && typeof t.delay == "number") {
            t.delay = {
                show: t.delay,
                hide: t.delay
            };
        }
        return t;
    };
    t.prototype.getDelegateOptions = function() {
        var t = {};
        var n = this.getDefaults();
        this._options && e.each(this._options, function(e, i) {
            if (n[e] != i) t[e] = i;
        });
        return t;
    };
    t.prototype.enter = function(t) {
        var n = t instanceof this.constructor ? t : e(t.currentTarget).data("bs." + this.type);
        if (!n) {
            n = new this.constructor(t.currentTarget, this.getDelegateOptions());
            e(t.currentTarget).data("bs." + this.type, n);
        }
        if (t instanceof e.Event) {
            n.inState[t.type == "focusin" ? "focus" : "hover"] = true;
        }
        if (n.tip().hasClass("in") || n.hoverState == "in") {
            n.hoverState = "in";
            return;
        }
        clearTimeout(n.timeout);
        n.hoverState = "in";
        if (!n.options.delay || !n.options.delay.show) return n.show();
        n.timeout = setTimeout(function() {
            if (n.hoverState == "in") n.show();
        }, n.options.delay.show);
    };
    t.prototype.isInStateTrue = function() {
        for (var e in this.inState) {
            if (this.inState[e]) return true;
        }
        return false;
    };
    t.prototype.leave = function(t) {
        var n = t instanceof this.constructor ? t : e(t.currentTarget).data("bs." + this.type);
        if (!n) {
            n = new this.constructor(t.currentTarget, this.getDelegateOptions());
            e(t.currentTarget).data("bs." + this.type, n);
        }
        if (t instanceof e.Event) {
            n.inState[t.type == "focusout" ? "focus" : "hover"] = false;
        }
        if (n.isInStateTrue()) return;
        clearTimeout(n.timeout);
        n.hoverState = "out";
        if (!n.options.delay || !n.options.delay.hide) return n.hide();
        n.timeout = setTimeout(function() {
            if (n.hoverState == "out") n.hide();
        }, n.options.delay.hide);
    };
    t.prototype.show = function() {
        var n = e.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(n);
            var i = e.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (n.isDefaultPrevented() || !i) return;
            var r = this;
            var o = this.tip();
            var s = this.getUID(this.type);
            this.setContent();
            o.attr("id", s);
            this.$element.attr("aria-describedby", s);
            if (this.options.animation) o.addClass("fade");
            var a = typeof this.options.placement == "function" ? this.options.placement.call(this, o[0], this.$element[0]) : this.options.placement;
            var l = /\s?auto?\s?/i;
            var f = l.test(a);
            if (f) a = a.replace(l, "") || "top";
            o.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(a).data("bs." + this.type, this);
            this.options.container ? o.appendTo(this.options.container) : o.insertAfter(this.$element);
            this.$element.trigger("inserted.bs." + this.type);
            var u = this.getPosition();
            var c = o[0].offsetWidth;
            var d = o[0].offsetHeight;
            if (f) {
                var p = a;
                var h = this.getPosition(this.$viewport);
                a = a == "bottom" && u.bottom + d > h.bottom ? "top" : a == "top" && u.top - d < h.top ? "bottom" : a == "right" && u.right + c > h.width ? "left" : a == "left" && u.left - c < h.left ? "right" : a;
                o.removeClass(p).addClass(a);
            }
            var g = this.getCalculatedOffset(a, u, c, d);
            this.applyPlacement(g, a);
            var v = function() {
                var e = r.hoverState;
                r.$element.trigger("shown.bs." + r.type);
                r.hoverState = null;
                if (e == "out") r.leave(r);
            };
            e.support.transition && this.$tip.hasClass("fade") ? o.one("bsTransitionEnd", v).emulateTransitionEnd(t.TRANSITION_DURATION) : v();
        }
    };
    t.prototype.applyPlacement = function(t, n) {
        var i = this.tip();
        var r = i[0].offsetWidth;
        var o = i[0].offsetHeight;
        var s = parseInt(i.css("margin-top"), 10);
        var a = parseInt(i.css("margin-left"), 10);
        if (isNaN(s)) s = 0;
        if (isNaN(a)) a = 0;
        t.top += s;
        t.left += a;
        e.offset.setOffset(i[0], e.extend({
            using: function(e) {
                i.css({
                    top: Math.round(e.top),
                    left: Math.round(e.left)
                });
            }
        }, t), 0);
        i.addClass("in");
        var l = i[0].offsetWidth;
        var f = i[0].offsetHeight;
        if (n == "top" && f != o) {
            t.top = t.top + o - f;
        }
        var u = this.getViewportAdjustedDelta(n, t, l, f);
        if (u.left) t.left += u.left; else t.top += u.top;
        var c = /top|bottom/.test(n);
        var d = c ? u.left * 2 - r + l : u.top * 2 - o + f;
        var p = c ? "offsetWidth" : "offsetHeight";
        i.offset(t);
        this.replaceArrow(d, i[0][p], c);
    };
    t.prototype.replaceArrow = function(e, t, n) {
        this.arrow().css(n ? "left" : "top", 50 * (1 - e / t) + "%").css(n ? "top" : "left", "");
    };
    t.prototype.setContent = function() {
        var e = this.tip();
        var t = this.getTitle();
        e.find(".tooltip-inner")[this.options.html ? "html" : "text"](t);
        e.removeClass("fade in top bottom left right");
    };
    t.prototype.hide = function(n) {
        var i = this;
        var r = e(this.$tip);
        var o = e.Event("hide.bs." + this.type);
        function s() {
            if (i.hoverState != "in") r.detach();
            if (i.$element) {
                i.$element.removeAttr("aria-describedby").trigger("hidden.bs." + i.type);
            }
            n && n();
        }
        this.$element.trigger(o);
        if (o.isDefaultPrevented()) return;
        r.removeClass("in");
        e.support.transition && r.hasClass("fade") ? r.one("bsTransitionEnd", s).emulateTransitionEnd(t.TRANSITION_DURATION) : s();
        this.hoverState = null;
        return this;
    };
    t.prototype.fixTitle = function() {
        var e = this.$element;
        if (e.attr("title") || typeof e.attr("data-original-title") != "string") {
            e.attr("data-original-title", e.attr("title") || "").attr("title", "");
        }
    };
    t.prototype.hasContent = function() {
        return this.getTitle();
    };
    t.prototype.getPosition = function(t) {
        t = t || this.$element;
        var n = t[0];
        var i = n.tagName == "BODY";
        var r = n.getBoundingClientRect();
        if (r.width == null) {
            r = e.extend({}, r, {
                width: r.right - r.left,
                height: r.bottom - r.top
            });
        }
        var o = window.SVGElement && n instanceof window.SVGElement;
        var s = i ? {
            top: 0,
            left: 0
        } : o ? null : t.offset();
        var a = {
            scroll: i ? document.documentElement.scrollTop || document.body.scrollTop : t.scrollTop()
        };
        var l = i ? {
            width: e(window).width(),
            height: e(window).height()
        } : null;
        return e.extend({}, r, a, l, s);
    };
    t.prototype.getCalculatedOffset = function(e, t, n, i) {
        return e == "bottom" ? {
            top: t.top + t.height,
            left: t.left + t.width / 2 - n / 2
        } : e == "top" ? {
            top: t.top - i,
            left: t.left + t.width / 2 - n / 2
        } : e == "left" ? {
            top: t.top + t.height / 2 - i / 2,
            left: t.left - n
        } : {
            top: t.top + t.height / 2 - i / 2,
            left: t.left + t.width
        };
    };
    t.prototype.getViewportAdjustedDelta = function(e, t, n, i) {
        var r = {
            top: 0,
            left: 0
        };
        if (!this.$viewport) return r;
        var o = this.options.viewport && this.options.viewport.padding || 0;
        var s = this.getPosition(this.$viewport);
        if (/right|left/.test(e)) {
            var a = t.top - o - s.scroll;
            var l = t.top + o - s.scroll + i;
            if (a < s.top) {
                r.top = s.top - a;
            } else if (l > s.top + s.height) {
                r.top = s.top + s.height - l;
            }
        } else {
            var f = t.left - o;
            var u = t.left + o + n;
            if (f < s.left) {
                r.left = s.left - f;
            } else if (u > s.right) {
                r.left = s.left + s.width - u;
            }
        }
        return r;
    };
    t.prototype.getTitle = function() {
        var e;
        var t = this.$element;
        var n = this.options;
        e = t.attr("data-original-title") || (typeof n.title == "function" ? n.title.call(t[0]) : n.title);
        return e;
    };
    t.prototype.getUID = function(e) {
        do e += ~~(Math.random() * 1e6); while (document.getElementById(e));
        return e;
    };
    t.prototype.tip = function() {
        if (!this.$tip) {
            this.$tip = e(this.options.template);
            if (this.$tip.length != 1) {
                throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
            }
        }
        return this.$tip;
    };
    t.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow");
    };
    t.prototype.enable = function() {
        this.enabled = true;
    };
    t.prototype.disable = function() {
        this.enabled = false;
    };
    t.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled;
    };
    t.prototype.toggle = function(t) {
        var n = this;
        if (t) {
            n = e(t.currentTarget).data("bs." + this.type);
            if (!n) {
                n = new this.constructor(t.currentTarget, this.getDelegateOptions());
                e(t.currentTarget).data("bs." + this.type, n);
            }
        }
        if (t) {
            n.inState.click = !n.inState.click;
            if (n.isInStateTrue()) n.enter(n); else n.leave(n);
        } else {
            n.tip().hasClass("in") ? n.leave(n) : n.enter(n);
        }
    };
    t.prototype.destroy = function() {
        var e = this;
        clearTimeout(this.timeout);
        this.hide(function() {
            e.$element.off("." + e.type).removeData("bs." + e.type);
            if (e.$tip) {
                e.$tip.detach();
            }
            e.$tip = null;
            e.$arrow = null;
            e.$viewport = null;
            e.$element = null;
        });
    };
    function n(n) {
        return this.each(function() {
            var i = e(this);
            var r = i.data("bs.tooltip");
            var o = typeof n == "object" && n;
            if (!r && /destroy|hide/.test(n)) return;
            if (!r) i.data("bs.tooltip", r = new t(this, o));
            if (typeof n == "string") r[n]();
        });
    }
    var i = e.fn.tooltip;
    e.fn.tooltip = n;
    e.fn.tooltip.Constructor = t;
    e.fn.tooltip.noConflict = function() {
        e.fn.tooltip = i;
        return this;
    };
}(jQuery);

+function(e) {
    "use strict";
    var t = function(e, t) {
        this.init("popover", e, t);
    };
    if (!e.fn.tooltip) throw new Error("Popover requires tooltip.js");
    t.VERSION = "3.3.7";
    t.DEFAULTS = e.extend({}, e.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });
    t.prototype = e.extend({}, e.fn.tooltip.Constructor.prototype);
    t.prototype.constructor = t;
    t.prototype.getDefaults = function() {
        return t.DEFAULTS;
    };
    t.prototype.setContent = function() {
        var e = this.tip();
        var t = this.getTitle();
        var n = this.getContent();
        e.find(".popover-title")[this.options.html ? "html" : "text"](t);
        e.find(".popover-content").children().detach().end()[this.options.html ? typeof n == "string" ? "html" : "append" : "text"](n);
        e.removeClass("fade top bottom left right in");
        if (!e.find(".popover-title").html()) e.find(".popover-title").hide();
    };
    t.prototype.hasContent = function() {
        return this.getTitle() || this.getContent();
    };
    t.prototype.getContent = function() {
        var e = this.$element;
        var t = this.options;
        return e.attr("data-content") || (typeof t.content == "function" ? t.content.call(e[0]) : t.content);
    };
    t.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow");
    };
    function n(n) {
        return this.each(function() {
            var i = e(this);
            var r = i.data("bs.popover");
            var o = typeof n == "object" && n;
            if (!r && /destroy|hide/.test(n)) return;
            if (!r) i.data("bs.popover", r = new t(this, o));
            if (typeof n == "string") r[n]();
        });
    }
    var i = e.fn.popover;
    e.fn.popover = n;
    e.fn.popover.Constructor = t;
    e.fn.popover.noConflict = function() {
        e.fn.popover = i;
        return this;
    };
}(jQuery);

+function(e) {
    "use strict";
    function t(n, i) {
        this.$body = e(document.body);
        this.$scrollElement = e(n).is(document.body) ? e(window) : e(n);
        this.options = e.extend({}, t.DEFAULTS, i);
        this.selector = (this.options.target || "") + " .nav li > a";
        this.offsets = [];
        this.targets = [];
        this.activeTarget = null;
        this.scrollHeight = 0;
        this.$scrollElement.on("scroll.bs.scrollspy", e.proxy(this.process, this));
        this.refresh();
        this.process();
    }
    t.VERSION = "3.3.7";
    t.DEFAULTS = {
        offset: 10
    };
    t.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
    };
    t.prototype.refresh = function() {
        var t = this;
        var n = "offset";
        var i = 0;
        this.offsets = [];
        this.targets = [];
        this.scrollHeight = this.getScrollHeight();
        if (!e.isWindow(this.$scrollElement[0])) {
            n = "position";
            i = this.$scrollElement.scrollTop();
        }
        this.$body.find(this.selector).map(function() {
            var t = e(this);
            var r = t.data("target") || t.attr("href");
            var o = /^#./.test(r) && e(r);
            return o && o.length && o.is(":visible") && [ [ o[n]().top + i, r ] ] || null;
        }).sort(function(e, t) {
            return e[0] - t[0];
        }).each(function() {
            t.offsets.push(this[0]);
            t.targets.push(this[1]);
        });
    };
    t.prototype.process = function() {
        var e = this.$scrollElement.scrollTop() + this.options.offset;
        var t = this.getScrollHeight();
        var n = this.options.offset + t - this.$scrollElement.height();
        var i = this.offsets;
        var r = this.targets;
        var o = this.activeTarget;
        var s;
        if (this.scrollHeight != t) {
            this.refresh();
        }
        if (e >= n) {
            return o != (s = r[r.length - 1]) && this.activate(s);
        }
        if (o && e < i[0]) {
            this.activeTarget = null;
            return this.clear();
        }
        for (s = i.length; s--; ) {
            o != r[s] && e >= i[s] && (i[s + 1] === undefined || e < i[s + 1]) && this.activate(r[s]);
        }
    };
    t.prototype.activate = function(t) {
        this.activeTarget = t;
        this.clear();
        var n = this.selector + '[data-target="' + t + '"],' + this.selector + '[href="' + t + '"]';
        var i = e(n).parents("li").addClass("active");
        if (i.parent(".dropdown-menu").length) {
            i = i.closest("li.dropdown").addClass("active");
        }
        i.trigger("activate.bs.scrollspy");
    };
    t.prototype.clear = function() {
        e(this.selector).parentsUntil(this.options.target, ".active").removeClass("active");
    };
    function n(n) {
        return this.each(function() {
            var i = e(this);
            var r = i.data("bs.scrollspy");
            var o = typeof n == "object" && n;
            if (!r) i.data("bs.scrollspy", r = new t(this, o));
            if (typeof n == "string") r[n]();
        });
    }
    var i = e.fn.scrollspy;
    e.fn.scrollspy = n;
    e.fn.scrollspy.Constructor = t;
    e.fn.scrollspy.noConflict = function() {
        e.fn.scrollspy = i;
        return this;
    };
    e(window).on("load.bs.scrollspy.data-api", function() {
        e('[data-spy="scroll"]').each(function() {
            var t = e(this);
            n.call(t, t.data());
        });
    });
}(jQuery);

+function(e) {
    "use strict";
    var t = function(t) {
        this.element = e(t);
    };
    t.VERSION = "3.3.7";
    t.TRANSITION_DURATION = 150;
    t.prototype.show = function() {
        var t = this.element;
        var n = t.closest("ul:not(.dropdown-menu)");
        var i = t.data("target");
        if (!i) {
            i = t.attr("href");
            i = i && i.replace(/.*(?=#[^\s]*$)/, "");
        }
        if (t.parent("li").hasClass("active")) return;
        var r = n.find(".active:last a");
        var o = e.Event("hide.bs.tab", {
            relatedTarget: t[0]
        });
        var s = e.Event("show.bs.tab", {
            relatedTarget: r[0]
        });
        r.trigger(o);
        t.trigger(s);
        if (s.isDefaultPrevented() || o.isDefaultPrevented()) return;
        var a = e(i);
        this.activate(t.closest("li"), n);
        this.activate(a, a.parent(), function() {
            r.trigger({
                type: "hidden.bs.tab",
                relatedTarget: t[0]
            });
            t.trigger({
                type: "shown.bs.tab",
                relatedTarget: r[0]
            });
        });
    };
    t.prototype.activate = function(n, i, r) {
        var o = i.find("> .active");
        var s = r && e.support.transition && (o.length && o.hasClass("fade") || !!i.find("> .fade").length);
        function a() {
            o.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", false);
            n.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", true);
            if (s) {
                n[0].offsetWidth;
                n.addClass("in");
            } else {
                n.removeClass("fade");
            }
            if (n.parent(".dropdown-menu").length) {
                n.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", true);
            }
            r && r();
        }
        o.length && s ? o.one("bsTransitionEnd", a).emulateTransitionEnd(t.TRANSITION_DURATION) : a();
        o.removeClass("in");
    };
    function n(n) {
        return this.each(function() {
            var i = e(this);
            var r = i.data("bs.tab");
            if (!r) i.data("bs.tab", r = new t(this));
            if (typeof n == "string") r[n]();
        });
    }
    var i = e.fn.tab;
    e.fn.tab = n;
    e.fn.tab.Constructor = t;
    e.fn.tab.noConflict = function() {
        e.fn.tab = i;
        return this;
    };
    var r = function(t) {
        t.preventDefault();
        n.call(e(this), "show");
    };
    e(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', r).on("click.bs.tab.data-api", '[data-toggle="pill"]', r);
}(jQuery);

+function(e) {
    "use strict";
    var t = function(n, i) {
        this.options = e.extend({}, t.DEFAULTS, i);
        this.$target = e(this.options.target).on("scroll.bs.affix.data-api", e.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", e.proxy(this.checkPositionWithEventLoop, this));
        this.$element = e(n);
        this.affixed = null;
        this.unpin = null;
        this.pinnedOffset = null;
        this.checkPosition();
    };
    t.VERSION = "3.3.7";
    t.RESET = "affix affix-top affix-bottom";
    t.DEFAULTS = {
        offset: 0,
        target: window
    };
    t.prototype.getState = function(e, t, n, i) {
        var r = this.$target.scrollTop();
        var o = this.$element.offset();
        var s = this.$target.height();
        if (n != null && this.affixed == "top") return r < n ? "top" : false;
        if (this.affixed == "bottom") {
            if (n != null) return r + this.unpin <= o.top ? false : "bottom";
            return r + s <= e - i ? false : "bottom";
        }
        var a = this.affixed == null;
        var l = a ? r : o.top;
        var f = a ? s : t;
        if (n != null && r <= n) return "top";
        if (i != null && l + f >= e - i) return "bottom";
        return false;
    };
    t.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(t.RESET).addClass("affix");
        var e = this.$target.scrollTop();
        var n = this.$element.offset();
        return this.pinnedOffset = n.top - e;
    };
    t.prototype.checkPositionWithEventLoop = function() {
        setTimeout(e.proxy(this.checkPosition, this), 1);
    };
    t.prototype.checkPosition = function() {
        if (!this.$element.is(":visible")) return;
        var n = this.$element.height();
        var i = this.options.offset;
        var r = i.top;
        var o = i.bottom;
        var s = Math.max(e(document).height(), e(document.body).height());
        if (typeof i != "object") o = r = i;
        if (typeof r == "function") r = i.top(this.$element);
        if (typeof o == "function") o = i.bottom(this.$element);
        var a = this.getState(s, n, r, o);
        if (this.affixed != a) {
            if (this.unpin != null) this.$element.css("top", "");
            var l = "affix" + (a ? "-" + a : "");
            var f = e.Event(l + ".bs.affix");
            this.$element.trigger(f);
            if (f.isDefaultPrevented()) return;
            this.affixed = a;
            this.unpin = a == "bottom" ? this.getPinnedOffset() : null;
            this.$element.removeClass(t.RESET).addClass(l).trigger(l.replace("affix", "affixed") + ".bs.affix");
        }
        if (a == "bottom") {
            this.$element.offset({
                top: s - n - o
            });
        }
    };
    function n(n) {
        return this.each(function() {
            var i = e(this);
            var r = i.data("bs.affix");
            var o = typeof n == "object" && n;
            if (!r) i.data("bs.affix", r = new t(this, o));
            if (typeof n == "string") r[n]();
        });
    }
    var i = e.fn.affix;
    e.fn.affix = n;
    e.fn.affix.Constructor = t;
    e.fn.affix.noConflict = function() {
        e.fn.affix = i;
        return this;
    };
    e(window).on("load", function() {
        e('[data-spy="affix"]').each(function() {
            var t = e(this);
            var i = t.data();
            i.offset = i.offset || {};
            if (i.offsetBottom != null) i.offset.bottom = i.offsetBottom;
            if (i.offsetTop != null) i.offset.top = i.offsetTop;
            n.call(t, i);
        });
    });
}(jQuery);

(function(e) {
    "use strict";
    e.fn.sidebar = function() {
        var t = 0, n = 0, i = 0;
        if (e(".navbar-pf .navbar-toggle").is(":hidden")) {
            t = e(document).height();
            n = e(".navbar-pf").outerHeight();
            i = t - n;
        }
        e(".sidebar-pf").parent(".row").children('[class*="col-"]').css({
            "min-height": i
        });
    };
    e(document).ready(function() {
        if (e(".sidebar-pf").length > 0 && e(".datatable").length === 0) {
            e.fn.sidebar();
        }
    });
    e(window).resize(function() {
        if (e(".sidebar-pf").length > 0) {
            e.fn.sidebar();
        }
    });
})(jQuery);

(function(e) {
    "use strict";
    e.fn.popovers = function() {
        this.popover();
        this.filter("[data-close=true]").each(function(t, n) {
            var i = e(n), r = i.attr("data-original-title") + '<button type="button" class="close" aria-hidden="true"><span class="pficon pficon-close"></span></button>';
            i.attr("data-original-title", r);
        });
        this.on("click", function(t) {
            var n = e(this), i = n.next(".popover").find(".popover-title");
            i.find(".close").parent(".popover-title").addClass("closable");
            i.find(".close").on("click", function() {
                n.popover("hide");
            });
            t.preventDefault();
        });
        return this;
    };
})(jQuery);

(function(e) {
    "use strict";
    if (e.fn.dataTableExt) {
        e.extend(true, e.fn.dataTable.defaults, {
            bDestroy: true,
            bAutoWidth: false,
            iDisplayLength: 20,
            sDom: "<'dataTables_header' f i r >" + "<'table-responsive'  t >" + "<'dataTables_footer' p >",
            oLanguage: {
                sInfo: "Showing <b>_START_</b> to <b>_END_</b> of <b>_TOTAL_</b> Items",
                sInfoFiltered: "(of <b>_MAX_</b>)",
                sInfoEmpty: "Showing <b>0</b> Results",
                sZeroRecords: "<p>Suggestions</p>" + "<ul>" + "<li>Check the syntax of the search term.</li>" + "<li>Check that the correct menu option is chosen (token ID vs. user ID).</li>" + "<li>Use wildcards (* to match zero or more characters or ? to match a single character).</li>" + "<li>Clear the search field, then click Search to return to the 20 most recent records.</li>" + "</ul>",
                sSearch: ""
            },
            sPaginationType: "bootstrap_input"
        });
        e.extend(e.fn.dataTableExt.oStdClasses, {
            sWrapper: "dataTables_wrapper"
        });
        e.fn.dataTableExt.oApi.fnPagingInfo = function(e) {
            return {
                iStart: e._iDisplayStart,
                iEnd: e.fnDisplayEnd(),
                iLength: e._iDisplayLength,
                iTotal: e.fnRecordsTotal(),
                iFilteredTotal: e.fnRecordsDisplay(),
                iPage: e._iDisplayLength === -1 ? 0 : Math.ceil(e._iDisplayStart / e._iDisplayLength),
                iTotalPages: e._iDisplayLength === -1 ? 0 : Math.ceil(e.fnRecordsDisplay() / e._iDisplayLength)
            };
        };
        e.extend(e.fn.dataTableExt.oPagination, {
            bootstrap_input: {
                fnInit: function(t, n, i) {
                    var r = function(e) {
                        e.preventDefault();
                        if (t.oApi._fnPageChange(t, e.data.action)) {
                            i(t);
                        }
                    }, o, s;
                    e(n).append('<ul class="pagination">' + '  <li class="first disabled"><span class="i fa fa-angle-double-left"></span></li>' + '  <li class="prev disabled"><span class="i fa fa-angle-left"></span></li>' + "</ul>" + '<div class="pagination-input">' + '  <input type="text" class="paginate_input">' + '  <span class="paginate_of">of <b>3</b></span>' + "</div>" + '<ul class="pagination">' + '  <li class="next disabled"><span class="i fa fa-angle-right"></span></li>' + '  <li class="last disabled"><span class="i fa fa-angle-double-right"></span></li>' + "</ul>");
                    o = e("li", n);
                    e(o[0]).bind("click.DT", {
                        action: "first"
                    }, r);
                    e(o[1]).bind("click.DT", {
                        action: "previous"
                    }, r);
                    e(o[2]).bind("click.DT", {
                        action: "next"
                    }, r);
                    e(o[3]).bind("click.DT", {
                        action: "last"
                    }, r);
                    s = e("input", n);
                    e(s).keyup(function(e) {
                        if (e.which === 38 || e.which === 39) {
                            this.value += 1;
                        } else if ((e.which === 37 || e.which === 40) && this.value > 1) {
                            this.value -= 1;
                        }
                        if (this.value === "" || !this.value.match(/[0-9]/)) {
                            return;
                        }
                        var n = t._iDisplayLength * (this.value - 1);
                        if (n > t.fnRecordsDisplay()) {
                            t._iDisplayStart = (Math.ceil((t.fnRecordsDisplay() - 1) / t._iDisplayLength) - 1) * t._iDisplayLength;
                            i(t);
                            return;
                        }
                        t._iDisplayStart = n;
                        i(t);
                    });
                },
                fnUpdate: function(t, n) {
                    var i = t.oInstance.fnPagingInfo(), r = t.aanFeatures.p, o = r.length, s = Math.ceil(t.fnRecordsDisplay() / t._iDisplayLength), a = Math.ceil(t._iDisplayStart / t._iDisplayLength) + 1, l;
                    for (l = 0; l < o; l += 1) {
                        e(".paginate_input", r[l]).val(a).siblings(".paginate_of").find("b").html(s);
                        if (i.iPage === 0) {
                            e("li.first", r[l]).addClass("disabled");
                            e("li.prev", r[l]).addClass("disabled");
                        } else {
                            e("li.first", r[l]).removeClass("disabled");
                            e("li.prev", r[l]).removeClass("disabled");
                        }
                        if (i.iPage === i.iTotalPages - 1 || i.iTotalPages === 0) {
                            e("li.next", r[l]).addClass("disabled");
                            e("li.last", r[l]).addClass("disabled");
                        } else {
                            e("li.next", r[l]).removeClass("disabled");
                            e("li.last", r[l]).removeClass("disabled");
                        }
                    }
                }
            }
        });
    }
})(jQuery);

(function(e) {
    "use strict";
    e.fn.navigation = function() {
        var t = e(".layout-pf-alt-fixed .nav-pf-vertical-alt"), n = e(".container-pf-alt-nav-pf-vertical-alt"), i = e(".navbar-toggle"), r = false, o = {
            tablet: 768,
            desktop: 1024
        }, s = function() {
            var i = e(window).width();
            t.removeClass("hidden show-mobile-nav collapsed");
            n.removeClass("collapsed-nav hidden-nav");
            if (i < o.desktop || r) {
                t.addClass("collapsed");
                n.addClass("collapsed-nav");
            }
            if (i < o.tablet) {
                t.addClass("hidden");
                t.removeClass("collapsed");
                n.removeClass("collapsed-nav");
                n.addClass("hidden-nav");
            }
        }, a = function() {
            t.addClass("collapsed");
            n.addClass("collapsed-nav");
            r = true;
        }, l = function() {
            e("html").addClass("transitions");
        }, f = function() {
            t.removeClass("collapsed");
            n.removeClass("collapsed-nav");
            r = false;
        }, u = function() {
            i.on("click", function(e) {
                l();
                var i = n.hasClass("hidden-nav");
                if (i && t.hasClass("show-mobile-nav")) {
                    t.removeClass("show-mobile-nav");
                } else if (i) {
                    t.addClass("show-mobile-nav");
                } else if (t.hasClass("collapsed")) {
                    f();
                } else {
                    a();
                }
            });
        }, c = function() {
            e('.nav-pf-vertical-alt [data-toggle="tooltip"]').tooltip({
                container: "body",
                delay: {
                    show: "500",
                    hide: "200"
                }
            });
            e(".nav-pf-vertical-alt").on("show.bs.tooltip", function(t) {
                if (!e(this).hasClass("collapsed")) {
                    return false;
                }
            });
        }, d = function() {
            s();
            u();
            c();
        };
        e(window).on("resize", function() {
            s();
            l();
        });
        d();
    };
    e(document).ready(function() {
        if (e(".nav-pf-vertical-alt").length > 0) {
            e.fn.navigation();
        }
    });
})(jQuery);

(function(e) {
    "use strict";
    e.fn.countRemainingChars = function(t) {
        var n = e.extend({
            charsMaxLimit: 100,
            charsWarnRemaining: 5,
            blockInputAtMaxLimit: false
        }, t), i = this, r = e("#" + n.countFld).text(n.charsMaxLimit), o = function(e) {
            var t = n.charsMaxLimit - e;
            r.text(t);
            r.toggleClass("chars-warn-remaining-pf", t <= n.charsWarnRemaining);
            if (t < 0) {
                i.trigger("overCharsMaxLimitEvent", i.attr("id"));
            } else {
                i.trigger("underCharsMaxLimitEvent", i.attr("id"));
            }
        };
        this.on("paste", function(e) {
            setTimeout(function() {
                var e = i.val().length, t;
                if (n.blockInputAtMaxLimit && e > n.charsMaxLimit) {
                    t = i.val();
                    t = t.substring(0, n.charsMaxLimit);
                    i.val(t);
                    e = i.val().length;
                }
                o(e);
            }, 100);
        });
        this.keyup(function(e) {
            o(i.val().length);
        });
        this.keydown(function(e) {
            var t = i.val().length;
            if (n.blockInputAtMaxLimit && t >= n.charsMaxLimit) {
                if (e.keyCode !== 8) {
                    e.preventDefault();
                }
            }
        });
        return this;
    };
})(jQuery);

(function(e) {
    "use strict";
    e.pfPaletteColors = {
        black: "#030303",
        black100: "#fafafa",
        black200: "#ededed",
        black300: "#d1d1d1",
        black400: "#bbbbbb",
        black500: "#8b8d8f",
        black600: "#72767b",
        black700: "#4d5258",
        black800: "#393f44",
        black900: "#292e34",
        blue: "#0088ce",
        blue100: "#bee1f4",
        blue200: "#7dc3e8",
        blue300: "#39a5dc",
        blue400: "#0088ce",
        blue500: "#00659c",
        blue600: "#004368",
        blue700: "#002235",
        gold: "#f0ab00",
        gold100: "#fbeabc",
        gold200: "#f9d67a",
        gold300: "#f5c12e",
        gold400: "#f0ab00",
        gold500: "#b58100",
        gold600: "#795600",
        gold700: "#3d2c00",
        orange: "#ec7a08",
        orange100: "#fbdebf",
        orange200: "#f7bd7f",
        orange300: "#f39d3c",
        orange400: "#ec7a08",
        orange500: "#b35c00",
        orange600: "#773d00",
        orange700: "#3b1f00",
        lightBlue: "#00b9e4",
        lightBlue100: "#beedf9",
        lightBlue200: "#7cdbf3",
        lightBlue300: "#35caed",
        lightBlue400: "#00b9e4",
        lightBlue500: "#008bad",
        lightBlue600: "#005c73",
        lightBlue700: "#002d39",
        green: "#3f9c35",
        green100: "#cfe7cd",
        green200: "#9ecf99",
        green300: "#6ec664",
        green400: "#3f9c35",
        green500: "#2d7623",
        green600: "#1e4f18",
        green700: "#0f280d",
        lightGreen: "#92d400",
        lightGreen100: "#e4f5bc",
        lightGreen200: "#c8eb79",
        lightGreen300: "#ace12e",
        lightGreen400: "#92d400",
        lightGreen500: "#6ca100",
        lightGreen600: "#486b00",
        lightGreen700: "#253600",
        cyan: "#007a87",
        cyan100: "#bedee1",
        cyan200: "#7dbdc3",
        cyan300: "#3a9ca6",
        cyan400: "#007a87",
        cyan500: "#005c66",
        cyan600: "#003d44",
        cyan700: "#001f22",
        purple: "#703fec",
        purple100: "#c7bfff",
        purple200: "#a18fff",
        purple300: "#8461f7",
        purple400: "#703fec",
        purple500: "#582fc0",
        purple600: "#40199a",
        purple700: "#1f0066",
        red: "#cc0000",
        red100: "#cc0000",
        red200: "#a30000",
        red300: "#8b0000",
        red400: "#470000",
        red500: "#2c0000"
    };
})(jQuery);

(function(e) {
    "use strict";
    e.fn.pfSetDonutChartTitle = function(e, t, n) {
        var i = window.d3.select(e).select("text.c3-chart-arcs-title");
        i.text("");
        i.insert("tspan").text(t).classed("donut-title-big-pf", true).attr("dy", 0).attr("x", 0);
        i.insert("tspan").text(n).classed("donut-title-small-pf", true).attr("dy", 20).attr("x", 0);
    };
    e.fn.pfDonutTooltipContents = function(e, t, n, i) {
        return '<table class="c3-tooltip">' + "  <tr>" + '    <td><span style="background-color:' + i(e[0].id) + '"></span>' + "<strong>" + e[0].value + "</strong> " + e[0].name + "</td>" + "    <td>" + Math.round(e[0].ratio * 1e3) / 10 + "%</td>" + "  </tr>" + "</table>";
    };
    e.fn.pfGetUtilizationDonutTooltipContentsFn = function(e) {
        return function(t) {
            return '<span class="donut-tooltip-pf" style="white-space: nowrap;">' + Math.round(t[0].ratio * 1e3) / 10 + "%" + " " + e + " " + t[0].name + "</span>";
        };
    };
    e.fn.pfGetBarChartTooltipContentsFn = function(e) {
        return function(t) {
            var n = e ? e[t[0].index] : t[0].index;
            return '<table class="c3-tooltip">' + "  <tr>" + "    <td><strong>" + n + ":</td>" + "    <td>" + t[0].value + "</td>" + "  </tr>" + "</table>";
        };
    };
    e.fn.pfSingleLineChartTooltipContentsFn = function(e) {
        return function(t) {
            var n = e ? e[t[0].index] : t[0].index;
            return '<table class="c3-tooltip">' + "  <tr>" + "    <td><strong>" + n + ":</td>" + "    <td>" + t[0].value + "</td>" + "  </tr>" + "</table>";
        };
    };
    e.fn.pfPieTooltipContents = function(t, n, i, r) {
        return e().pfDonutTooltipContents(t, n, i, r);
    };
    e.fn.c3ChartDefaults = function() {
        var t = function() {
            return {
                pattern: [ e.pfPaletteColors.blue, e.pfPaletteColors.blue300, e.pfPaletteColors.green, e.pfPaletteColors.orange, e.pfPaletteColors.red ]
            };
        }, n = function() {
            return {
                y: {
                    show: true
                }
            };
        }, i = function(t) {
            return {
                contents: e().pfGetBarChartTooltipContentsFn(t)
            };
        }, r = function() {
            return {
                show: false
            };
        }, o = function(e) {
            return {
                color: this.getDefaultColors(),
                grid: this.getDefaultBarGrid(),
                tooltip: this.getDefaultBarTooltip(e),
                legend: this.getDefaultBarLegend()
            };
        }, s = function() {
            return {
                y: {
                    show: true
                }
            };
        }, a = function() {
            return {
                show: true,
                position: "bottom"
            };
        }, l = function() {
            return {
                color: this.getDefaultColors(),
                grid: this.getDefaultGroupedBarGrid(),
                legend: this.getDefaultGroupedBarLegend()
            };
        }, f = function(e) {
            return {
                title: e,
                label: {
                    show: false
                },
                width: 11
            };
        }, u = function() {
            return {
                height: 171
            };
        }, c = function() {
            return {
                pattern: [ e.pfPaletteColors.blue, e.pfPaletteColors.black300 ]
            };
        }, d = function() {
            return {
                show: false
            };
        }, p = function() {
            return {
                show: false
            };
        }, h = function(e) {
            return {
                donut: this.getDefaultDonut(e),
                size: this.getDefaultDonutSize(),
                legend: this.getDefaultDonutLegend(),
                color: this.getDefaultDonutColors(),
                tooltip: this.getDefaultDonutTooltip()
            };
        }, g = function() {
            return {
                expand: true,
                label: {
                    show: false
                }
            };
        }, v = function() {
            return {
                height: 171
            };
        }, m = function() {
            return {
                pattern: [ e.pfPaletteColors.blue, e.pfPaletteColors.black300 ]
            };
        }, y = function() {
            return {
                contents: e().pfPieTooltipContents
            };
        }, b = function() {
            return {
                show: false
            };
        }, w = function() {
            return {
                pie: this.getDefaultPie(),
                size: this.getDefaultPieSize(),
                legend: this.getDefaultPieLegend(),
                color: this.getDefaultPieColors(),
                tooltip: this.getDefaultPieTooltip()
            };
        }, x = function() {
            return {
                zerobased: true
            };
        }, C = function() {
            return {
                height: 60
            };
        }, T = function() {
            return {
                x: {
                    show: false
                },
                y: {
                    show: false
                }
            };
        }, D = function() {
            return {
                show: false
            };
        }, k = function() {
            return {
                r: 1,
                focus: {
                    expand: {
                        r: 4
                    }
                }
            };
        }, E = function() {
            return {
                contents: function(e) {
                    return '<span class="c3-tooltip-sparkline">' + e[0].value + " " + e[0].name + "</span>";
                }
            };
        }, S = function() {
            return {
                area: x(),
                size: C(),
                axis: T(),
                color: t(),
                legend: D(),
                point: k(),
                tooltip: E()
            };
        }, $ = function() {
            return {
                x: {
                    show: true
                },
                y: {
                    show: true
                }
            };
        }, N = function() {
            return {
                x: {
                    show: false
                },
                y: {
                    show: true
                }
            };
        }, A = function() {
            return {
                show: true
            };
        }, j = function() {
            return {
                r: 3,
                focus: {
                    expand: {
                        r: 5
                    }
                }
            };
        }, L = function() {
            return {
                axis: $(),
                grid: N(),
                color: t(),
                legend: A(),
                point: j()
            };
        }, I = function() {
            return {
                contents: e().pfGetBarChartTooltipContentsFn()
            };
        }, O = function() {
            return {
                show: false
            };
        }, P = function() {
            return {
                axis: $(),
                grid: N(),
                color: t(),
                legend: O(),
                point: j(),
                tooltip: I()
            };
        }, R = function() {
            return $();
        }, H = function() {
            return N();
        }, F = function() {
            return A();
        }, q = function() {
            return j();
        }, M = function() {
            return {
                axis: R(),
                grid: H(),
                color: t(),
                legend: F(),
                point: q()
            };
        }, _ = function() {
            return {
                contents: e().pfGetBarChartTooltipContentsFn()
            };
        }, B = function() {
            return O();
        }, W = function() {
            return {
                axis: R(),
                grid: H(),
                color: t(),
                legend: B(),
                point: q(),
                tooltip: _()
            };
        };
        return {
            getDefaultColors: t,
            getDefaultBarGrid: n,
            getDefaultBarTooltip: i,
            getDefaultBarLegend: r,
            getDefaultBarConfig: o,
            getDefaultGroupedBarGrid: s,
            getDefaultGroupedBarLegend: a,
            getDefaultGroupedBarConfig: l,
            getDefaultDonut: f,
            getDefaultDonutSize: u,
            getDefaultDonutColors: c,
            getDefaultDonutTooltip: d,
            getDefaultDonutLegend: p,
            getDefaultDonutConfig: h,
            getDefaultPie: g,
            getDefaultPieSize: v,
            getDefaultPieColors: m,
            getDefaultPieTooltip: y,
            getDefaultPieLegend: b,
            getDefaultPieConfig: w,
            getDefaultSparklineArea: x,
            getDefaultSparklineSize: C,
            getDefaultSparklineAxis: T,
            getDefaultSparklineLegend: D,
            getDefaultSparklinePoint: k,
            getDefaultSparklineTooltip: E,
            getDefaultSparklineConfig: S,
            getDefaultLineAxis: $,
            getDefaultLineGrid: N,
            getDefaultLineLegend: A,
            getDefaultLinePoint: j,
            getDefaultLineConfig: L,
            getDefaultSingleLineTooltip: I,
            getDefaultSingleLineConfig: P,
            getDefaultAreaAxis: R,
            getDefaultAreaGrid: H,
            getDefaultAreaLegend: F,
            getDefaultAreaPoint: q,
            getDefaultAreaConfig: M,
            getDefaultSingleAreaTooltip: _,
            getDefaultSingleAreaConfig: W
        };
    };
})(jQuery);

(function(e) {
    "use strict";
    e.fn.initCollapseHeights = function() {
        var t = this, n;
        n = function() {
            var n, i, r, o, s = "hidden";
            n = t.height();
            i = t.find(".collapse.in");
            if (i && i.length > 0) {
                i.removeClass("in");
            }
            r = 0;
            t.children().each(e.proxy(function(t, n) {
                var i = e(n);
                r += i.outerHeight(true);
            }, t)).end();
            o = n - r;
            if (o < 25) {
                o = 25;
                s = "auto";
            }
            t.find('[data-toggle="collapse"]').each(e.proxy(function(t, n) {
                var i, r, s;
                i = e(n);
                r = i.attr("data-target");
                if (!r) {
                    r = i.attr("href");
                }
                s = e(r);
                s.css({
                    "max-height": o + "px",
                    "overflow-y": "auto"
                });
            }, t)).end();
            if (i && i.length > 0) {
                i.addClass("in");
            }
            t.css({
                "overflow-y": s
            });
        };
        n();
        e(window).resize(n);
    };
})(jQuery);

(function(e) {
    "use strict";
    function t(t, n) {
        var i = n.attr("data-parent");
        if (typeof i === "string") {
            if (isNaN(i)) {
                i = t.closest(i);
            } else {
                i = e(t[parseInt(i, 10)]);
            }
            return i;
        }
    }
    function n(e, t) {
        if (t) {
            t.find(".treegrid-node > span.expand-icon").toggleClass("fa-angle-right", t.hasClass("collapsed")).toggleClass("fa-angle-down", !t.hasClass("collapsed"));
            e.toggleClass("hidden", t.hasClass("collapsed"));
            if (t.hasClass("collapsed")) {
                e.addClass("collapsed");
            }
        }
    }
    function i(e) {
        e.find("tbody > tr").removeClass("odd");
        e.find("tbody > tr:not(.hidden):odd").addClass("odd");
    }
    e.fn.treegrid = function(r) {
        var o, s, a;
        s = this.find("tbody > tr");
        a = this;
        e.each(s, function() {
            var l, f;
            l = e(this);
            f = t(s, l);
            l.children(".treegrid-node").prepend('<span class="icon expand-icon fa"/>');
            l.children(".treegrid-node").on("click", function(o) {
                if (r && typeof r.callback === "function") {
                    r.callback(o);
                }
                var f = l.find("span.expand-icon");
                if (f.hasClass("fa-angle-right")) {
                    l.removeClass("collapsed");
                }
                if (f.hasClass("fa-angle-down")) {
                    l.addClass("collapsed");
                }
                e.each(s.slice(s.index(l) + 1), function() {
                    n(e(this), t(s, e(this)));
                });
                i(a);
            });
            if (f) {
                o = f.find(".treegrid-node > span.indent").length + 1;
                for (o; o > 0; o -= 1) {
                    l.children(".treegrid-node").prepend('<span class="indent"/>');
                }
                n(l, f);
            }
        });
        i(a);
    };
})(jQuery);

(function(e) {
    "use strict";
    e.fn.setupVerticalNavigation = function(t) {
        var n = e(".nav-pf-vertical"), i = e(".container-pf-nav-pf-vertical"), r = e(".navbar-toggle"), o = false, s = false, a = {
            tablet: 768,
            desktop: 1200
        }, l = function() {
            return i.hasClass("hidden-nav");
        }, f = function() {
            setTimeout(function() {
                if (window.dispatchEvent) {
                    window.dispatchEvent(new Event("resize"));
                }
                if (e(document).fireEvent) {
                    e(document).fireEvent("onresize");
                }
            }, 100);
        }, u = function() {
            if (l() || !s) {
                n.addClass("secondary-visible-pf");
                i.addClass("secondary-visible-pf");
            }
            if (!s) {
                f();
            }
        }, c = function() {
            n.removeClass("secondary-visible-pf");
            i.removeClass("secondary-visible-pf");
            n.find(".mobile-nav-item-pf").each(function(t, n) {
                e(n).removeClass("mobile-nav-item-pf");
            });
        }, d = function(e) {
            if (e.find(".nav-pf-persistent-secondary").length > 0) {
                u();
            } else {
                c();
                n.removeClass("show-mobile-nav");
            }
        }, p = function(t) {
            e(document).find(".nav-pf-vertical > .list-group > .list-group-item").each(function(t, n) {
                if (e(n).hasClass("active")) {
                    e(n).removeClass("active");
                }
            });
            if (!t.hasClass("active")) {
                t.addClass("active");
            }
        }, h = function(t, n) {
            var i = e(document).find('[data-target="#' + t.attr("id") + '"]');
            t.find(".list-group > .list-group-item").each(function(t, n) {
                e(n).removeClass("active");
            });
            n.addClass("active");
            p(e(i));
        }, g = function() {
            if (l()) {
                n.removeClass("show-mobile-nav");
                c();
                n.find(".mobile-nav-item-pf").each(function(t, n) {
                    e(n).removeClass("mobile-nav-item-pf");
                });
            } else {
                u();
            }
        }, v = function(t, r) {
            if (t) {
                r.addClass("collapsed");
                n.addClass("collapsed-secondary-nav-pf");
                i.addClass("collapsed-secondary-nav-pf");
            } else {
                if (r) {
                    r.removeClass("collapsed");
                } else {
                    n.find('[data-toggle="collapse-secondary-nav"]').each(function(t, n) {
                        var i = e(n);
                        i.removeClass("collapsed");
                    });
                }
                n.removeClass("collapsed-secondary-nav-pf");
                i.removeClass("collapsed-secondary-nav-pf");
            }
        }, m = function() {
            var t = e(window).width(), r;
            if (t < a.tablet) {
                if (!n.hasClass("hidden")) {
                    n.addClass("hidden");
                    n.removeClass("collapsed");
                    i.removeClass("collapsed-nav");
                    i.addClass("hidden-nav");
                    v(false);
                    o = false;
                }
            } else if (n.hasClass("hidden")) {
                n.removeClass("hidden show-mobile-nav");
                i.removeClass("hidden-nav");
            }
            if (t < a.desktop) {
                if (!s) {
                    n.addClass("collapsed");
                    i.addClass("collapsed-nav");
                }
                if (t >= a.tablet) {
                    c();
                }
                s = true;
            } else {
                r = s && n.find(".persistent-secondary.active").length > 0;
                s = false;
                if (r) {
                    u();
                }
            }
            if (o) {
                n.addClass("collapsed");
                i.addClass("collapsed-nav");
            } else {
                n.removeClass("collapsed");
                i.removeClass("collapsed-nav");
            }
        }, y = function() {
            n.addClass("collapsed");
            i.addClass("collapsed-nav");
            if (s) {
                c();
            }
            o = true;
        }, b = function() {
            e("html").addClass("transitions");
        }, w = function() {
            n.removeClass("collapsed");
            i.removeClass("collapsed-nav");
            o = false;
            if (!s) {
                f();
            }
        }, x = function() {
            r.on("click", function(e) {
                b();
                if (l()) {
                    if (n.hasClass("show-mobile-nav")) {
                        n.removeClass("show-mobile-nav");
                    } else {
                        c();
                        n.addClass("show-mobile-nav");
                    }
                } else if (n.hasClass("collapsed")) {
                    w();
                } else {
                    y();
                }
            });
        }, C = function() {
            n.addClass("force-hide-secondary-nav-pf");
            setTimeout(function() {
                n.removeClass("force-hide-secondary-nav-pf");
            }, 500);
        }, T = function(t) {
            e(document).on("click.pf.secondarynav.data-api", ".nav-pf-vertical > .list-group > .list-group-item", function(n) {
                var i = e(this);
                d(i);
                if (l()) {
                    if (i.find(".nav-pf-persistent-secondary").length > 0) {
                        i.addClass("mobile-nav-item-pf");
                    } else if (t) {
                        p(i);
                    }
                } else if (t) {
                    p(i);
                }
            });
            e(document).find(".nav-pf-persistent-secondary").each(function(i, r) {
                var o = e(r);
                if (t) {
                    o.on("click.pf.secondarynav.data-api", function(e) {
                        e.stopImmediatePropagation();
                    });
                }
                o.on("click.pf.secondarynav.data-api", ".list-group > .list-group-item", function(n) {
                    g();
                    if (t) {
                        h(o, e(this));
                        n.stopImmediatePropagation();
                    }
                });
                o.on("click.pf.secondarynav.data-api", '[data-toggle="collapse-secondary-nav"]', function(i) {
                    var r = e(this);
                    if (l()) {
                        c();
                        C();
                    } else {
                        if (r.hasClass("collapsed")) {
                            v(false, r);
                            if (e(window).width() < a.desktop) {
                                C();
                            }
                        } else {
                            if (r.parents(".persistent-secondary.active").length > 0) {
                                v(true, r);
                            } else {
                                C();
                            }
                        }
                    }
                    n.removeClass("hover-secondary-nav-pf");
                    if (t) {
                        i.stopImmediatePropagation();
                    }
                });
            });
            e(document).on("mouseover.pf.secondarynav.data-api", ".persistent-secondary", function(e) {
                if (!l()) {
                    n.addClass("hover-secondary-nav-pf");
                }
            });
            e(document).on("mouseout.pf.secondarynav.data-api", ".persistent-secondary", function(e) {
                n.removeClass("hover-secondary-nav-pf");
            });
        }, D = function() {
            e('.nav-pf-vertical [data-toggle="tooltip"]').tooltip({
                container: "body",
                delay: {
                    show: "500",
                    hide: "200"
                }
            });
            e(".nav-pf-vertical").on("show.bs.tooltip", function(t) {
                if (!e(this).hasClass("collapsed")) {
                    return false;
                }
            });
        }, k = function(e) {
            m();
            x();
            T(e);
            D();
        };
        e(window).on("resize", function() {
            m();
            b();
        });
        k(t);
    };
})(jQuery);
//# sourceMappingURL=jquery.min.js.map
