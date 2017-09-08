var url_root;

try {
    url_root = window.localStorage.getItem("url-root");
} catch (e) {}

var mock = mock || {};

var phantom_checkpoint = phantom_checkpoint || function() {};

(function() {
    "use strict";
    var e = {};
    O(e, {});
    if (typeof window.debugging === "undefined") {
        try {
            window.debugging = window.sessionStorage["debugging"] || window.localStorage["debugging"];
        } catch (n) {}
    }
    function t(e, n) {
        var t = e.length;
        for (var r = 0; r < t; r++) {
            if (n === e[r]) return true;
        }
        return false;
    }
    function r(e) {
        return Object.prototype.toString.call(e) === "[object Array]";
    }
    function i(e) {
        return typeof e === "function";
    }
    function o(e) {
        return e !== null && typeof e === "object";
    }
    function a(e) {
        return o(e) && Object.prototype.toString.call(e) === "[object Object]";
    }
    function s(e) {
        return ((e = +e) || 1 / e) < 0;
    }
    function f(e) {
        var n, t, r, i;
        for (n = 1, t = arguments.length; n < t; n++) {
            i = arguments[n];
            if (i) {
                for (r in i) {
                    if (i[r] !== undefined) e[r] = i[r];
                }
            }
        }
        return e;
    }
    function l(e, n, t) {
        var r = e ? e.length : 0;
        for (var i = 0; i < r; i++) {
            if (e[i]) e[i].apply(n, t);
        }
    }
    var u = null;
    var c = null;
    var d = false;
    var v = false;
    var p = null;
    var h = null;
    var m = null;
    var g = null;
    var w = null;
    var b = window.location.origin;
    if (!b) {
        b = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
    }
    function y(e, n) {
        var t = e.length;
        var r = new (n || Array)(t);
        for (var i = 0; i < t; i++) r[i] = e.charCodeAt(i) & 255;
        return r;
    }
    function k(e) {
        var n = e.length, t = "";
        for (var r = 0; r < n; r++) t += String.fromCharCode(e[r]);
        return t;
    }
    function E(e) {
        return e < 26 ? e + 65 : e < 52 ? e + 71 : e < 62 ? e - 4 : e === 62 ? 43 : e === 63 ? 47 : 65;
    }
    function _(e) {
        if (typeof e === "string") return window.btoa(e);
        if (e instanceof window.ArrayBuffer) e = new window.Uint8Array(e);
        var n = e.length, t = 2, r = "";
        for (var i = 0, o = 0; o < n; o++) {
            t = o % 3;
            i |= e[o] << (16 >>> t & 24);
            if (t === 2 || n - o === 1) {
                r += String.fromCharCode(E(i >>> 18 & 63), E(i >>> 12 & 63), E(i >>> 6 & 63), E(i & 63));
                i = 0;
            }
        }
        return r.substr(0, r.length - 2 + t) + (t === 2 ? "" : t === 1 ? "=" : "==");
    }
    function S(e) {
        return e > 64 && e < 91 ? e - 65 : e > 96 && e < 123 ? e - 71 : e > 47 && e < 58 ? e + 4 : e === 43 ? 62 : e === 47 ? 63 : 0;
    }
    function x(e, n) {
        if (n === String) return window.atob(e);
        var t = e.length;
        for (var r = 0; r < 3; r++) {
            if (e[t - (r + 1)] != "=") break;
        }
        var i = (t * 3 + 1 >> 2) - r;
        var o = new (n || Array)(i);
        for (var a, s, f = 0, l = 0, u = 0; u < t; u++) {
            s = u & 3;
            f |= S(e.charCodeAt(u)) << 18 - 6 * s;
            if (s === 3 || t - u === 1) {
                for (a = 0; a < 3 && l < i; a++, l++) o[l] = f >>> (16 >>> a & 24) & 255;
                f = 0;
            }
        }
        return o;
    }
    window.addEventListener("beforeunload", function() {
        v = true;
    }, false);
    function j() {
        if (window.debugging == "all" || window.debugging == "channel") console.debug.apply(console, arguments);
    }
    function O(e, n) {
        Object.defineProperties(e, {
            addEventListener: {
                enumerable: false,
                value: function t(e, r) {
                    if (n[e] === undefined) n[e] = [];
                    n[e].push(r);
                }
            },
            removeEventListener: {
                enumerable: false,
                value: function r(e, t) {
                    var r = n[e] ? n[e].length : 0;
                    for (var i = 0; i < r; i++) {
                        if (n[e][i] === t) {
                            n[e][i] = null;
                            break;
                        }
                    }
                }
            },
            dispatchEvent: {
                enumerable: false,
                value: function o(t) {
                    var r, o;
                    if (typeof t === "string") {
                        r = t;
                        o = Array.prototype.slice.call(arguments, 1);
                        t = document.createEvent("CustomEvent");
                        if (arguments.length == 2) t.initCustomEvent(r, false, false, arguments[1]); else if (arguments.length > 2) t.initCustomEvent(r, false, false, o); else t.initCustomEvent(r, false, false, null);
                        o.unshift(t);
                    } else {
                        r = t.type;
                        o = arguments;
                    }
                    if (i(e["on" + r])) e["on" + r].apply(e, o);
                    l(n[r], e, o);
                }
            }
        });
    }
    function L() {
        var e = window.location.pathname || "/";
        var n = url_root;
        if (window.mock && window.mock.pathname) e = window.mock.pathname;
        if (window.mock && window.mock.url_root) n = window.mock.url_root;
        if (n && e.indexOf("/" + n) === 0) e = e.replace("/" + n, "") || "/";
        if (e.indexOf("/cockpit/") !== 0 && e.indexOf("/cockpit+") !== 0) {
            if (e.indexOf("/=") === 0) e = "/cockpit+" + e.split("/")[1]; else e = "/cockpit";
        }
        return e.split("/")[1];
    }
    function C(e) {
        if (!e) e = "socket";
        var n = window.location.toString();
        var t = url_root;
        if (window.mock && window.mock.url) return window.mock.url;
        if (window.mock && window.mock.url_root) t = window.mock.url_root;
        var r = L();
        if (t) r = t + "/" + r;
        if (n.indexOf("http:") === 0) {
            return "ws://" + window.location.host + "/" + r + "/" + e;
        } else if (n.indexOf("https:") === 0) {
            return "wss://" + window.location.host + "/" + r + "/" + e;
        } else {
            j("Cockpit must be used over http or https");
            return null;
        }
    }
    function I(e, n) {
        if (!n) return e.join("");
        var t;
        var r, i, o = 0;
        var a, s = e.length;
        for (a = 0; a < s; a++) o += e[a].length;
        if (window.Uint8Array) t = new window.Uint8Array(o); else t = new Array(o);
        if (t.set) {
            for (r = 0, a = 0; a < s; a++) {
                t.set(e[a], r);
                r += e[a].length;
            }
        } else {
            for (r = 0, a = 0; a < s; a++) {
                for (i = 0; i < e[a].length; i++) t[a + r] = e[a][i];
                r += e[a].length;
            }
        }
        return t;
    }
    function A(e) {
        var n = this;
        n.readyState = 0;
        window.addEventListener("message", function t(r) {
            if (r.origin !== b || r.source !== e) return;
            var i = r.data;
            if (i === undefined || i.length === undefined && i.byteLength === undefined) return;
            if (i.length === 0) {
                n.readyState = 3;
                n.onclose();
            } else {
                n.onmessage(r);
            }
        }, false);
        n.send = function r(n) {
            e.postMessage(n, b);
        };
        n.close = function i() {
            n.readyState = 3;
            e.postMessage("", b);
            n.onclose();
        };
        window.setTimeout(function() {
            n.readyState = 1;
            n.onopen();
        }, 0);
    }
    function B(e) {
        var n, t, r, i;
        if (e instanceof window.ArrayBuffer) {
            n = new window.Uint8Array(e);
            t = n.length;
            for (r = 0; r < t; r++) {
                if (n[r] == 10) break;
            }
            if (r === t) {
                console.warn("binary message without channel");
                return null;
            } else if (r === 0) {
                console.warn("binary control message");
                return null;
            } else {
                i = String.fromCharCode.apply(null, n.subarray(0, r));
            }
        } else {
            r = e.indexOf("\n");
            if (r === -1) {
                console.warn("text message without channel");
                return null;
            }
            i = e.substring(0, r);
        }
        return i;
    }
    function M() {
        var e = this;
        e.application = L();
        O(e, {});
        var n = 0;
        var t = "";
        if (window.mock) window.mock.last_transport = e;
        var i;
        var o;
        var a = false;
        var s = false;
        if (window.parent !== window && window.name.indexOf("cockpit1:") === 0) i = new A(window.parent);
        try {
            if (!i && window.parent !== window && window.parent.options && window.parent.options.protocol == "cockpit1") {
                i = new A(window.parent);
            }
        } catch (f) {}
        if (!i) {
            var l = C();
            j("connecting to " + l);
            if (l) {
                if ("WebSocket" in window) {
                    i = new window.WebSocket(l, "cockpit1");
                } else if ("MozWebSocket" in window) {
                    i = new window.MozWebSocket(l);
                } else {
                    console.error("WebSocket not supported, application will not work!");
                }
            }
            o = window.setInterval(function() {
                if (!s) {
                    if (a) {
                        console.log("health check failure ignored");
                    } else {
                        console.log("health check failed");
                        e.close({
                            problem: "timeout"
                        });
                    }
                }
                s = false;
            }, 3e4);
        }
        if (!i) {
            i = {
                close: function() {}
            };
            window.setTimeout(function() {
                e.close({
                    problem: "no-cockpit"
                });
            }, 50);
        }
        var u = {};
        var b = {};
        var k = true;
        e.ready = false;
        function E() {
            if (!e.ready) {
                e.ready = true;
                e.dispatchEvent("ready");
            }
        }
        i.onopen = function() {
            if (i) {
                if (typeof i.binaryType !== "undefined") i.binaryType = "arraybuffer";
                i.send('\n{ "command": "init", "version": 1 }');
            }
        };
        i.onclose = function() {
            j("WebSocket onclose");
            i = null;
            if (d) {
                v = true;
                window.location.reload(true);
            }
            e.close();
        };
        i.onmessage = e.dispatch_data = function(e) {
            s = true;
            var n = e.data;
            var t = B(n);
            if (t === null) return false;
            var r, i;
            if (n instanceof window.ArrayBuffer) r = new window.Uint8Array(n, t.length + 1); else r = n.substring(t.length + 1);
            if (!t) {
                j("recv control:", r);
                i = JSON.parse(r);
            } else {
                j("recv " + t + ":", r);
            }
            var o, a = g ? g.length : 0;
            for (o = 0; o < a; o++) {
                if (g[o](n, t, i) === false) return false;
            }
            if (!t) S(i); else x(t, r);
            phantom_checkpoint();
            return true;
        };
        e.close = function M(e) {
            if (!e) e = {
                problem: "disconnected"
            };
            e.command = "close";
            window.clearInterval(o);
            var n = i;
            i = null;
            if (n) n.close();
            if (v) return;
            E();
            for (var t in u) u[t].apply(null, [ e ]);
        };
        e.next_channel = function N() {
            n++;
            return t + String(n);
        };
        function _(n) {
            if (n.problem) {
                e.close({
                    problem: n.problem
                });
                return;
            }
            if (n.version !== 1) {
                console.error("received unsupported version in init message: " + n.version);
                e.close({
                    problem: "not-supported"
                });
                return;
            }
            if (n["channel-seed"]) t = String(n["channel-seed"]);
            if (n["host"]) h = n["host"];
            if (c) {
                c.options = n;
                c.csrf_token = n["csrf-token"];
                c.host = h;
            }
            if (p) p(n);
            if (k) {
                k = false;
                E();
            }
        }
        function S(n) {
            var t = n.channel;
            var r;
            if (n.command == "init") {
                _(n);
            } else if (k) {
                k = false;
                if (n.command != "close" || t) {
                    console.error("received message before init: ", n.command);
                    n = {
                        problem: "protocol-error"
                    };
                }
                e.close(n);
            } else if (n.command == "ping") {} else if (n.command == "hint") {
                if (m) m(n);
            } else if (t !== undefined) {
                r = u[t];
                if (r) r.apply(null, [ n ]);
            }
        }
        function x(e, n) {
            var t = b[e];
            if (t) t.apply(null, [ n ]);
        }
        e.send_data = function U(e, n, t) {
            if (!i) {
                console.log("transport closed, dropped message: ", e);
                return false;
            }
            var r, o = w ? w.length : 0;
            for (r = 0; r < o; r++) {
                if (n === undefined) n = B(e);
                if (!n && t === undefined) t = JSON.parse(e);
                if (w[r](e, n, t) === false) return false;
            }
            i.send(e);
            return true;
        };
        e.send_message = function J(n, t, i) {
            if (t) j("send " + t, n); else j("send control:", n);
            if (n.byteLength || r(n)) {
                if (n instanceof window.ArrayBuffer) n = new window.Uint8Array(n);
                var o = I([ y(t), [ 10 ], n ], true);
                return e.send_data(o.buffer, t, i);
            } else {
                return e.send_data(t.toString() + "\n" + n, t, i);
            }
        };
        e.send_control = function P(n) {
            if (!i && (n.command == "close" || n.command == "kill")) return;
            if (o && n.command == "hint" && n.hint == "ignore_transport_health_check") {
                a = n.data;
                return;
            }
            e.send_message(JSON.stringify(n), "", n);
        };
        e.register = function T(e, n, t) {
            u[e] = n;
            b[e] = t;
        };
        e.unregister = function D(e) {
            delete u[e];
            delete b[e];
        };
    }
    function N(e) {
        var n;
        if (!u) u = new M();
        n = u;
        if (n.ready) {
            e(n);
        } else {
            n.addEventListener("ready", function() {
                e(n);
            });
        }
    }
    window.addEventListener("unload", function() {
        if (u) u.close();
    });
    function U(n) {
        var t = this;
        O(t, {});
        var r;
        var i = null;
        var o = null;
        var a = null;
        var s = false;
        var f = false;
        var l = null;
        var u = n.binary === true;
        var c = [];
        t.valid = true;
        t.options = n;
        t.binary = u;
        t.id = l;
        function d(e) {
            if (s) {
                console.warn("received message after done");
                t.close("protocol-error");
            } else {
                t.dispatchEvent("message", e);
            }
        }
        function v(e) {
            o = e;
            t.valid = false;
            if (r && l) r.unregister(l);
            if (o.message) console.warn(o.message);
            t.dispatchEvent("close", o);
            if (a) a.resolve(o);
        }
        function p(e) {
            i = e;
            t.dispatchEvent("ready", i);
        }
        function m(e) {
            if (e.command == "close") {
                v(e);
                return;
            } else if (e.command == "ready") {
                p(e);
            }
            var n = e.command === "done";
            if (n && s) {
                console.warn("received two done commands on channel");
                t.close("protocol-error");
            } else {
                if (n) s = true;
                t.dispatchEvent("control", e);
            }
        }
        function g(e) {
            if (!u) {
                if (typeof e !== "string") e = String(e);
            }
            r.send_message(e, l);
        }
        N(function(e) {
            r = e;
            if (o) return;
            l = r.next_channel();
            t.id = l;
            r.register(l, m, d);
            var i = {};
            for (var a in n) i[a] = n[a];
            i.command = "open";
            i.channel = l;
            if (!i.host) {
                if (h) i.host = h;
            }
            if (u) i.binary = "raw"; else delete i.binary;
            r.send_control(i);
            while (c.length > 0) {
                var s = c.shift();
                if (s[0]) {
                    s[1]["channel"] = l;
                    r.send_control(s[1]);
                } else {
                    g(s[1]);
                }
            }
        });
        t.send = function w(e) {
            if (o) console.warn("sending message on closed channel"); else if (f) console.warn("sending message after done"); else if (!r) c.push([ false, e ]); else g(e);
        };
        t.control = function b(e) {
            e = e || {};
            if (!e.command) e.command = "options";
            if (e.command === "done") f = true;
            e.channel = l;
            if (!r) c.push([ true, e ]); else r.send_control(e);
        };
        t.wait = function y(n) {
            if (!a) {
                a = e.defer();
                if (o) {
                    a.reject(o);
                } else if (i) {
                    a.resolve(i);
                } else {
                    t.addEventListener("ready", function(e, n) {
                        a.resolve(n);
                    });
                    t.addEventListener("close", function(e, n) {
                        a.reject(n);
                    });
                }
            }
            var r = a.promise;
            if (n) r.then(n, n);
            return r;
        };
        t.close = function k(e) {
            if (o) return;
            if (!e) e = {}; else if (typeof e == "string") e = {
                problem: e
            };
            e["command"] = "close";
            e["channel"] = l;
            if (!r) c.push([ true, e ]); else r.send_control(e);
            v(e);
        };
        t.buffer = function E(e) {
            var n = [];
            n.callback = e;
            n.squash = function o() {
                return I(n, u);
            };
            function r(e, r) {
                var i, o;
                n.push(r);
                if (n.callback) {
                    o = I(n, u);
                    if (o.length > 0) {
                        i = n.callback.call(t, o);
                        if (typeof i !== "number" || i === o.length) {
                            n.length = 0;
                        } else if (i === 0) {
                            n.length = 1;
                            n[0] = o;
                        } else if (i !== 0) {
                            n.length = 1;
                            if (o.subarray) n[0] = o.subarray(i); else if (o.substring) n[0] = o.substring(i); else n[0] = o.slice(i);
                        }
                    }
                }
            }
            function i() {
                t.removeEventListener("message", r);
                t.removeEventListener("close", i);
            }
            t.addEventListener("message", r);
            t.addEventListener("close", i);
            return n;
        };
        t.toString = function _() {
            var e = n["host"] || "localhost";
            return "[Channel " + (t.valid ? l : "<invalid>") + " -> " + e + "]";
        };
    }
    function J(e) {
        var n = [];
        var t = e.length;
        for (var r = 0; r < t; r++) {
            var i = e[r];
            if (i === "" || i == ".") {
                continue;
            } else if (i == "..") {
                if (n.length === 0) return null;
                n.pop();
            } else {
                n.push(i);
            }
        }
        return n;
    }
    function P() {
        e.channel = function Ce(e) {
            return new U(e);
        };
        e.event_target = function Ie(e) {
            O(e, {});
            return e;
        };
        e.extend = f;
        e.manifests = {};
        function n(e) {
            var n = this;
            n.encoding = "utf-8";
            n.encode = function t(n, r) {
                var i = window.unescape(encodeURIComponent(n));
                if (e === String) return i;
                return y(i, e);
            };
        }
        function v(e) {
            var n = this;
            var t = null;
            n.encoding = "utf-8";
            n.decode = function r(n, i) {
                var o = i && i.stream;
                if (n === null || n === undefined) n = "";
                if (typeof n !== "string") n = k(n);
                if (t) {
                    n = t + n;
                    t = null;
                }
                var a = 0, s = 0, f = n.length;
                var l, u, c, d;
                var v = "";
                while (s < f) {
                    l = n.charCodeAt(s);
                    u = l == 255 ? 0 : l > 251 && l < 254 ? 6 : l > 247 && l < 252 ? 5 : l > 239 && l < 248 ? 4 : l > 223 && l < 240 ? 3 : l > 191 && l < 224 ? 2 : l < 128 ? 1 : 0;
                    d = s + u <= f;
                    if (!d && o) {
                        t = n.substring(s);
                        break;
                    }
                    if (u === 0) d = false;
                    for (c = 1; d && c < u; c++) d = (n.charCodeAt(s + c) & 128) !== 0;
                    if (!d) {
                        if (e) {
                            s = f;
                            break;
                        }
                        v += decodeURIComponent(window.escape(n.substring(a, s)));
                        v += "�";
                        s++;
                        a = s;
                    } else {
                        s += u;
                    }
                }
                v += decodeURIComponent(window.escape(n.substring(a, s)));
                return v;
            };
        }
        e.utf8_encoder = function Ae(e) {
            return new n(e);
        };
        e.utf8_decoder = function Be(e) {
            return new v((!!e));
        };
        e.base64_encode = _;
        e.base64_decode = x;
        e.kill = function Me(n, t) {
            var r = {};
            if (n) r.host = n;
            if (t) r.group = t;
            e.transport.control("kill", r);
        };
        e.hint = function Ne(n, t) {
            if (!u) return;
            if (!t) t = h;
            if (typeof t == "string") t = {
                host: t
            };
            t["hint"] = n;
            e.transport.control("hint", t);
        };
        e.transport = c = {
            wait: N,
            inject: function Ue(e, n) {
                if (!u) return false;
                if (n === undefined || n) return u.send_data(e); else return u.dispatch_data({
                    data: e
                });
            },
            filter: function Je(e, n) {
                if (n) {
                    if (!w) w = [];
                    w.push(e);
                } else {
                    if (!g) g = [];
                    g.push(e);
                }
            },
            close: function Pe(e) {
                var n;
                if (e) n = {
                    problem: e
                };
                if (u) u.close(n);
                u = null;
                this.options = {};
            },
            origin: b,
            options: {},
            uri: C,
            control: function(e, n) {
                n = f({}, n);
                n["command"] = e;
                N(function(e) {
                    e.send_control(n);
                });
            },
            application: function() {
                if (!u || window.mock) return L();
                return u.application;
            }
        };
        var E = [];
        var S = null;
        function j() {
            var e, n = E;
            S = null;
            E = [];
            for (;;) {
                e = n.shift();
                if (!e) break;
                e();
            }
        }
        function A(e) {
            if (e) E.push(e);
            if (S === null) S = window.setTimeout(j, 0);
        }
        function B(e, n, t, r) {
            if (n === undefined && t === undefined && r === undefined) return null;
            var i = new $();
            e.pending = e.pending || [];
            e.pending.push([ i, n, t, r ]);
            if (e.status > 0) T(e);
            return i.promise;
        }
        function M(e) {
            var n = function t(e) {
                if (e) {
                    f(e, n);
                    return e;
                }
                return n;
            };
            e.status = 0;
            n.then = function r(t, i, o) {
                return B(e, t, i, o) || n;
            };
            n["catch"] = function i(t) {
                return B(e, null, t) || n;
            };
            n["finally"] = function o(t, r) {
                return B(e, function() {
                    return H(arguments, true, t);
                }, function() {
                    return H(arguments, false, t);
                }, r) || n;
            };
            n.done = function a(t) {
                B(e, t);
                return n;
            };
            n.fail = function s(t) {
                B(e, null, t);
                return n;
            };
            n.always = function l(t) {
                B(e, t, t);
                return n;
            };
            n.progress = function u(t) {
                B(e, null, null, t);
                return n;
            };
            n.state = function c() {
                if (e.status == 1) return "resolved";
                if (e.status == 2) return "rejected";
                return "pending";
            };
            n.promise = n;
            return n;
        }
        function P(e) {
            var n, t, r;
            r = e.pending;
            e.process_scheduled = false;
            e.pending = undefined;
            for (var o = 0, a = r.length; o < a; ++o) {
                e.pur = true;
                t = r[o][0];
                n = r[o][e.status];
                if (i(n)) {
                    t.resolve(n.apply(e.promise, e.values));
                } else if (e.status === 1) {
                    t.resolve.apply(t.resolve, e.values);
                } else {
                    t.reject.apply(t.reject, e.values);
                }
            }
        }
        function T(e) {
            if (e.process_scheduled || !e.pending) return;
            e.process_scheduled = true;
            A(function() {
                P(e);
            });
        }
        function D(e, n) {
            var t, r = false;
            if (o(n[0]) || i(n[0])) t = n[0] && n[0].then;
            if (i(t)) {
                e.status = -1;
                t.call(n, function() {
                    if (r) return;
                    r = true;
                    D(e, arguments);
                }, function() {
                    if (r) return;
                    r = true;
                    R(e, arguments);
                }, function() {
                    q(e, arguments);
                });
            } else {
                e.values = n;
                e.status = 1;
                T(e);
            }
        }
        function R(e, n) {
            e.values = n;
            e.status = 2;
            T(e);
        }
        function q(e, n) {
            var t = e.pending;
            if (e.status <= 0 && t && t.length) {
                A(function() {
                    var r, o;
                    for (var a = 0, s = t.length; a < s; a++) {
                        o = t[a][0];
                        r = t[a][3];
                        if (i(r)) o.notify(r.apply(e.promise, n)); else o.notify.apply(o, n);
                    }
                });
            }
        }
        function $() {
            var e = this;
            var n = {};
            e.promise = n.promise = M(n);
            e.resolve = function t() {
                if (arguments[0] === n.promise) throw new Error("Expected promise to be resolved with other value than itself");
                if (!n.status) D(n, arguments);
                return e;
            };
            e.reject = function r() {
                if (n.status) return;
                R(n, arguments);
                return e;
            };
            e.notify = function i() {
                q(n, arguments);
                return e;
            };
        }
        function G(n, t) {
            var r = e.defer();
            if (t) r.resolve.apply(r, n); else r.reject.apply(r, n);
            return r.promise;
        }
        function H(e, n, t) {
            var r = null;
            if (i(t)) r = t();
            if (r && i(r.then)) {
                return r.then(function() {
                    return G(e, n);
                }, function() {
                    return G(arguments, false);
                });
            } else {
                return G(e, n);
            }
        }
        e.when = function Te(n, t, r, i) {
            var o = e.defer();
            o.resolve(n);
            return o.promise.then(t, r, i);
        };
        e.all = function De(n) {
            var t = e.defer();
            var i = 0;
            var o = [];
            if (arguments.length != 1 && !r(n)) n = Array.prototype.slice.call(arguments);
            n.forEach(function(n, r) {
                i++;
                e.when(n).then(function(e) {
                    o[r] = e;
                    if (!--i) t.resolve.apply(t, o);
                }, function() {
                    t.reject.apply(t, arguments);
                });
            });
            if (i === 0) t.resolve(o);
            return t.promise;
        };
        e.resolve = function Re(n) {
            return e.defer().resolve(n).promise;
        };
        e.reject = function qe(n) {
            return e.defer().reject(n).promise;
        };
        e.defer = function() {
            return new $();
        };
        var K = /\$\{([^}]+)\}|\$([a-zA-Z0-9_]+)/g;
        e.format = function $e(e, n) {
            if (arguments.length != 2 || !o(n) || n === null) n = Array.prototype.slice.call(arguments, 1);
            return e.replace(K, function(e, t, r) {
                return n[t || r] || "";
            });
        };
        e.format_number = function Ge(e) {
            if (e > 0 && e < .1) e = .1; else if (e < 0 && e > -.1) e = -.1;
            if (!e && e !== 0) return ""; else if (e % 1 === 0) return e.toString(); else return e.toFixed(1);
        };
        function z(n, t, r, i) {
            var o;
            var a = null;
            var s, f;
            var l;
            var u, c, d;
            if (!n && n !== 0) {
                a = null;
            } else if (typeof r === "string") {
                f = [];
                for (s in t) f.push(s);
                f.sort().reverse();
                for (u = 0; u < f.length; u++) {
                    for (c = 0; c < t[f[u]].length; c++) {
                        if (r == t[f[u]][c]) {
                            n = n / Math.pow(f[u], c);
                            a = r;
                            break;
                        }
                    }
                    if (a) break;
                }
            } else if (r in t) {
                l = 1;
                for (d = 0; d < t[r].length; d++) {
                    o = n / l;
                    if (o < r) {
                        n = o;
                        a = t[r][d];
                        break;
                    }
                    l *= r;
                }
            }
            var v = e.format_number(n);
            var p;
            if (v && a) p = [ v, a ]; else p = [ v ];
            if (!i) p = p.join(" ");
            return p;
        }
        var W = {
            1e3: [ null, "KB", "MB", "GB", "TB", "PB", "EB", "ZB" ],
            1024: [ null, "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB" ]
        };
        e.format_bytes = function He(e, n, t) {
            if (n === undefined) n = 1024;
            return z(e, W, n, t);
        };
        e.get_byte_units = function Ke(e, n) {
            if (n === undefined || !(n in W)) n = 1024;
            function t(e) {
                return {
                    name: W[n][e],
                    factor: Math.pow(n, e)
                };
            }
            var r = [ t(2), t(3), t(4) ];
            for (var i = r.length - 1; i >= 0; i--) {
                if (i === 0 || e / r[i].factor >= 10) {
                    r[i].selected = true;
                    break;
                }
            }
            return r;
        };
        var V = {
            1024: [ "B/s", "KiB/s", "MiB/s", "GiB/s", "TiB/s", "PiB/s", "EiB/s", "ZiB/s" ]
        };
        e.format_bytes_per_sec = function ze(e, n, t) {
            if (n === undefined) n = 1024;
            return z(e, V, n, t);
        };
        var Z = {
            1e3: [ "bps", "Kbps", "Mbps", "Gbps", "Tbps", "Pbps", "Ebps", "Zbps" ]
        };
        e.format_bits_per_sec = function We(e, n, t) {
            if (n === undefined) n = 1e3;
            return z(e, Z, n, t);
        };
        function F(n) {
            var t = this;
            var r;
            try {
                r = window[n];
            } catch (i) {}
            t.prefixedKey = function(n) {
                return e.transport.application() + ":" + n;
            };
            t.getItem = function(e, n) {
                var i = r.getItem(t.prefixedKey(e));
                if (!i && n) i = r.getItem(e);
                return i;
            };
            t.setItem = function(e, n, i) {
                r.setItem(t.prefixedKey(e), n);
                if (i) r.setItem(e, n);
            };
            t.removeItem = function(e, n) {
                r.removeItem(t.prefixedKey(e));
                if (n) r.removeItem(e);
            };
            t.clear = function(n) {
                var t = 0;
                while (t < r.length) {
                    var i = r.key(t);
                    if (n && i.indexOf("cockpit") !== 0) r.removeItem(i); else if (i.indexOf(e.transport.application()) === 0) r.removeItem(i); else t++;
                }
            };
        }
        e.localStorage = new F("localStorage");
        e.sessionStorage = new F("sessionStorage");
        function Y(e) {
            var n;
            if (e.parent && e.parent !== e) n = Y(e.parent);
            if (!n) {
                try {
                    n = e["cv1-storage"];
                    if (!n) e["cv1-storage"] = n = {};
                } catch (t) {}
            }
            return n;
        }
        function Q(n, t, r) {
            var i = this;
            var o = e.transport.application() + ":" + n;
            var a = window.sessionStorage;
            var s;
            var f = Y(window);
            var l = false;
            var u;
            function c() {
                var e;
                if (f[o] !== undefined) {
                    e = f[o];
                    window.setTimeout(function() {
                        if (r(e, n) === false) i.close();
                    });
                }
            }
            function d(e) {
                if (u && !l) l = true;
                if (!l) return;
                var n = Math.floor(Math.random() * 1e7) + 1;
                var t = document.createEvent("StorageEvent");
                t.initStorageEvent("storage", false, false, o, null, n, window.location, a);
                f[o] = e;
                a.setItem(o, n);
                t.self = i;
                window.dispatchEvent(t);
            }
            i.claim = function h() {
                if (u) return;
                var e = {
                    close: function() {}
                };
                u = e;
                var r = t(d, n);
                if (u === e) u = r; else r.close();
            };
            function v() {
                if (u && u.close) u.close();
                u = null;
                if (!l) return;
                l = false;
                var e = a.getItem(o);
                if (e) e = parseInt(e, 10); else e = null;
                if (s && s === e) {
                    var n = document.createEvent("StorageEvent");
                    var t = a[o];
                    n.initStorageEvent("storage", false, false, o, t, null, window.location, a);
                    delete f[o];
                    a.removeItem(o);
                    n.self = i;
                    window.dispatchEvent(n);
                }
            }
            function p(e) {
                if (e.key !== o) return;
                if (e.self !== i) {
                    if (!e.newValue && !l) {
                        i.claim();
                        return;
                    }
                } else if (l && !e.oldValue && e.newValue !== a.getItem(o)) {
                    v();
                }
                var n = null;
                if (e.newValue) n = parseInt(e.newValue, 10);
                if (s !== n) {
                    s = n;
                    c();
                }
            }
            i.close = function() {
                window.removeEventListener("storage", p, true);
                v();
            };
            window.addEventListener("storage", p, true);
            window.addEventListener("beforeunload", function() {
                i.close();
            });
            window.addEventListener("unload", function() {
                i.close();
            });
            if (a.getItem(o)) c(); else i.claim();
        }
        e.cache = function Ve(e, n, t) {
            return new Q(e, n, t);
        };
        function X(e, n, t) {
            var r = this;
            r.interval = e;
            r.limit = n ? 64 * 1024 : 1024;
            var i = f(n);
            var o = 0;
            var a = null;
            var s = null;
            function f(e) {
                if (!e) return [];
                var n = Y(window);
                var t = n[e];
                if (!t) n[e] = t = [];
                return t;
            }
            function l(e, n) {
                var t = 0;
                var r = e.length - 1;
                var i, o;
                while (t <= r) {
                    i = (t + r) / 2 | 0;
                    o = e[i].beg;
                    if (o < n) t = i + 1; else if (o > n) r = i - 1; else return i;
                }
                return t;
            }
            function u(e, n, r) {
                if (t) {
                    if (!r) {
                        c(e, new Array(n - e), {});
                    }
                    t(e, n, r);
                }
            }
            r.load = function p(e, n, t) {
                if (n <= e) return;
                var r = l(i, e);
                var o;
                var a, s, f, c, d, p = i.length;
                var h = e;
                var m = [];
                for (d = r > 0 ? r - 1 : r; d < p; d++) {
                    o = i[d];
                    c = o.items.length;
                    if (!c) continue;
                    f = o.beg;
                    a = Math.max(f, e);
                    s = Math.min(f + c, n);
                    if (a < s) {
                        if (a > h) m.push([ h, a ]);
                        v(a, o.items.slice(a - f, s - f), o.mapping);
                        h = s;
                    } else if (d >= r) {
                        break;
                    }
                }
                for (d = 0; d < m.length; d++) u(m[d][0], m[d][1], t);
                if (h != n) u(h, n, t);
            };
            function c(e, n, t) {
                if (!n.length) return;
                var f = l(i, e);
                var u = e + n.length;
                var c = [];
                var d;
                var v;
                var p, h, m, g, w, b = i.length;
                for (w = f > 0 ? f - 1 : f; w < b; w++) {
                    d = i[w];
                    g = d.items.length;
                    if (!g) continue;
                    m = d.beg;
                    p = Math.max(m, e);
                    h = Math.min(m + g, u);
                    if (p < h) {
                        v = h - p;
                        d.items.splice(p - m, v);
                        o -= v;
                        if (p - m === 0) d.beg += h - m;
                    } else if (w >= f) {
                        break;
                    }
                }
                d = {
                    beg: e,
                    items: n,
                    mapping: t
                };
                if (!a) a = d;
                if (s) s.next = d;
                s = d;
                o += n.length;
                i.splice(f, 0, d);
                for (f--; f <= w; f++) {
                    d = i[f];
                    if (d && !d.items.length) {
                        i.splice(f, 1);
                        f--;
                    }
                }
                while (a && o > r.limit) {
                    o -= a.items.length;
                    a.items = [];
                    a.mapping = null;
                    a = a.next || null;
                }
                b = i.length;
                for (w = 0; w < b; w++) {
                    if (i[w].items.length > 0) break;
                }
                i.splice(0, w);
            }
            var d = {};
            r._register = function h(n, t) {
                if (n.interval != e) throw "mismatched metric interval between grid and sink";
                var r = d[t];
                if (!r) {
                    r = d[t] = {
                        grid: n,
                        links: []
                    };
                    r.links.remove = function i() {
                        delete d[t];
                    };
                }
                return r.links;
            };
            function v(e, n, t) {
                var r, i, o, a, s;
                var f, l, u, c;
                var v, p, h;
                var m, g, w, b, y;
                var k = e + n.length;
                for (v in d) {
                    p = d[v];
                    h = p.grid;
                    b = Math.max(e, h.beg);
                    y = Math.min(k, h.end);
                    if (b < y) {
                        m = b - e;
                        g = b - h.beg;
                        w = y - b;
                        for (r = 0; r < w; r++) {
                            s = p.links.length;
                            for (a = 0; a < s; a++) {
                                l = p.links[a][0];
                                u = p.links[a][1];
                                f = n[m + r];
                                c = t;
                                o = l.length;
                                for (i = 0; f !== undefined && i < o; i++) {
                                    if (!f) {
                                        f = undefined;
                                    } else if (c !== undefined && c !== null) {
                                        c = c[l[i]];
                                        if (c) f = f[c[""]]; else f = f[l[i]];
                                    } else {
                                        f = f[l[i]];
                                    }
                                }
                                u[g + r] = f;
                            }
                        }
                        h.notify(g, w);
                    }
                }
            }
            r.input = function m(e, n, t) {
                v(e, n, t);
                c(e, n, t);
            };
        }
        e.series = function Ze(e, n, t) {
            return new X(e, n, t);
        };
        var ee = 1;
        function ne(e, n, t) {
            var r = this;
            O(r, {});
            var a = [];
            r.interval = e;
            r.beg = 0;
            r.end = 0;
            var f = [];
            var l = [];
            var u = 0;
            var c = "g1-" + ee;
            ee += 1;
            var d = null;
            var v = null;
            r.notify = function m(e, n) {
                if (u) return;
                if (e + n > r.end - r.beg) n = r.end - r.beg - e;
                if (n <= 0) return;
                var t, i = f.length;
                var o, a;
                for (t = 0; t < i; t++) {
                    o = f[t][0];
                    a = f[t][1];
                    o.call(r, a, e, n);
                }
                r.dispatchEvent("notify", e, n);
            };
            r.add = function g() {
                var e = [];
                a.push(e);
                var n, t, s, u, d;
                if (o(arguments[0])) {
                    t = arguments[0];
                    t = t["series"] || t;
                    s = arguments[1];
                    if (!s) s = []; else if (typeof s === "string") s = s.split(".");
                    u = t._register(r, c);
                    if (!u.length) l.push({
                        sink: t,
                        links: u
                    });
                    u.push([ s, e ]);
                } else if (i(arguments[0])) {
                    d = [ arguments[0], e ];
                    if (arguments[1] === true) f.unshift(d); else f.push(d);
                } else if (arguments.length !== 0) {
                    throw "invalid args to grid.add()";
                }
                return e;
            };
            r.remove = function w(e) {
                var n, t, r, i;
                r = l.length;
                for (t = 0; t < r; t++) {
                    i = l[t].links.length;
                    for (n = 0; n < i; n++) {
                        if (l[t].links[n][1] === e) {
                            l[t].links.splice(n, 1);
                            break;
                        }
                    }
                }
                r = a.length;
                for (t = 0; t < r; t++) {
                    if (a[t] === e) {
                        a.splice(t, 1);
                        break;
                    }
                }
            };
            r.sync = function b(e) {
                u++;
                var n, t, i = l.length;
                for (t = 0; t < i; t++) {
                    n = l[t].sink;
                    n.load(r.beg, r.end, e);
                }
                u--;
                r.notify(0, r.end - r.beg);
            };
            function p(e, n, t) {
                if (n === undefined) n = e + (r.end - r.beg);
                if (n < e) e = n;
                r.beg = e;
                r.end = n;
                if (!a.length) return;
                a.forEach(function(e) {
                    e.length = 0;
                });
                r.sync(t);
            }
            function h() {
                window.clearInterval(d);
                d = null;
                v = null;
            }
            r.move = function y(e, n) {
                h();
                var t = null;
                if (e === undefined) {
                    e = 0;
                } else if (s(e)) {
                    t = Date.now();
                    e = Math.floor(t / r.interval) + e;
                }
                if (n !== undefined && s(n)) {
                    if (t === null) t = Date.now();
                    n = Math.floor(t / r.interval) + n;
                }
                p(e, n, false);
            };
            r.walk = function k() {
                var e = Date.now();
                if (r.interval > 2e9) return;
                h();
                v = e - r.beg * r.interval;
                d = window.setInterval(function() {
                    var e = Date.now();
                    p(Math.floor((e - v) / r.interval), undefined, true);
                }, r.interval);
            };
            r.close = function E() {
                h();
                while (l.length) l.pop().links.remove();
            };
            r.move(n, t);
        }
        e.grid = function Fe(e, n, t) {
            return new ne(e, n, t);
        };
        function te(n, t) {
            this.problem = n;
            this.message = t || e.message(n);
            this.toString = function() {
                return this.message;
            };
        }
        e.logout = function Ye(n) {
            e.sessionStorage.clear(true);
            e.localStorage.removeItem("login-data", true);
            e.localStorage.clear(false);
            if (n !== false) d = true;
            N(function(e) {
                e.send_control({
                    command: "logout",
                    disconnect: true
                });
            });
            window.sessionStorage.setItem("logout-intent", "explicit");
        };
        e.drop_privileges = function Qe() {
            N(function(e) {
                e.send_control({
                    command: "logout",
                    disconnect: false
                });
            });
        };
        e.info = {};
        O(e.info, {});
        p = function(n) {
            if (n.system) f(e.info, n.system);
            if (n.system) e.info.dispatchEvent("changed");
        };
        var re = null;
        e.user = function() {
            var n = e.defer();
            var t;
            if (!re) {
                t = e.dbus(null, {
                    bus: "internal"
                });
                t.call("/user", "org.freedesktop.DBus.Properties", "GetAll", [ "cockpit.User" ], {
                    type: "s"
                }).done(function(e) {
                    var t = e[0];
                    n.resolve({
                        id: t.Id.v,
                        name: t.Name.v,
                        full_name: t.Full.v,
                        groups: t.Groups.v,
                        home: t.Home.v,
                        shell: t.Shell.v
                    });
                }).fail(function(e) {
                    n.reject(e);
                }).always(function() {
                    t.close();
                });
            } else {
                n.resolve(re);
            }
            return n.promise;
        };
        document.addEventListener("click", function(e) {
            if (e.target.classList && t(e.target.classList, "disabled")) e.stopPropagation();
        }, true);
        var ie = null;
        function oe() {
            return window.location.href.split("#")[1] || "";
        }
        function ae() {
            var n = this;
            var t = e.transport.application();
            n.url_root = url_root || "";
            if (t.indexOf("cockpit+=") === 0) {
                if (n.url_root) n.url_root += "/";
                n.url_root = n.url_root + t.replace("cockpit+", "");
            }
            var i = oe();
            var o = {};
            var a = l(i, o);
            function s(e) {
                var t = e.split("/").map(decodeURIComponent);
                var r, i, o = [];
                if (n.url_root) o = n.url_root.split("/").map(decodeURIComponent);
                if (e && e[0] !== "/") {
                    r = [].concat(a);
                    r.pop();
                    r = r.concat(t);
                } else {
                    r = t;
                }
                r = J(r);
                for (i = 0; i < o.length; i++) {
                    if (o[i] !== r[i]) break;
                }
                if (i == o.length) r.splice(0, o.length);
                return r;
            }
            function f(e, t, i) {
                if (typeof e == "string") e = s(e, n.path);
                var o = "/" + e.map(encodeURIComponent).join("/");
                if (i && n.url_root && o.indexOf("/" + n.url_root + "/" !== 0)) o = "/" + n.url_root + o;
                o = o.replace("%40", "@");
                o = o.replace("%3D", "=");
                o = o.replace(/%2B/g, "+");
                var a, f, l, u = [];
                function c(e) {
                    u.push(encodeURIComponent(f) + "=" + encodeURIComponent(e));
                }
                if (t) {
                    for (f in t) {
                        l = t[f];
                        if (!r(l)) l = [ l ];
                        l.forEach(c);
                    }
                    if (u.length > 0) o += "?" + u.join("&");
                }
                return o;
            }
            function l(e, n) {
                if (e[0] == "#") e = e.substr(1);
                var t = e.indexOf("?");
                var i = e;
                if (t === -1) i = e; else i = e.substr(0, t);
                var o = s(i);
                if (t !== -1 && n) {
                    e.substring(t + 1).split("&").forEach(function(e) {
                        var t, i = e.split("=");
                        var o = decodeURIComponent(i[0]);
                        var a = decodeURIComponent(i[1]);
                        if (n.hasOwnProperty(o)) {
                            t = n[o];
                            if (!r(a)) t = n[o] = [ t ];
                            t.push(a);
                        } else {
                            n[o] = a;
                        }
                    });
                }
                return o;
            }
            function u() {
                var e;
                if (arguments.length == 1 && arguments[0] instanceof ae) {
                    e = String(arguments[0]);
                } else if (typeof arguments[0] == "string") {
                    var t = arguments[1] || {};
                    e = f(l(arguments[0], t), t);
                } else {
                    e = f.apply(n, arguments);
                }
                return e;
            }
            function c() {
                if (n !== ie) return;
                var e = u.apply(n, arguments);
                window.location.replace(window.location.pathname + "#" + e);
            }
            function d() {
                if (n !== ie) return;
                var e = u.apply(n, arguments);
                window.location.hash = "#" + e;
            }
            Object.defineProperties(n, {
                path: {
                    enumerable: true,
                    writable: false,
                    value: a
                },
                options: {
                    enumerable: true,
                    writable: false,
                    value: o
                },
                href: {
                    enumerable: true,
                    value: i
                },
                go: {
                    value: d
                },
                replace: {
                    value: c
                },
                encode: {
                    value: f
                },
                decode: {
                    value: l
                },
                toString: {
                    value: function() {
                        return i;
                    }
                }
            });
        }
        Object.defineProperty(e, "location", {
            enumerable: true,
            get: function() {
                if (!ie || ie.href !== oe()) ie = new ae();
                return ie;
            },
            set: function(n) {
                e.location.go(n);
            }
        });
        window.addEventListener("hashchange", function() {
            ie = null;
            var n = window.location.hash;
            if (n.indexOf("#") === 0) n = n.substring(1);
            e.hint("location", {
                hash: n
            });
            e.dispatchEvent("locationchanged");
        });
        e.jump = function Xe(n, t) {
            if (r(n)) n = "/" + n.map(encodeURIComponent).join("/").replace("%40", "@").replace("%3D", "=").replace(/%2B/g, "+"); else n = "" + n;
            var i = {
                command: "jump",
                location: n,
                host: t
            };
            e.transport.inject("\n" + JSON.stringify(i));
        };
        (function() {
            var n;
            var t = false;
            function r() {
                var r = document[n];
                if (!n || typeof r === "undefined") r = false;
                if (r === false) r = t;
                if (e.hidden !== r) {
                    e.hidden = r;
                    e.dispatchEvent("visibilitychange");
                }
            }
            if (typeof document.hidden !== "undefined") {
                n = "hidden";
                document.addEventListener("visibilitychange", r);
            } else if (typeof document.mozHidden !== "undefined") {
                n = "mozHidden";
                document.addEventListener("mozvisibilitychange", r);
            } else if (typeof document.msHidden !== "undefined") {
                n = "msHidden";
                document.addEventListener("msvisibilitychange", r);
            } else if (typeof document.webkitHidden !== "undefined") {
                n = "webkitHidden";
                document.addEventListener("webkitvisibilitychange", r);
            }
            m = function(e) {
                if ("hidden" in e) {
                    t = e.hidden;
                    r();
                }
            };
            r();
        })();
        function se(n, t) {
            this.problem = n.problem || null;
            this.exit_status = n["exit-status"];
            if (this.exit_status === undefined) this.exit_status = null;
            this.exit_signal = n["exit-signal"];
            if (this.exit_signal === undefined) this.exit_signal = null;
            this.message = n.message;
            if (this.message === undefined) {
                if (this.problem) this.message = e.message(n.problem); else if (this.exit_signal !== null) this.message = e.format(be("$0 killed with signal $1"), t, this.exit_signal); else if (this.exit_status !== undefined) this.message = e.format(be("$0 exited with code $1"), t, this.exit_status); else this.message = e.format(be("$0 failed"), t);
            } else {
                this.message = this.message.trim();
            }
            this.toString = function() {
                return this.message;
            };
        }
        function fe() {
            if (window.debugging == "all" || window.debugging == "spawn") console.debug.apply(console, arguments);
        }
        e.spawn = function(n, t) {
            var r = e.defer();
            var i = {
                payload: "stream",
                spawn: []
            };
            if (n instanceof Array) {
                for (var o = 0; o < n.length; o++) i["spawn"].push(String(n[o]));
            } else {
                i["spawn"].push(String(n));
            }
            if (t !== undefined) f(i, t);
            var a = i["spawn"][0] || "process";
            var s = e.channel(i);
            var l = s.buffer(null);
            s.addEventListener("close", function(e, n) {
                var t = l.squash();
                fe("process closed:", JSON.stringify(n));
                if (t) fe("process output:", t);
                if (n.message !== undefined) fe("process error:", n.message);
                if (n.problem) r.reject(new se(n, a)); else if (n["exit-status"] || n["exit-signal"]) r.reject(new se(n, a), t); else if (n.message !== undefined) r.resolve(t, n.message); else r.resolve(t);
            });
            var u = r.promise;
            u.stream = function(e) {
                l.callback = e.bind(u);
                return this;
            };
            u.input = function(e, n) {
                if (e !== null && e !== undefined) {
                    fe("process input:", e);
                    s.send(e);
                }
                if (!n) s.control({
                    command: "done"
                });
                return this;
            };
            u.close = function(e) {
                fe("process closing:", e);
                if (s.valid) s.close(e);
                return this;
            };
            return u;
        };
        e.script = function(n, t, r) {
            if (!r && a(t)) {
                r = t;
                t = [];
            }
            var i = [ "/bin/sh", "-c", n, "--" ];
            i.push.apply(i, t);
            return e.spawn(i, r);
        };
        function le() {
            if (window.debugging == "all" || window.debugging == "dbus") console.debug.apply(console, arguments);
        }
        function ue(n, t) {
            if (typeof n == "string") {
                this.problem = n;
                this.name = null;
                this.message = t || e.message(n);
            } else {
                this.problem = null;
                this.name = n[0];
                this.message = n[1][0] || n[0];
            }
            this.toString = function() {
                return this.message;
            };
        }
        function ce() {
            var e = this;
            var n = [];
            e.data = {};
            e.meta = {};
            e.connect = function r(e, t, i, o) {
                var a = [ e, t, i ];
                if (o) n.unshift(a); else n.push(a);
                return {
                    remove: function s() {
                        var r, o = n.length;
                        for (r = 0; r < o; r++) {
                            var a = n[r];
                            if (a[0] === e && a[1] === t && a[2] === i) {
                                delete a[r];
                                break;
                            }
                        }
                    }
                };
            };
            function t(e, t, r) {
                var i = n.slice();
                var o, a = i.length;
                for (o = 0; o < a; o++) {
                    var s = i[o];
                    if ((!s[0] || s[0] === e) && (!s[1] || s[1] === t)) {
                        s[2](r, e);
                    }
                }
            }
            e.update = function i(n, r, o) {
                if (!e.data[n]) e.data[n] = {};
                if (!e.data[n][r]) e.data[n][r] = o; else o = f(e.data[n][r], o);
                t(n, r, o);
            };
            e.remove = function o(n, r) {
                if (e.data[n]) {
                    delete e.data[n][r];
                    t(n, r, null);
                }
            };
            e.lookup = function a(n, t) {
                if (e.data[n]) return e.data[n][t];
                return undefined;
            };
            e.each = function s(n, t) {
                var r, i;
                for (r in e.data) {
                    for (n in e.data[r]) {
                        if (i == n) t(e.data[r][n], r);
                    }
                }
            };
            e.close = function l() {
                e.data = {};
                var t = n;
                n = [];
                var r, i = t.length;
                for (r = 0; r < i; r++) t[r].callback();
            };
        }
        function de(n, t, r, i, o) {
            var a = this;
            O(a, {});
            var s = false;
            var l = false;
            var u = e.defer();
            Object.defineProperties(a, {
                client: {
                    value: n,
                    enumerable: false,
                    writable: false
                },
                path: {
                    value: i,
                    enumerable: false,
                    writable: false
                },
                iface: {
                    value: r,
                    enumerable: false,
                    writable: false
                },
                valid: {
                    get: function() {
                        return s;
                    },
                    enumerable: false
                },
                wait: {
                    enumerable: false,
                    writable: false,
                    value: function(e) {
                        if (e) u.promise.always(e);
                        return u.promise;
                    }
                },
                call: {
                    value: function(e, t, o) {
                        return n.call(i, r, e, t, o);
                    },
                    enumerable: false,
                    writable: false
                },
                data: {
                    value: {},
                    enumerable: false
                }
            });
            if (typeof window.$ === "function") {
                Object.defineProperty(a, window.$.expando, {
                    value: {},
                    writable: true,
                    enumerable: false
                });
            }
            if (!o) o = {};
            function c() {
                if (!t.meta[r]) return;
                var o = t.meta[r];
                l = true;
                Object.keys(o.methods || {}).forEach(function(t) {
                    if (t[0].toLowerCase() == t[0]) return;
                    Object.defineProperty(a, t, {
                        enumerable: false,
                        value: function() {
                            var o = e.defer();
                            n.call(i, r, t, Array.prototype.slice.call(arguments)).done(function(e) {
                                o.resolve.apply(o, e);
                            }).fail(function(e) {
                                o.reject(e);
                            });
                            return o.promise;
                        }
                    });
                });
                Object.keys(o.properties || {}).forEach(function(t) {
                    if (t[0].toLowerCase() == t[0]) return;
                    var s = {
                        enumerable: true,
                        get: function() {
                            return a.data[t];
                        },
                        set: function(e) {
                            throw t + "is not writable";
                        }
                    };
                    var f = o.properties[t];
                    if (f.flags && f.flags.indexOf("w") !== -1) {
                        s.set = function(o) {
                            n.call(i, "org.freedesktop.DBus.Properties", "Set", [ r, t, e.variant(f.type, o) ]).fail(function(e) {
                                console.log("Couldn't set " + r + " " + t + " at " + i + ": " + e);
                            });
                        };
                    }
                    Object.defineProperty(a, t, s);
                });
            }
            function d(e) {
                if (e) {
                    f(a.data, e);
                    if (!l) c();
                    s = true;
                } else {
                    s = false;
                }
                a.dispatchEvent("changed", e);
            }
            t.connect(i, r, d, true);
            d(t.lookup(i, r));
            function v(e, n, t, r) {
                a.dispatchEvent("signal", t, r);
                if (t[0].toLowerCase() != t[0]) {
                    r = r.slice();
                    r.unshift(t);
                    a.dispatchEvent.apply(a, r);
                }
            }
            n.subscribe({
                path: i,
                "interface": r
            }, v, o.subscribe !== false);
            function p(e) {
                if (s) u.resolve(); else u.reject(e);
            }
            if (o.watch !== false) n.watch({
                path: i,
                "interface": r
            }).always(p); else p();
        }
        function ve(n, t, r, i, o) {
            var a = this;
            O(a, {});
            var s;
            Object.defineProperties(a, {
                client: {
                    value: n,
                    enumerable: false,
                    writable: false
                },
                iface: {
                    value: r,
                    enumerable: false,
                    writable: false
                },
                path_namespace: {
                    value: i,
                    enumerable: false,
                    writable: false
                },
                wait: {
                    enumerable: false,
                    writable: false,
                    value: function(e) {
                        if (e) s.always(e);
                        return s;
                    }
                }
            });
            if (typeof window.$ === "function") {
                Object.defineProperty(a, window.$.expando, {
                    value: {},
                    writable: true,
                    enumerable: false
                });
            }
            var l = {
                "interface": r,
                path_namespace: i
            };
            n.subscribe(l);
            if (o.watch !== false) {
                s = n.watch(l);
            } else {
                s = e.defer().resolve().promise;
            }
            o = f({
                watch: false,
                subscribe: false
            }, o);
            function u(e, t) {
                var i = a[t];
                if (!t) {
                    return;
                } else if (!e && i) {
                    delete a[t];
                    a.dispatchEvent("removed", i);
                } else if (e) {
                    if (!i) {
                        i = a[t] = n.proxy(r, t, o);
                        a.dispatchEvent("added", i);
                    }
                    a.dispatchEvent("changed", i);
                }
            }
            t.connect(null, r, u, false);
            t.each(r, u);
        }
        function pe(n, t) {
            var r = this;
            O(r, {});
            var i = {};
            var o = false;
            var s = null;
            if (t) {
                if (t.track) o = true;
                delete t["track"];
                f(i, t);
            }
            i.payload = "dbus-json3";
            if (n) i.name = n;
            r.options = t;
            r.unique_name = null;
            le("dbus open: ", i);
            var l = e.channel(i);
            var u = {};
            var c = {};
            var d = {};
            var v;
            var p;
            r.constructors = {
                "*": de
            };
            r.wait = l.wait;
            function h() {
                if (!v) v = new ce();
            }
            function m(e) {
                if (l && l.valid) {
                    le("dbus:", e);
                    l.send(e);
                    return true;
                }
                return false;
            }
            function g(e, n) {
                if (n.path && e[0] !== n.path) return false;
                if (n.path_namespace && e[0].indexOf(n.path_namespace) !== 0) return false;
                if (n["interface"] && e[1] !== n["interface"]) return false;
                if (n.member && e[2] !== n.member) return false;
                if (n.arg0 && (!e[3] || e[3][0] !== n.arg0)) return false;
                return true;
            }
            function w(e, n) {
                le("dbus:", n);
                var t;
                try {
                    t = JSON.parse(n);
                } catch (i) {
                    console.warn("received invalid dbus json message:", i);
                }
                if (t === undefined) {
                    l.close({
                        problem: "protocol-error"
                    });
                    return;
                }
                var a, f;
                if (t.id !== undefined) a = d[t.id];
                if (t.reply) {
                    if (a) {
                        f = {};
                        if (t.type) f.type = t.type;
                        if (t.flags) f.flags = t.flags;
                        a.resolve(t.reply[0] || [], f);
                        delete d[t.id];
                    }
                    return;
                } else if (t.error) {
                    if (a) {
                        a.reject(new ue(t.error));
                        delete d[t.id];
                    }
                    return;
                }
                A(function() {
                    var e, i;
                    if (t.signal) {
                        for (e in u) {
                            i = u[e];
                            if (i.callback) {
                                if (g(t.signal, i.match)) i.callback.apply(r, t.signal);
                            }
                        }
                    } else if (t.call) {
                        I(t.call, t.id);
                    } else if (t.notify) {
                        y(t.notify);
                    } else if (t.meta) {
                        b(t.meta);
                    } else if (t.owner !== undefined) {
                        r.dispatchEvent("owner", t.owner);
                        if (o && s) r.close();
                        s = t.owner;
                    } else {
                        le("received unexpected dbus json message:", n);
                    }
                });
            }
            function b(e) {
                h();
                f(v.meta, e);
                r.dispatchEvent("meta", e);
            }
            r.meta = function(e, n) {
                if (!l || !l.valid) return;
                var t = f({}, n, {
                    meta: e
                });
                m(JSON.stringify(t));
                b(e);
            };
            function y(e) {
                h();
                var n, t, i;
                for (n in e) {
                    for (t in e[n]) {
                        i = e[n][t];
                        if (!i) v.remove(n, t); else v.update(n, t, i);
                    }
                }
                r.dispatchEvent("notify", e);
            }
            this.notify = y;
            function k(e) {
                p = e.problem || "disconnected";
                var n, t = d;
                d = {};
                for (n in t) {
                    t[n].reject(new ue(p, e.message));
                }
                r.dispatchEvent("close", e);
            }
            this.close = function B(e) {
                if (typeof e == "string") e = {
                    problem: e
                };
                if (!e) e = {};
                if (l) l.close(e); else k(e);
            };
            function E(e, n) {
                le("dbus ready:", t);
                r.unique_name = n["unique-name"];
            }
            function _(e, n) {
                le("dbus close:", n);
                l.removeEventListener("ready", E);
                l.removeEventListener("message", w);
                l.removeEventListener("close", _);
                l = null;
                k(n);
            }
            l.addEventListener("ready", E);
            l.addEventListener("message", w);
            l.addEventListener("close", _);
            var S = 1;
            this.call = function M(n, t, r, i, o) {
                var a = e.defer();
                var s = String(S);
                S++;
                var l = f({}, o, {
                    call: [ n, t, r, i || [] ],
                    id: s
                });
                var u = JSON.stringify(l);
                if (m(u)) d[s] = a; else a.reject(new ue(p));
                return a.promise;
            };
            r.signal = function N(e, n, t, r, i) {
                if (!l || !l.valid) return;
                var o = f({}, i, {
                    signal: [ e, n, t, r || [] ]
                });
                m(JSON.stringify(o));
            };
            this.subscribe = function U(e, n, t) {
                var r, i = {
                    match: f({}, e),
                    callback: n
                };
                if (t !== false) m(JSON.stringify({
                    "add-match": i.match
                }));
                var o;
                if (n) {
                    o = String(S);
                    S++;
                    u[o] = i;
                }
                return {
                    remove: function() {
                        var e;
                        if (o) {
                            e = u[o];
                            if (e) delete u[o];
                        }
                        if (t !== false && e) m(JSON.stringify({
                            "remove-match": e.match
                        }));
                    }
                };
            };
            r.watch = function J(n) {
                var t;
                if (a(n)) t = f({}, n); else t = {
                    path: String(n)
                };
                var r = String(S);
                S++;
                var i = e.defer();
                var o = JSON.stringify({
                    watch: t,
                    id: r
                });
                if (m(o)) d[r] = i; else i.reject(new ue(p));
                var s = i.promise;
                s.remove = function l() {
                    if (r in d) {
                        i.reject(new ue("cancelled"));
                        delete d[r];
                    }
                    m(JSON.stringify({
                        unwatch: t
                    }));
                };
                return s;
            };
            function x(n, t) {
                var r = "DBus interface " + t + " not available at " + n;
                return e.reject(new ue([ "org.freedesktop.DBus.Error.UnknownInterface", [ r ] ]));
            }
            function j(n, t, r) {
                var i = "DBus method " + t + " " + r + " not available at " + n;
                return e.reject(new ue([ "org.freedesktop.DBus.Error.UnknownMethod", [ i ] ]));
            }
            function L(e, n, t) {
                console.warn("method is not implemented properly: ", e, n, t);
                return j(e, n, t);
            }
            function C(e) {
                var n = e[0];
                var t = e[1];
                var r = e[2];
                var i = c[n + "\n" + t];
                var o = v.meta[t];
                if (!i || !o) return x(n, t);
                if (!o.methods || !(r in o.methods)) return j(n, t, r);
                if (typeof i[r] != "function") return L(n, t, r);
                return i[r].apply(i, e[3]);
            }
            function I(n, t) {
                var r = C(n);
                if (!t) return;
                e.when(r).then(function() {
                    var e = Array.prototype.slice.call(arguments, 0);
                    if (e.length == 1 && typeof e[0] == "undefined") e = [];
                    m(JSON.stringify({
                        reply: [ e ],
                        id: t
                    }));
                }, function(n) {
                    var r = [];
                    r[0] = n.name || " org.freedesktop.DBus.Error.Failed";
                    r[1] = [ e.message(n) || r[0] ];
                    m(JSON.stringify({
                        error: r,
                        id: t
                    }));
                });
            }
            r.publish = function(n, t, r, i) {
                var o = [ n, t ];
                var a = String(S);
                S++;
                var s = d[a] = e.defer();
                var l = JSON.stringify(f({}, i, {
                    publish: o,
                    id: a
                }));
                if (m(l)) d[a] = s; else s.reject(new ue(p));
                var u = n + "\n" + t;
                s.promise.then(function() {
                    c[u] = r;
                });
                var v = s.promise;
                v.remove = function h() {
                    if (a in d) {
                        s.reject(new ue("cancelled"));
                        delete d[a];
                    }
                    delete c[u];
                    m(JSON.stringify({
                        unpublish: o
                    }));
                };
                return v;
            };
            r.proxy = function P(e, t, i) {
                if (!e) e = n;
                e = String(e);
                if (!t) t = "/" + e.replace(/\./g, "/");
                var o = r.constructors[e];
                if (!o) o = r.constructors["*"];
                if (!i) i = {};
                h();
                return new o(r, v, e, String(t), i);
            };
            r.proxies = function T(e, t, i) {
                if (!e) e = n;
                if (!t) t = "/";
                if (!i) i = {};
                h();
                return new ve(r, v, String(e), String(t), i);
            };
        }
        var he = {
            internal: null,
            session: null,
            system: null
        };
        e.dbus = function en(e, n) {
            if (!n) n = {
                bus: "system"
            };
            var t = Object.keys(n);
            var r = n.bus;
            var i = !e && t.length == 1 && r in he;
            if (i && he[r]) return he[r];
            var o = new pe(e, n);
            var a;
            if (i) {
                o.close = function() {
                    if (arguments.length > 0) a.apply(o, arguments);
                };
                o.addEventListener("close", function() {
                    if (he[r] == o) he[r] = null;
                });
                he[r] = o;
            }
            return o;
        };
        e.variant = function nn(e, n) {
            return {
                v: n,
                t: e
            };
        };
        e.byte_array = function tn(e) {
            return window.btoa(e);
        };
        e.file = function rn(n, t) {
            t = t || {};
            var r = t.binary;
            var i = {
                path: n,
                read: d,
                replace: p,
                modify: h,
                watch: E,
                close: _
            };
            var o = f({}, t);
            delete o.syntax;
            function a(e) {
                if (t.syntax && t.syntax.parse) return t.syntax.parse(e); else return e;
            }
            function s(e) {
                if (t.syntax && t.syntax.stringify) return t.syntax.stringify(e); else return e;
            }
            var u = null;
            var c;
            function d() {
                if (u) return u;
                var t = e.defer();
                var i = f({}, o, {
                    payload: "fsread1",
                    path: n
                });
                function s() {
                    c = e.channel(i);
                    var n = [];
                    c.addEventListener("message", function(e, t) {
                        n.push(t);
                    });
                    c.addEventListener("close", function(e, i) {
                        c = null;
                        if (i.problem == "change-conflict") {
                            s();
                            return;
                        }
                        u = null;
                        if (i.problem) {
                            var o = new te(i.problem, i.message);
                            k(null, null, o);
                            t.reject(o);
                            return;
                        }
                        var f;
                        if (i.tag == "-") f = null; else {
                            try {
                                f = a(I(n, r));
                            } catch (l) {
                                k(null, null, l);
                                t.reject(l);
                                return;
                            }
                        }
                        k(f, i.tag);
                        t.resolve(f, i.tag);
                    });
                }
                s();
                u = t.promise;
                return u;
            }
            var v = null;
            function p(t, r) {
                var i = e.defer();
                var a;
                try {
                    if (t === null) a = null; else a = s(t);
                } catch (l) {
                    i.reject(l);
                    return i.promise;
                }
                if (v) v.close("abort");
                var u = f({}, o, {
                    payload: "fsreplace1",
                    path: n,
                    tag: r
                });
                v = e.channel(u);
                v.addEventListener("close", function(e, n) {
                    v = null;
                    if (n.problem) {
                        i.reject(new te(n.problem, n.message));
                    } else {
                        k(t, n.tag);
                        i.resolve(n.tag);
                    }
                });
                var c = 0, d = false;
                if (a) {
                    if (a.byteLength) {
                        c = a.byteLength;
                        d = true;
                    } else if (a.length) {
                        c = a.length;
                    }
                }
                var p, h, m = 16 * 1024;
                for (p = 0; p < c; p += m) {
                    h = Math.min(c - p, m);
                    if (d) v.send(new window.Uint8Array(a.buffer, p, h)); else v.send(a.substr(p, h));
                }
                v.control({
                    command: "done"
                });
                return i.promise;
            }
            function h(n, t, r) {
                var i = e.defer();
                function o(e, t) {
                    var r = n(e);
                    if (r === undefined) r = e;
                    p(r, t).done(function(e) {
                        i.resolve(r, e);
                    }).fail(function(e) {
                        if (e.problem == "change-conflict") a(); else i.reject(e);
                    });
                }
                function a() {
                    d().done(o).fail(function(e) {
                        i.reject(e);
                    });
                }
                if (t === undefined) a(); else o(t, r);
                return i.promise;
            }
            var m = [];
            var g = 0;
            var w = null;
            var b;
            function y() {
                if (g > 0) {
                    if (w) return;
                    var t = f({}, o, {
                        payload: "fswatch1",
                        path: n
                    });
                    w = e.channel(t);
                    w.addEventListener("message", function(e, t) {
                        var r;
                        try {
                            r = JSON.parse(t);
                        } catch (i) {
                            r = null;
                        }
                        if (r && r.path == n && r.tag && r.tag != b) d();
                    });
                } else {
                    if (w) {
                        w.close();
                        w = null;
                    }
                }
            }
            function k() {
                b = arguments[1] || null;
                l(m, i, arguments);
            }
            function E(e) {
                if (e) m.push(e);
                g += 1;
                y();
                b = null;
                d();
                return {
                    remove: function() {
                        var n;
                        if (e) {
                            n = m.indexOf(e);
                            if (n > -1) m[n] = null;
                        }
                        g -= 1;
                        y();
                    }
                };
            }
            function _() {
                if (c) c.close("cancelled");
                if (v) v.close("cancelled");
                if (w) w.close("cancelled");
            }
            return i;
        };
        var me = {};
        var ge;
        e.language = undefined;
        e.locale = function on(n) {
            var t = e.language || "en";
            var r;
            if (n) {
                f(me, n);
                r = n[""];
            } else if (n === null) {
                me = {};
            }
            if (r) {
                if (r["plural-forms"]) ge = r["plural-forms"];
                if (r["language"]) t = r["language"];
            }
            e.language = t;
        };
        e.translate = function an() {
            var n;
            if (arguments.length === 0) n = [ document ]; else if (arguments.length === 1 && arguments[0].length) n = arguments[0]; else n = arguments;
            var t, r, i, o, a, s, f, l, u, c;
            for (t = 0, r = n.length; t < r; t++) {
                l = null;
                if (n[t].querySelectorAll) l = n[t].querySelectorAll("[translatable], [translate]");
                if (!l) continue;
                for (o = 0, a = l.length; o < a; o++) {
                    c = l[o];
                    i = c.getAttribute("translate") || c.getAttribute("translatable") || "yes";
                    if (i == "no") continue;
                    u = i.split(" ");
                    i = c.getAttribute("translate-context") || c.getAttribute("context");
                    for (s = 0, f = u.length; s < f; s++) {
                        if (u[s] == "yes" || u[s] == "translate") c.textContent = e.gettext(i, c.textContent); else if (u[s]) c.setAttribute(u[s], e.gettext(i, c.getAttribute(u[s]) || ""));
                    }
                    c.removeAttribute("translatable");
                    c.removeAttribute("translate");
                }
            }
        };
        e.gettext = function sn(e, n) {
            if (arguments.length == 1) {
                n = e;
                e = undefined;
            }
            var t = e ? e + "" + n : n;
            if (me) {
                var r = me[t];
                if (r && r[1]) return r[1];
            }
            return n;
        };
        function we(e) {
            return e === true ? 1 : e ? e : 0;
        }
        e.ngettext = function fn(e, n, t, r) {
            if (arguments.length == 3) {
                r = t;
                t = n;
                n = e;
                e = undefined;
            }
            var i = e ? e + "" + n : n;
            if (me && ge) {
                var o = me[i];
                if (o) {
                    var a = we(ge(r)) + 1;
                    if (o[a]) return o[a];
                }
            }
            if (r == 1) return n;
            return t;
        };
        e.noop = function ln(e, n) {
            return arguments[arguments.length - 1];
        };
        var be = e.gettext;
        e.message = function un(e) {
            if (e.message) return e.message;
            var n = null;
            if (e.problem) n = e.problem; else n = e + "";
            if (n == "terminated") return be("Your session has been terminated."); else if (n == "no-session") return be("Your session has expired. Please log in again."); else if (n == "access-denied") return be("Not permitted to perform this action."); else if (n == "authentication-failed") return be("Login failed"); else if (n == "authentication-not-supported") return be("The server refused to authenticate using any supported methods."); else if (n == "unknown-hostkey") return be("Untrusted host"); else if (n == "unknown-host") return be("Untrusted host"); else if (n == "invalid-hostkey") return be("Host key is incorrect"); else if (n == "internal-error") return be("Internal error"); else if (n == "timeout") return be("Connection has timed out."); else if (n == "no-cockpit") return be("Cockpit is not installed on the system."); else if (n == "no-forwarding") return be("Cannot forward login credentials"); else if (n == "disconnected") return be("Server has closed the connection."); else if (n == "not-supported") return be("Cockpit is not compatible with the software on the system."); else if (n == "no-host") return be("Cockpit could not contact the given host."); else if (n == "too-large") return be("Too much data"); else return n;
        };
        function ye(e, n, t) {
            this.status = parseInt(e, 10);
            this.reason = n;
            this.message = t || n;
            this.problem = null;
            this.valueOf = function() {
                return this.status;
            };
            this.toString = function() {
                return this.status + " " + this.message;
            };
        }
        function ke() {
            if (window.debugging == "all" || window.debugging == "http") console.debug.apply(console, arguments);
        }
        function Ee(e, n) {
            if (!e) return undefined;
            n = n.toLowerCase();
            for (var t in e) {
                if (t.toLowerCase() == n) return e[t];
            }
            return undefined;
        }
        function _e(n, t) {
            var i = this;
            i.options = t;
            t.payload = "http-stream2";
            var o = [];
            if (n !== undefined) {
                if (n.indexOf && n.indexOf("/") === 0) {
                    t.unix = n;
                } else {
                    var s = parseInt(n, 10);
                    if (!isNaN(s)) t.port = s; else throw "The endpoint must be either a unix path or port number";
                }
            }
            if (t.address) {
                if (!t.capabilities) t.capabilities = [];
                t.capabilities.push("address");
            }
            function u(e) {
                return Object.keys(e).map(function(n) {
                    return encodeURIComponent(n) + "=" + encodeURIComponent(e[n]);
                }).join("&").split("%20").join("+");
            }
            i.request = function c(n) {
                var r = e.defer();
                var i = r.promise;
                if (!n.path) n.path = "/";
                if (!n.method) n.method = "GET";
                if (n.params) {
                    if (n.path.indexOf("?") === -1) n.path += "?" + u(n.params); else n.path += "&" + u(n.params);
                }
                delete n.params;
                var a = n.body;
                delete n.body;
                var s = n.headers;
                delete n.headers;
                f(n, t);
                if (t.headers && s) n.headers = f({}, t.headers, s); else if (t.headers) n.headers = t.headers; else n.headers = s;
                ke("http request:", JSON.stringify(n));
                var c = e.channel(n);
                if (a !== undefined) {
                    if (a !== "") {
                        ke("http input:", a);
                        c.send(a);
                    }
                    ke("http done");
                    c.control({
                        command: "done"
                    });
                }
                var d = null;
                var v = null;
                var p = null;
                var h = c.buffer(function(e) {
                    if (p && p.status >= 200 && p.status <= 299 && d) return d.call(i, e);
                    return 0;
                });
                function m(e, n) {
                    if (n.command == "response") {
                        p = n;
                        if (v) {
                            p.headers = p.headers || {};
                            l(v, i, [ p.status, p.headers ]);
                        }
                    }
                }
                function g(e, n) {
                    var t = o.indexOf(i);
                    if (t >= 0) o.splice(t, 1);
                    if (n.problem) {
                        ke("http problem: ", n.problem);
                        r.reject(new te(n.problem));
                    } else {
                        var a = h.squash();
                        if (p && (p.status < 200 || p.status > 299)) {
                            var s;
                            var f = Ee(p.headers, "Content-Type");
                            if (f && !c.binary) {
                                if (f.indexOf("text/plain") === 0) s = a;
                            }
                            ke("http status: ", p.status);
                            r.reject(new ye(p.status, p.reason, s), a);
                        } else {
                            ke("http done");
                            r.resolve(a);
                        }
                    }
                    c.removeEventListener("control", m);
                    c.removeEventListener("close", g);
                }
                c.addEventListener("control", m);
                c.addEventListener("close", g);
                i.stream = function(e) {
                    d = e;
                    return i;
                };
                i.response = function(e) {
                    if (v === null) v = [];
                    v.push(e);
                    return i;
                };
                i.input = function(e, n) {
                    if (e !== null && e !== undefined) {
                        ke("http input:", e);
                        c.send(e);
                    }
                    if (!n) {
                        ke("http done");
                        c.control({
                            command: "done"
                        });
                    }
                    return i;
                };
                i.close = function(e) {
                    ke("http closing:", e);
                    c.close(e);
                    return i;
                };
                o.push(i);
                return i;
            };
            i.get = function d(e, n, t) {
                return i.request({
                    method: "GET",
                    params: n,
                    path: e,
                    body: "",
                    headers: t
                });
            };
            i.post = function v(e, n, t) {
                t = t || {};
                if (a(n) || r(n)) {
                    n = JSON.stringify(n);
                    if (Ee(t, "Content-Type") === undefined) t["Content-Type"] = "application/json";
                } else if (n === undefined || n === null) {
                    n = "";
                } else if (typeof n !== "string") {
                    n = String(n);
                }
                return i.request({
                    method: "POST",
                    path: e,
                    body: n,
                    headers: t
                });
            };
            i.close = function p(e) {
                var n = o.slice();
                for (var t = 0; t < n.length; t++) n[t].close(e);
            };
        }
        e.http = function(e, n) {
            if (a(e) && n === undefined) {
                n = e;
                e = undefined;
            }
            return new _e(e, n || {});
        };
        var Se = null;
        function xe(n) {
            var t = this;
            O(t, {});
            t.allowed = null;
            t.user = n ? n.user : null;
            var r = null;
            var i = false;
            if (n) r = n.group;
            if (n && n.admin) i = true;
            function o(e) {
                if (e.id === 0) return true;
                if (e.groups) {
                    var n = false;
                    e.groups.forEach(function(e) {
                        if (e == r) {
                            n = true;
                            return false;
                        }
                        if (i && (e == "wheel" || e == "sudo")) {
                            n = true;
                            return false;
                        }
                    });
                    return n;
                }
                if (e.id === undefined) return null;
                return false;
            }
            if (t.user) {
                t.allowed = o(t.user);
            } else {
                e.user().done(function(e) {
                    t.user = e;
                    var n = o(e);
                    if (t.allowed !== n) {
                        t.allowed = n;
                        t.dispatchEvent("changed");
                    }
                });
            }
            t.close = function a() {};
        }
        e.permission = function cn(e) {
            return new xe(e);
        };
        function je(e, n) {
            if (typeof e == "number") return e * n; else if (typeof e == "string") e = new Date(e);
            if (e instanceof Date) return e.getTime(); else throw "invalid date or offset";
        }
        function Oe(n, t, r) {
            var i = this;
            O(i, {});
            if (t.length === undefined) t = [ t ];
            var o = [];
            var a = false;
            i.series = e.series(n, r, s);
            i.archives = null;
            i.meta = null;
            function s(e, n, t) {
                if (!t) i.fetch(e, n); else i.follow();
            }
            function l(t, r, s) {
                if (t.length === 0) return;
                if (!s) {
                    if (a) return;
                    a = true;
                }
                var u = f({
                    payload: "metrics1",
                    interval: n,
                    source: "internal"
                }, t[0]);
                delete u.archive_source;
                var c = e.channel(u);
                o.push(c);
                var d = null;
                var v = null;
                var p;
                c.addEventListener("close", function(e, n) {
                    if (!s) a = false;
                    if (t.length > 1 && (n.problem == "not-supported" || n.problem == "not-found")) {
                        l(t.slice(1), r);
                    } else if (n.problem) {
                        if (n.problem != "terminated" && n.problem != "disconnected" && n.problem != "authentication-failed" && (n.problem != "not-found" || !s) && (n.problem != "not-supported" || !s)) {
                            console.warn("metrics channel failed: " + n.problem);
                        }
                    } else if (s) {
                        if (!i.archives) {
                            i.archives = true;
                            i.dispatchEvent("changed");
                        }
                    }
                });
                c.addEventListener("message", function(e, o) {
                    var a = JSON.parse(o);
                    var s, f, l, u, c, h, m;
                    var g, w, b;
                    var y;
                    var k = a.length;
                    if (k === undefined) {
                        d = a;
                        y = 0;
                        if (d.now && d.timestamp) y = d.timestamp + (Date.now() - d.now);
                        p = Math.floor(y / n);
                        r(p, d, null, t[0]);
                        i.meta = d;
                        i.dispatchEvent("changed");
                    } else if (d) {
                        for (g = 0; g < k; g++) {
                            s = a[g];
                            if (v) {
                                f = s.length;
                                l = v.length;
                                for (w = 0; w < l; w++) {
                                    u = s[w];
                                    if (u === null || u === undefined) {
                                        s[w] = v[w];
                                    } else {
                                        c = u.length;
                                        if (c !== undefined) {
                                            h = v[w];
                                            m = v[w].length;
                                            for (b = 0; b < c; b++) {
                                                if (u[b] === null) u[b] = h[b];
                                            }
                                            for (;b < m; b++) u[b] = h[b];
                                        }
                                    }
                                }
                            }
                            v = s;
                        }
                        r(p, d, a, t[0]);
                        p += k;
                        d.timestamp += n * k;
                    }
                });
            }
            function u(e, n, t, r) {
                var o, a, s;
                o = n.mapping;
                if (!o) {
                    o = {};
                    n.metrics.forEach(function(e, n) {
                        a = {
                            "": n
                        };
                        if (r.metrics_path_names) s = r.metrics_path_names[n]; else s = e.name;
                        o[s] = a;
                        if (e.instances) {
                            e.instances.forEach(function(e, n) {
                                if (e === "") e = "/";
                                a[e] = {
                                    "": n
                                };
                            });
                        }
                    });
                    n.mapping = o;
                }
                if (t) i.series.input(e, t, o);
            }
            i.fetch = function c(e, r) {
                var i = e * n - Date.now();
                var o = r - e;
                var a = [];
                for (var s = 0; s < t.length; s++) {
                    if (t[s].archive_source) {
                        a.push(f({}, t[s], {
                            source: t[s].archive_source,
                            timestamp: i,
                            limit: o
                        }));
                    }
                }
                l(a, u, true);
            };
            i.follow = function d() {
                l(t, u);
            };
            i.close = function v(e) {
                var n, t = o.length;
                for (n = 0; n < t; n++) o[n].close(e);
            };
        }
        e.metrics = function dn(e, n) {
            return new Oe(e, n);
        };
        e.oops = function vn() {
            if (window.parent !== window && window.name.indexOf("cockpit1:") === 0) window.parent.postMessage('\n{ "command": "oops" }', b);
        };
        var Le;
        if (window.navigator.userAgent.indexOf("PhantomJS") == -1) {
            Le = window.onerror;
            window.onerror = function(n, t, r) {
                e.oops();
                if (Le) return Le(n, t, r);
                return false;
            };
        }
        return e;
    }
    var T;
    var D = document.scripts[document.scripts.length - 1].src || "";
    var R = D.indexOf("/cockpit.js");
    if (R === -1) R = D.indexOf("/cockpit.min.js");
    if (R !== -1) R = D.substring(0, R).lastIndexOf("/");
    if (R !== -1) {
        T = D.substring(R + 1, D.indexOf(".", R + 1));
        window.cockpit = P();
    }
    if (i(window.define) && window.define.amd) {
        if (T) define(T, [], window.cockpit); else define([], P);
    }
})();
//# sourceMappingURL=cockpit.min.js.map
