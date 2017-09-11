var nethserver = {};

/*
 * Parses output like:
 *
 * bios_vendor:LENOVO
 * bios_version:8CET46WW
 */
nethserver.parseLines = function (output) {
    var ret = {};
    $.each(output.split("\n"), function (i, line) {
        var pos = line.indexOf(":");
        if (pos !== -1)
            ret[line.substring(0, pos)] = line.substring(pos + 1);
    });
    return ret;
};

/*
 * Exec a signal event action:
 */
nethserver.signalEvent = function (event, successCallback, errorCallback) {
    cockpit.spawn(['systemd-run', '/sbin/e-smith/signal-event', event], {
            'superuser': 'require'
        }).done(successCallback)
        .fail(errorCallback);
};