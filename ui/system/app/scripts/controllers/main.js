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
          $scope.notifications.add({
            type: 'info',
            title: $filter('translate')('Hostname changed'),
            message: $filter('translate')('Hostname changed with success'),
            status: 'success',
          });
          $scope.$apply();
        }, function (err) {
          $scope.notifications.add({
            type: 'info',
            title: $filter('translate')('Error'),
            message: $filter('translate')('Event failed'),
            status: 'danger',
          });
          $scope.$apply();
        });
      }

      // set aliases
      nethserver.system.dns.setAliases($scope.localSystem.summary.aliases.map(function (val) {
        return val.key;
      })).then(function () {
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Saved'),
          message: $filter('translate')('Aliases saved with success'),
          status: 'success',
        });
        $scope.getAllAliases();
      }, function (err) {
        console.error(err);
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Error'),
          message: $filter('translate')('Aliases not saved'),
          status: 'danger',
        });
        $scope.$apply();
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
      if(dns[0].dns.length > 0) {
        dnsToSave.push(dns[0].dns);
      }
      if(dns[1].dns.length > 0) {
        dnsToSave.push(dns[1].dns);
      }
      nethserver.system.dns.setDNS(dnsToSave).then(function () {
        $('#dnsChangeModal').modal('hide');
        $scope.localSystem.summary.dns = dnsToSave.map(function (val) {
          return {
            readDns: val,
            dns: val
          }
        });;
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Saved'),
          message: $filter('translate')('DNS servers saved with success'),
          status: 'success',
        });
        $scope.$apply();
      }, function (err) {
        console.error(err);
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Error'),
          message: $filter('translate')('DNS servers not saved'),
          status: 'danger',
        });
        $scope.$apply();
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
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Saved'),
          message: $filter('translate')('System date and time saved with success'),
          status: 'success',
        });
        $scope.$apply();
      }, function (err) {
        console.error(err);
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Error'),
          message: $filter('translate')('System date and time not saved'),
          status: 'danger',
        });
        $scope.$apply();
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
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Saved'),
          message: $filter('translate')('Company info saved with success'),
          status: 'success',
        });
        $scope.$apply();
      }, function (err) {
        console.error(err);
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Error'),
          message: $filter('translate')('Company info not saved'),
          status: 'danger',
        });
        $scope.$apply();
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
            $scope.notifications.add({
              type: 'info',
              title: $filter('translate')('Error'),
              message: $filter('translate')('System not rebooted'),
              status: 'danger',
            });
            $scope.$apply();
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
            $scope.notifications.add({
              type: 'info',
              title: $filter('translate')('Error'),
              message: $filter('translate')('System not shutted down'),
              status: 'danger',
            });
            $scope.$apply();
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

    $scope.initGraphics();
    $scope.initRoutes();
  });
