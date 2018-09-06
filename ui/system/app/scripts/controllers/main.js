'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('MainCtrl', function ($scope, $route, $location, $filter) {
    // view object
    $scope.view = {
      isLoaded: false
    };

    // controller objects
    $scope.objects = {
      allRoutes: [],
      blacklistRoutes: ['/disk-usage', '/logs', '/storage'],
      systimeTypes: {
        'manual': $filter('translate')('Manual'),
        'ntp': $filter('translate')('Using NTP server'),
      },
      actualPower: ''
    };

    $scope.localSystem.summary = {};

    // retrieve base system info
    // -- Hardware --
    nethserver.system.summary.getHardware().then(function (info) {
      $scope.localSystem.summary.hardware = info;

      $scope.$apply();
    }, function (err) {
      console.error("couldn't read dmi info: " + err);
    });

    // -- kernel release --
    nethserver.system.summary.getKernelRelease().then(function (kernel) {
      $scope.localSystem.summary.kernelRelease = kernel;

      $scope.$apply();
    }, function (err) {
      console.error("Error reading kernel release", err);
    });

    // -- Operating system --
    nethserver.system.summary.getOS().then(function (info) {
      $scope.localSystem.summary.osRelease = info;

      $scope.$apply();
    }, function (err) {
      console.error("Error reading os release", err);
    });

    // -- Hostname --
    nethserver.system.summary.getHostname().then(function (hostname) {
      $scope.localSystem.summary.hostname = hostname;

      $scope.$apply();
    }, function (err) {
      console.error(err);
    });

    // -- DNS --
    nethserver.system.dns.getDNS().then(function (dns) {
      $scope.localSystem.summary.dns = dns.map(function (val) {
        return {
          readDns: val,
          dns: val
        }
      });

      $scope.$apply();
    }, function (err) {
      console.error(err);
    });

    // -- Datetime --
    nethserver.system.date.getDate().then(function (info) {
      var datetime = info.DateTime.trim().split(' ');
      $scope.localSystem.summary.date = datetime[0];
      $scope.localSystem.summary.time = datetime[1];

      $scope.localSystem.summary.newTimeZone = info.TimeZone;
      $scope.localSystem.summary.ntpServer = info.NTPServer;
      $scope.localSystem.summary.timeMode = info.NTPServer === false ? 'manual' : 'ntp';

      // -- Time zones --
      nethserver.system.date.getTimeZones().then(function (timezones) {
        $scope.localSystem.summary.timeZones = timezones;

        $scope.$apply();
        $('.combobox').combobox();
      });
    }, function (err) {
      console.error("couldn't read datetime: " + err);
    });

    // -- Aliases --
    $scope.getAllAliases = function () {
      nethserver.system.dns.getAllAliases().then(function (aliases) {
        $scope.localSystem.summary.aliases = aliases;
        $scope.$apply();
      }, function (err) {
        console.error("couldn't read aliases info: " + err);
      });
    };
    $scope.getAllAliases();

    // -- Company info --
    nethserver.system.organization.getInfo().then(function (organization) {
      $scope.localSystem.organization = organization;
      $scope.$apply();
    }, function (err) {
      console.error("couldn't read organization info: " + err);
    });

    // modal actions
    // -- hostname and alias
    $scope.openChangeHostname = function () {
      $scope.localSystem.summary.newHostname = $scope.localSystem.summary.hostname;
      $('#hostnameChangeModal').modal('show');
    };
    $scope.saveHostname = function (hostname) {
      $('#hostnameChangeModal').modal('hide');

      // set hostname
      if ($scope.localSystem.summary.hostname !== $scope.localSystem.summary.newHostname) {
        nethserver.system.summary.setHostname(hostname).then(function () {
          $scope.localSystem.summary.hostname = hostname;
          $scope.$apply();
        }, function (err) {});
      }

      // set aliases
      nethserver.system.dns.setAliases($scope.localSystem.summary.aliases.map(function (val) {
        return val.key;
      })).then(function () {}, function (err) {
        console.error(err);
      });

    };
    $scope.addAlias = function (alias) {
      $scope.localSystem.summary.aliases.push({
        isNew: true
      });
    };
    $scope.removeAlias = function (alias, index) {
      $scope.localSystem.summary.aliases.splice(index, 1);
    };

    // -- dns
    $scope.openChangeDNS = function () {
      $('#dnsChangeModal').modal('show');
    };
    $scope.saveDNS = function (dns) {
      var dnsToSave = [];
      if (dns[0].dns.length > 0) {
        dnsToSave.push(dns[0].dns);
      }
      if (dns[1].dns.length > 0) {
        dnsToSave.push(dns[1].dns);
      }
      nethserver.system.dns.setDNS(dnsToSave).then(function () {
        $('#dnsChangeModal').modal('hide');
        $scope.localSystem.summary.dns = dnsToSave.map(function (val) {
          return {
            readDns: val,
            dns: val
          }
        });
        $scope.$apply();
      }, function (err) {
        console.error(err);
      });
    };

    // -- system time
    $scope.openChangeSystime = function () {
      $scope.localSystem.summary.newTimeMode = $scope.localSystem.summary.timeMode;
      $scope.localSystem.summary.newDate = $scope.localSystem.summary.date;
      $scope.localSystem.summary.newTime = $scope.localSystem.summary.time;
      $scope.localSystem.summary.newNtpServer = $scope.localSystem.summary.ntpServer;
      $('#systimeChangeModal').modal('show');
    };
    $scope.changeSystime = function (value) {
      $scope.localSystem.summary.newTimeMode = value;
    };
    $scope.saveSystime = function () {
      nethserver.system.date.setDate({
        DateTime: $scope.localSystem.summary.newDate + ' ' + $scope.localSystem.summary.newTime,
        TimeZone: $scope.localSystem.summary.newTimeZone,
        NTPServer: $scope.localSystem.summary.newNtpServer
      }).then(function (info) {
        $('#systimeChangeModal').modal('hide');
      }, function (err) {
        console.error(err);
      });

    };

    // -- company info
    $scope.openChangeCompany = function () {
      $('#companyChangeModal').modal('show');
      $scope.localSystem.newOrganization = angular.copy($scope.localSystem.organization);
    };
    $scope.saveCompany = function (organization) {
      $('#companyChangeModal').modal('hide');

      nethserver.system.organization.saveInfo(organization).then(function () {
        $scope.localSystem.organization = organization;
        $scope.$apply();
      }, function (err) {
        console.error(err);
      });
    };

    // -- power actions
    $scope.openPowerModal = function (action) {
      $scope.objects.actualPower = action;
      $('#powerModal').modal('show');
    };
    $scope.powerActions = function (action) {
      switch (action) {
        case 'reboot':
          nethserver.system.power.reboot().then(function () {
            $scope.notifications.add({
              type: 'info',
              title: $filter('translate')('Reboot'),
              message: $filter('translate')('Rebooting the system...'),
              status: 'warning',
            });
            $scope.$apply();
          }, function (err) {
            console.error(err);
          });
          break;

        case 'poweroff':
          nethserver.system.power.poweroff().then(function () {
            $scope.notifications.add({
              type: 'info',
              title: $filter('translate')('Power off'),
              message: $filter('translate')('Shutting down the system...'),
              status: 'warning',
            });
            $scope.$apply();
          }, function (err) {
            console.error(err);
          });
          break;
      }
    };

    // init graphics method
    $scope.initGraphics = function () {
      $('#date-picker').datepicker({
        autoclose: true,
        todayBtn: "linked",
        todayHighlight: true,
        format: 'yyyy-mm-dd'
      });
      $('#time-picker').datetimepicker({
        format: 'LT',
        keyBinds: {
          enter: function () {
            $('#time-picker').find('input').trigger('change');
            this.hide();
          }
        }
      }).on('dp.change', function (e) {
        var time = $('#time-picker').data().date.split(' ')[0];
        $scope.localSystem.summary.newTime = time;
      });
    };
    $scope.initRoutes = function () {
      for (var i in $route.routes) {
        if (i !== 'null' && $scope.objects.blacklistRoutes.indexOf(i) == -1 && i.match(/.+[^/]$/)) {
          $scope.objects.allRoutes.push({
            id: i,
            value: $route.routes[i]
          });
        }
      }
      $scope.view.isLoaded = true;
    };

    $scope.initGraphs = function () {
      var series;
      /* CPU graph */
      var cpu_data = {
        direct: ["kernel.all.cpu.nice", "kernel.all.cpu.user", "kernel.all.cpu.sys"],
        internal: ["cpu.basic.nice", "cpu.basic.user", "cpu.basic.system"],
        units: "millisec",
        derive: "rate",
        factor: 0.1 // millisec / sec -> percent
      };

      var cpu_options = plotter.plot_simple_template();
      $.extend(cpu_options.yaxis, {
        tickFormatter: function (v) {
          return v.toFixed(0);
        },
        max: 100
      });
      this.cpu_plot = plotter.plot($("#server_cpu_graph"), 300);
      this.cpu_plot.set_options(cpu_options);
      series = this.cpu_plot.add_metrics_sum_series(cpu_data, {});

      /* Memory graph */

      var memory_data = {
        direct: ["mem.util.used"],
        internal: ["memory.used"],
        units: "bytes"
      };

      var memory_options = plotter.plot_simple_template();
      $.extend(memory_options.yaxis, {
        ticks: plotter.memory_ticks,
        tickFormatter: plotter.format_bytes_tick_no_unit
      });
      memory_options.setup_hook = function memory_setup_hook(pl) {
        var axes = pl.getAxes();
        $('#server_memory_unit').text(plotter.bytes_tick_unit(axes.yaxis));
      };

      this.memory_plot = plotter.plot($("#server_memory_graph"), 300);
      this.memory_plot.set_options(memory_options);
      series = this.memory_plot.add_metrics_sum_series(memory_data, {});

      /* Network graph */

      var network_data = {
        direct: ["network.interface.total.bytes"],
        internal: ["network.interface.tx", "network.interface.rx"],
        "omit-instances": ["lo"],
        units: "bytes",
        derive: "rate"
      };

      var network_options = plotter.plot_simple_template();
      $.extend(network_options.yaxis, {
        tickFormatter: plotter.format_bits_per_sec_tick_no_unit
      });
      network_options.setup_hook = function network_setup_hook(pl) {
        var axes = pl.getAxes();
        if (axes.yaxis.datamax < 100000)
          axes.yaxis.options.max = 100000;
        else
          axes.yaxis.options.max = null;
        axes.yaxis.options.min = 0;

        $('#server_network_traffic_unit').text(plotter.bits_per_sec_tick_unit(axes.yaxis));
      };

      this.network_plot = plotter.plot($("#server_network_traffic_graph"), 300);
      this.network_plot.set_options(network_options);
      series = this.network_plot.add_metrics_sum_series(network_data, {});

      /* Disk IO graph */

      var disk_data = {
        direct: ["disk.all.total_bytes"],
        internal: ["disk.all.read", "disk.all.written"],
        units: "bytes",
        derive: "rate"
      };

      var disk_options = plotter.plot_simple_template();
      $.extend(disk_options.yaxis, {
        ticks: plotter.memory_ticks,
        tickFormatter: plotter.format_bytes_per_sec_tick_no_unit
      });
      disk_options.setup_hook = function disk_setup_hook(pl) {
        var axes = pl.getAxes();
        if (axes.yaxis.datamax < 100000)
          axes.yaxis.options.max = 100000;
        else
          axes.yaxis.options.max = null;
        axes.yaxis.options.min = 0;

        $('#server_disk_io_unit').text(plotter.bytes_per_sec_tick_unit(axes.yaxis));
      };

      this.disk_plot = plotter.plot($("#server_disk_io_graph"), 300);
      this.disk_plot.set_options(disk_options);
      series = this.disk_plot.add_metrics_sum_series(disk_data, {});

      this.cpu_plot.start_walking();
      this.memory_plot.start_walking();
      this.disk_plot.start_walking();
      this.network_plot.start_walking();

      $(window).on('resize.server', {
        c: this.cpu_plot,
        m: this.memory_plot,
        d: this.disk_plot,
        n: this.network_plot
      }, function (response) {
        response.data.c.resize();
        response.data.m.resize();
        response.data.d.resize();
        response.data.n.resize();
      });
    };

    $scope.initGraphics();
    $scope.initRoutes();
    $scope.initGraphs();

    nethserver.eventMonitor.addEventListener('nsevent.succeeded', function (success) {
      $scope.getAllAliases();
    });
  });
