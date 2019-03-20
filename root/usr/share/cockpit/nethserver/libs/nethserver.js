var ns = window.ns || parent.window.ns
nethserver = {
    exec(args, input, stream, success, error, superuser = true) {
        var systemCheck = false

        function isJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        var api = args[0]

        if (superuser) {
            args[0] = "/usr/bin/sudo"
            args[1] = "/usr/libexec/nethserver/api/" + api
        } else {
            args[0] = "/usr/libexec/nethserver/api/" + api
        }

        var process = cockpit.spawn(args);

        if (input) {
            process.input(JSON.stringify(input))
        }

        console.info("%cAPI exec: " + api + "\n%c$ " + (input ? " echo '" + JSON.stringify(input) + "' | " : "") + args.join(' ') + " | jq", "background: #1f2123; color: yellow;", "background: #1f2123; color: white; font-size: large, font-family: 'monospace';")

        if (stream) {
            process.stream(function (data) {
                ns.$children[0].notifications.success.show = false
                ns.$children[0].notifications.error.show = false
                ns.$children[0].notifications.event.progress = 0
                ns.$children[0].taskInProgress = true

                var pieces = data.replace(/\n|\r/g, "").split("}");
                pieces.pop()
                for (var p in pieces) {
                    var c = pieces[p] + "}";
                    c = c.replace(/\n|\r/g, "");
                    var j = c !== "}" && isJsonString(c) ? JSON.parse(c) : "{}";

                    if (j.event) {
                        ns.$children[0].notifications.event.show = true;

                        if (j.action && j.action != ns.$children[0].notifications.event.message) {
                            ns.$children[0].notifications.event.message = j.action;
                        }

                        if (j.event && j.event != ns.$children[0].notifications.event.name) {
                            ns.$children[0].notifications.event.name = j.event;
                        }

                        var progress = parseFloat(j.progress);
                        if (
                            !isNaN(progress) && progress * 100 > ns.$children[0].notifications.event.progress
                        ) {
                            systemCheck = false
                            ns.$children[0].notifications.event.steps = 0
                            ns.$children[0].notifications.event.progress = Math.round(progress * 100)
                        }

                        ns.$children[0].notifications.event.steps = j.steps
                        ns.$children[0].notifications.event.progress = j.steps == -1 ? 100 : ns.$children[0].notifications.event.progress
                    }

                    if (j.status == "failed" || j.status == "success" || j.message == "no running tasks") {
                        setTimeout(function () {
                            ns.$children[0].notifications.event.show = false;
                            ns.$children[0].notifications.event.message = "";
                            ns.$children[0].notifications.event.name = ""
                        }, 500)
                        stream(j.status)
                    }

                    if (j.steps == -1) {
                        systemCheck = true
                        stream(j.message)
                    }
                }
            })
        }
        process.done(function (successResp) {
            if (stream && !systemCheck) {
                ns.$children[0].notifications.success.show = true
                ns.$children[0].notifications.success.message = nethserver.notifications.success || null
                setTimeout(function () {
                    ns.$children[0].notifications.success.show = false;
                }, 3000)
                ns.$children[0].notifications.error.show = false
                ns.$children[0].taskInProgress = false
            }
            success(successResp)
        }).
        fail(function (errorResp, errorData) {
            if (stream) {
                ns.$children[0].notifications.success.show = false
                ns.$children[0].notifications.error.show = true
                ns.$children[0].notifications.error.message = nethserver.notifications.error || null
                ns.$children[0].taskInProgress = false
            }
            error(errorResp, errorData)
        });
    },
    execRaw(args, input, stream, success, error, superuser = true) {
        var api = args[0]

        if (superuser) {
            args[0] = "/usr/bin/sudo"
            args[1] = "/usr/libexec/nethserver/api/" + api
        } else {
            args[0] = "/usr/libexec/nethserver/api/" + api
        }

        var process = cockpit.spawn(args);

        if (input) {
            process.input(JSON.stringify(input))
        }

        console.info("%cAPI execRaw: " + api + "\n%c$ " + (input ? " echo '" + JSON.stringify(input) + "' | " : "") + args.join(' ') + " | jq", "background: #1f2123; color: yellow;", "background: #1f2123; color: white; font-size: large, font-family: 'monospace';")

        if (stream) {
            process.stream(stream)
        }
        process.done(success).
        fail(function (errorResp, errorData) {
            error(errorResp, errorData)
        });
    },
    execHints(packName, success, error) {
        var process = cockpit.spawn(["/usr/bin/sudo", "/usr/libexec/nethserver/api/" + packName + "/hints"]);
        process.done(function (successResp) {
            success(JSON.parse(successResp))
        }).
        fail(function (errorResp, errorData) {
            error(errorResp, errorData)
        });
    },
    readLogs(input, stream, success, error, superuser = true) {
        var args = []

        if (superuser) {
            args[0] = "/usr/bin/sudo"
            args[1] = "/usr/libexec/nethserver/api/system-logs/execute"
        } else {
            args[0] = "/usr/libexec/nethserver/api/system-logs/execute"
        }

        var process = cockpit.spawn(args);

        if (input) {
            process.input(JSON.stringify(input))
        }

        console.info("%cAPI logs: system-logs/execute\n%c$ " + (input ? " echo '" + JSON.stringify(input) + "' | " : "") + args.join(' ') + " | jq", "background: #1f2123; color: yellow;", "background: #1f2123; color: white; font-size: large, font-family: 'monospace';")

        if (stream) {
            process.stream(stream)
        }
        process.done(success).
        fail(function (errorResp, errorData) {
            error(errorResp, errorData)
        });

        return process
    },
    fetchTranslatedStrings(callback = null) {
        var context = this;
        return jQuery.getJSON('./i18n/language.json', {}, function(data) {
            if(callback) {
                cockpit.spawn(['/usr/bin/printenv', 'LANG'])
                .done(function(lang) {
                    callback.call(context, data, lang.trim());
                })
            }
        });
    },
    notifications: {
        success: null,
        error: null
    }
};
