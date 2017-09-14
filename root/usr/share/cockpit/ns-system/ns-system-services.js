
nethserver.System.services = {
  getAllServices : function(successCb, errorCb) {
    var arr = [
      { name: 'chronyd', status: 'enabled', running: true, ports: { udp: [123] } },
      { name: 'collectd', status: 'disabled', running: false },
      { name: 'dnsmasq', status: 'enabled', running: true, ports: { udp: [53,67,69], tcp: [53] } }
    ];

    successCb(arr);
  },

  enableService : function(successCb, errorCb) {
    //TODO
  },

  disableService : function(successCb, errorCb) {
    //TODO
  },

  startService : function(successCb, errorCb) {
    //TODO
  },

  stopService : function(successCb, errorCb) {
    //TODO
  },

  restartService : function(successCb, errorCb) {
    //TODO
  }
};