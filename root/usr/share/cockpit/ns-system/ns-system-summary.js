
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
  }
};