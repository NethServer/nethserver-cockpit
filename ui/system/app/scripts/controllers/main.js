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
    nethserver.System.summary.getHardware().done(function (info) {
      $scope.localSystem.summary.hardware = info;

      $scope.$apply();
    }).fail(function (err) {
      console.error("couldn't read dmi info: " + err);
    });

    // -- Machine ID --
    nethserver.System.summary.getMachineId().done(function (info) {
      $scope.localSystem.summary.machineId = info;

      $scope.$apply();
    }).fail(function (err) {
      console.error("Error reading machine id", err);
    });

    // -- Operating system --
    nethserver.System.summary.getOS().done(function (info) {
      $scope.localSystem.summary.osRelease = info;

      $scope.$apply();
    }).fail(function (err) {
      console.error("Error reading os release", err);
    });

    // -- Hostname --
    nethserver.System.summary.getHostname().done(function (hostname) {
      $scope.localSystem.summary.hostname = hostname;

      $scope.$apply();
    }).fail(function (err) {
      console.error(err);
    });

    // -- Datetime --
    nethserver.System.summary.getSystemTime().done(function (info) {
      var datetime = info.trim().split(' ');
      $scope.localSystem.summary.date = datetime[0];
      $scope.localSystem.summary.time = datetime[1];

      $scope.$apply();
    }).fail(function (err) {
      console.error("couldn't read datetime: " + err);
    });

    // -- System timezone --
    nethserver.System.summary.getSystemTimeZone().done(function (timezone) {
      $scope.localSystem.summary.timezone = timezone;

      $scope.$apply();
    }).fail(function (err) {
      console.error("couldn't read system timezone: " + err);
    });

    // -- Time zones --
    nethserver.System.summary.getTimeZones().done(function (timezones) {
      $scope.localSystem.summary.timezones = timezones;

      $scope.$apply();
      $('.combobox').combobox();
    }).fail(function (err) {
      console.error("couldn't read timezones: " + err);
    });

    // -- Time mode --
    nethserver.System.summary.getSystemTimeMode().done(function (timeMode) {
      $scope.localSystem.summary.timeMode = timeMode;

      //$scope.$apply();
    }).fail(function (err) {
      console.error("couldn't read time mode: " + err);
    });

    // -- NTP server --
    nethserver.System.summary.getNTPServer().done(function (ntpServer) {
      $scope.localSystem.summary.ntpServer = ntpServer;

      //$scope.$apply();
    }).fail(function (err) {
      console.error("couldn't read ntp server: " + err);
    });

    // -- Aliases --
    nethserver.System.summary.getSystemAliases().done(function (ntpServer) {
      $scope.localSystem.summary.ntpServer = ntpServer;

      //$scope.$apply();
    }).fail(function (err) {
      console.error("couldn't read ntp server: " + err);
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
        if (i !== 'null' && i.match(/.+[^/]$/)) {
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
    };
    $scope.changeHostname = function (hostname) {
      nethserver.System.summary.setHostname(hostname, function () {
        $('#hostnameChangeModal').modal('hide');
        $scope.localSystem.summary.hostname = hostname;
        $scope.$apply();
      }, function (err) {
        console.error(err);
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
