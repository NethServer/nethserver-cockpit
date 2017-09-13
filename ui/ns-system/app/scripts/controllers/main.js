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
    $scope.localSystem = {};

    $scope.service = cockpit.dbus('org.freedesktop.systemd1')
    $scope.cdb = $scope.service.proxy('org.freedesktop.systemd1.Manager', '/org/freedesktop/systemd1');

    $scope.cdb.wait(function () {
      // do things here...
    });

    // retrieve base system info
    // -- Hardware --
    nethserver.System.summary.getHardware(function(info) {
      $scope.localSystem.hardware = info;

      // applying scope
      $scope.$apply();
    }, function(err) {
      console.error("couldn't read dmi info: " + err);
    });

    // -- Machine ID --
    nethserver.System.summary.getMachineId(function(info) {
      $scope.localSystem.machineId = info;

      // applying scope
      $scope.$apply();
    }, function(err) {
      console.error("Error reading machine id", err);
    });

    // -- Operating system --
    nethserver.System.summary.getOS(function(info) {
      $scope.localSystem.osRelease = info;

      // applying scope
      $scope.$apply();
    }, function(err) {
      console.error("Error reading os release", err);
    });

    // -- Hostname --
    nethserver.System.summary.getHostname(function(hostname) {
      $scope.localSystem.hostname = hostname;
    }, function(err) {
      console.error(err);
    });

    // -- Datetime --
    nethserver.System.summary.getSystemTime(function(info) {
      $scope.localSystem.datetime = info;

      // applying scope
      $scope.$apply();
    }, function(err) {
      console.error("couldn't read datetime: " + err);
    });

    // -------------------------

    $scope.goTo = function (route) {
      $location.path(route);
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
      nethserver.System.summary.setHostname(hostname, function() {
        $('#hostnameChangeModal').modal('hide');
        $scope.localSystem.hostname = hostname;
        $scope.$apply();
      }, function(err) {
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

    $scope.initRoutes();
  });
