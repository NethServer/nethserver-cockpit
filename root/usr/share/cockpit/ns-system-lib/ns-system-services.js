
nethserver.System.services = {
    getAllServices : function(successCb, errorCb) {
      var arr = [
        { name: 'chronyd', description: 'Network time protocol', status: 'enabled', running: true, ports: { udp: [123] } },
        { name: 'collectd', description: 'System performance statistics collector', status: 'disabled', running: false },
        { name: 'dnsmasq', description: 'DNS and DHCP', status: 'enabled', running: true, ports: { udp: [53,67,69], tcp: [53] } },
        { name: 'asterisk', description: 'VoIP PBX', status: 'disabled', running: true, ports: { udp: [123] } },
        { name: 'janus-gateway', description: 'WebRTC daemon gateway', status: 'disabled', running: false },
        { name: 'postfix', description: 'SMTP', status: 'enabled', running: true, ports: { udp: [53,67,69], tcp: [53] } }
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