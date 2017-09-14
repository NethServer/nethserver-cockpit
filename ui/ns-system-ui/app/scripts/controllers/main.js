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
    $scope.isLoaded = false;
    $scope.allRoutes = [];
    $scope.systimeTypes = {
      'manually': 'Manually',
      'ntp': 'Using NTP server',
    };
    $scope.localSystem = {};

    // retrieve base system info
    // -- Hardware --
    nethserver.System.summary.getHardware(function (info) {
      $scope.localSystem.hardware = info;

      // applying scope
      $scope.$apply();
    }, function (err) {
      console.error("couldn't read dmi info: " + err);
    });

    // -- Machine ID --
    nethserver.System.summary.getMachineId(function (info) {
      $scope.localSystem.machineId = info;

      // applying scope
      $scope.$apply();
    }, function (err) {
      console.error("Error reading machine id", err);
    });

    // -- Operating system --
    nethserver.System.summary.getOS(function (info) {
      $scope.localSystem.osRelease = info;

      // applying scope
      $scope.$apply();
    }, function (err) {
      console.error("Error reading os release", err);
    });

    // -- Hostname --
    nethserver.System.summary.getHostname(function (hostname) {
      $scope.localSystem.hostname = hostname;
    }, function (err) {
      console.error(err);
    });

    // -- Datetime --
    nethserver.System.summary.getSystemTime(function (info) {
      var datetime = info.trim().split(' ');
      $scope.localSystem.date = datetime[0];
      $scope.localSystem.time = datetime[1];

      // applying scope
      $scope.$apply();
    }, function (err) {
      console.error("couldn't read datetime: " + err);
    });

    nethserver.System.summary.getSystemTimezone(function (timezone) {
      $scope.localSystem.timezone = timezone;

      // applying scope
      $scope.$apply();
    }, function (err) {
      console.error("couldn't read system timezone: " + err);
    });

    // -- Time zones --
    nethserver.System.summary.getTimezones(function (timezones) {
      $scope.localSystem.timezones = timezones;

      // applying scope
      $scope.$apply();
      $('.combobox').combobox();
    }, function (err) {
      console.error("couldn't read timezones: " + err);
    });

    // -- Time mode --
    nethserver.System.summary.getTimeMode(function (timeMode) {
      $scope.localSystem.timeMode = timeMode;

      // applying scope
      //$scope.$apply();
    }, function (err) {
      console.error("couldn't read time mode: " + err);
    });

    // -- NTP server --
    nethserver.System.summary.getNtpServer(function (ntpServer) {
      $scope.localSystem.ntpServer = ntpServer;

      // applying scope
      //$scope.$apply();
    }, function (err) {
      console.error("couldn't read ntp server: " + err);
    });

    $scope.goTo = function (route) {
      $location.path(route);
    };

    $scope.initGraphics = function () {
      $('#date-2').datepicker({
        autoclose: true,
        todayBtn: "linked",
        todayHighlight: true,
        format: 'yyyy-mm-dd'
      });
      $('#time-picker-2').datetimepicker({
        format: 'LT',
        keyBinds: {
          enter: function () {
            $('#time-picker-2').find('input').trigger('change');
            this.hide();
          }
        }
      }).on('dp.change', function (e) {
        var time = $('#time-picker-2').data().date.split(' ')[0];
        $scope.localSystem.newTime = time;
      });
    };

    $scope.initRoutes = function () {
      for (var i in $route.routes) {
        if (i !== 'null' && i.match(/.+[^/]$/)) {
          $scope.allRoutes.push({
            id: i,
            value: $route.routes[i]
          });
        }
      }
      $scope.isLoaded = true;
    };

    $scope.openChangeHostname = function () {
      $scope.localSystem.newHostname = $scope.localSystem.hostname;
    };
    $scope.changeHostname = function (hostname) {
      nethserver.System.summary.setHostname(hostname, function () {
        $('#hostnameChangeModal').modal('hide');
        $scope.localSystem.hostname = hostname;
        $scope.$apply();
      }, function (err) {
        console.error(err);
      });
    };

    $scope.openChangeSystime = function () {
      //$scope.localSystem.oldTimezone = $scope.localSystem.timezone;
      $scope.localSystem.newTimeMode = $scope.localSystem.timeMode;
      $scope.localSystem.newDate = $scope.localSystem.date;
      $scope.localSystem.newTime = $scope.localSystem.time;
    };
    $scope.changeSystime = function (value) {
      $scope.localSystem.newTimeMode = value;
    };
    $scope.saveSystime = function () {
      console.log($scope.localSystem);
      $('#systimeChangeModal').modal('hide');
      /* $scope.localSystem.date = '';
      $scope.localSystem.time = '';
      $scope.localSystem.timeMode = '';
      $scope.localSystem.timezone = '';
      $scope.$apply(); */
    };
    $scope.resetDateTime = function () {
      $scope.localSystem.timezone = $scope.localSystem.oldTimezone;
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
