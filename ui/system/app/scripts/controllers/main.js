'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('MainCtrl', function ($scope, $route, $location) {
    // view object
    $scope.view = {
      isLoaded: false
    };

    // controller objects
    $scope.objects = {
      allRoutes: [],
      blacklistRoutes: ['/disk-usage'],
      systimeTypes: {
        'manually': 'Manually',
        'ntp': 'Using NTP server',
      }
    };

    $scope.localSystem.summary = {};
    $scope.localSystem.summary.aliases = [{
      name: 'alias.test1'
    }, {
      name: 'alias.test2'
    }, {
      name: 'alias.test3'
    }];

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

    // -- Datetime --
    nethserver.system.summary.getSystemTime().then(function (info) {
      var datetime = info.trim().split(' ');
      $scope.localSystem.summary.date = datetime[0];
      $scope.localSystem.summary.time = datetime[1];

      $scope.$apply();
    }, function (err) {
      console.error("couldn't read datetime: " + err);
    });

    // -- System timezone --
    nethserver.system.summary.getSystemTimeZone().then(function (timezone) {
      $scope.localSystem.summary.timezone = timezone;

      // -- Time zones --
      return nethserver.system.summary.getTimeZones().then(function (timezones) {
        $scope.localSystem.summary.timezones = timezones;

        $scope.$apply();
        $('.combobox').combobox();
      });

    });



    // -- Time mode --
    nethserver.system.summary.getSystemTimeMode().then(function (timeMode) {
      $scope.localSystem.summary.timeMode = timeMode;

      //$scope.$apply();
    }, function (err) {
      console.error("couldn't read time mode: " + err);
    });

    // -- NTP server --
    nethserver.system.summary.getNTPServer().then(function (ntpServer) {
      $scope.localSystem.summary.ntpServer = ntpServer;

      //$scope.$apply();
    }, function (err) {
      console.error("couldn't read ntp server: " + err);
    });

    // -- Aliases --
    nethserver.system.summary.getSystemAliases().then(function (ntpServer) {
      $scope.localSystem.summary.ntpServer = ntpServer;

      //$scope.$apply();
    }, function (err) {
      console.error("couldn't read ntp server: " + err);
    });

    // -- Company info --
    nethserver.system.organization.getInfo().then(function (organization) {
      $scope.localSystem.organization = organization;
      $scope.$apply();
    }, function (err) {
      console.error("couldn't read organization info: " + err);
    });


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

    $scope.openChangeHostname = function () {
      $scope.localSystem.summary.newHostname = $scope.localSystem.summary.hostname;
      $('#hostnameChangeModal').modal('show');
    };
    $scope.changeHostname = function (hostname) {
      $('#hostnameChangeModal').modal('hide');

      // TODO: define $scope.taskNotification singleton
      var taskNotification = $scope.addNotification({
        type: 'task',
        title: 'Event hostname-modify',
        message: 'Applying new host name',
        status: 'warning',
        action: 'check',
        progress: 10,
      });

      nethserver.system.summary.setHostname(hostname).then(function () {
        $scope.localSystem.summary.hostname = hostname;
        $scope.$apply();
      }, function (err) {
        // TODO: define err as an object containing the unitName
        // TODO: define an API to retrieve error details from "journalctl -u unitName"

        // XXX: $scope.taskNotification.close()
        $scope.addNotification({
          type: 'info',
          title: 'Error',
          message: 'Event failed',
          status: 'danger',
        });
        $scope.$apply();
      }).then(function () {
        // XXX: $scope.taskNotification.close()
        $scope.addNotification({
          type: 'info',
          title: 'Host name changed',
          status: 'success',
        });
        $scope.$apply();
      });
    };

    $scope.addAlias = function (alias) {
      $scope.localSystem.summary.aliases.push({
        name: alias
      });
    };
    $scope.removeAlias = function (aliasIndex) {
      $scope.localSystem.summary.aliases.splice(aliasIndex, 1);
    };

    $scope.openChangeSystime = function () {
      //$scope.localSystem.summary.oldTimezone = $scope.localSystem.summary.timezone;
      $scope.localSystem.summary.newTimeMode = $scope.localSystem.summary.timeMode;
      $scope.localSystem.summary.newDate = $scope.localSystem.summary.date;
      $scope.localSystem.summary.newTime = $scope.localSystem.summary.time;
      $('#systimeChangeModal').modal('show');
    };
    $scope.changeSystime = function (value) {
      $scope.localSystem.summary.newTimeMode = value;
    };
    $scope.saveSystime = function () {
      $('#systimeChangeModal').modal('hide');
      /* $scope.localSystem.summary.date = '';
      $scope.localSystem.summary.time = '';
      $scope.localSystem.summary.timeMode = '';
      $scope.localSystem.summary.timezone = '';
      $scope.$apply(); */
    };
    $scope.resetDateTime = function () {
      $scope.localSystem.summary.timezone = $scope.localSystem.summary.oldTimezone;
    };

    $scope.openChangeCompany = function () {
      $('#companyChangeModal').modal('show');
      $scope.localSystem.newOrganization = angular.copy($scope.localSystem.organization);
    };
    $scope.changeCompany = function (organization) {
      nethserver.system.organization.saveInfo(organization).then(function () {
        $scope.localSystem.organization = organization;
        $('#companyChangeModal').modal('hide');
      }, function (err) {
        console.error(err);

      });
    };

    $scope.powerActions = function (action) {
      switch (action) {
        case 'restart':
          break;

        case 'shutdown':
          break;
      }
    };

    $scope.initGraphics();
    $scope.initRoutes();
  });
