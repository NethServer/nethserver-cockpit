
nethserver.System.summary = {
  getHostname : function(successCb, errorCb) {
    cockpit.file("/etc/hostname").read().done(function (content) {
      successCb(content.trim());
    }).fail(errorCb).always(function () {
      cockpit.file("/etc/hostname").close();
    });
  },

  setHostname : function(hostname, successCb, errorCb) {
    var hostnameService = cockpit.dbus('org.freedesktop.hostname1');
    var hcdb = hostnameService.proxy();
    hcdb.wait(function () {
      hcdb.SetStaticHostname(hostname, false).done(function(res) {
        nethserver.signalEvent('hostname-modify', successCb, errorCb);
      }).fail(errorCb);
    });
  },

  getHardware: function(successCb, errorCb) {
    cockpit.spawn(["grep", "\\w", "sys_vendor", "product_name"], {
        directory: "/sys/devices/virtual/dmi/id",
        err: "ignore"
      })
      .done(function(output) {
        var fields = nethserver.parseLines(output);
        successCb(fields.sys_vendor + " " + fields.product_name);
      })
      .fail(errorCb);
  },

  getMachineId : function(successCb, errorCb) {
    cockpit.file("/etc/machine-id").read().done(successCb)
    .fail(errorCb)
    .always(function () {
      cockpit.file("/etc/machine-id").close();
    });
  },

  getOS : function(successCb, errorCb) {
    cockpit.file("/etc/nethserver-release").read().done(successCb)
    .fail(errorCb).always(function () {
      cockpit.file("/etc/nethserver-release").close();
    });
  },

  getTimezones : function(successCb, errorCb) {
    cockpit.spawn(["/usr/bin/timedatectl", "list-timezones"])
    .done(function(res) {
      successCb(res.split("\n"));
    }).fail(errorCb);
  },

  getSystemTimezone : function(successCb, errorCb) {
    var timeDateService = cockpit.dbus('org.freedesktop.timedate1');
    var hcdb = timeDateService.proxy();
    hcdb.wait(function () {
      if (hcdb.Timezone) {
        successCb(hcdb.Timezone)
      } else {
        errorCb();
      }
    });
  },

  getTimeMode : function(successCb, errorCb) {
    //TODO
  },

  getNtpServer : function(successCb, errorCb) {
    //TODO
  },

  getSystemTime : function(successCb, errorCb) {
    cockpit.spawn(['date', '+%F %H:%M'], {
        'superuser': 'require'
      }).done(successCb).fail(errorCb);
  },

  setSystemTime : function(val, successCb, errorCb) {

  }
};