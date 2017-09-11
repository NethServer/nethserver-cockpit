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
    cockpit.spawn(["grep", "\\w", "sys_vendor", "product_name"], {
        directory: "/sys/devices/virtual/dmi/id",
        err: "ignore"
      })
      .done(function (output) {
        var fields = nethserver.parseLines(output);
        $scope.localSystem.hardware = fields.sys_vendor + " " + fields.product_name;

        // applying scope
        $scope.$apply();
      })
      .fail(function (ex) {
        console.error("couldn't read dmi info: " + ex);
      });
    // -- Machine ID --
    cockpit.file("/etc/machine-id").read().done(function (content) {
      $scope.localSystem.machineId = content;
      // applying scope
      $scope.$apply();
    }).fail(function (ex) {
      console.error("Error reading machine id", ex);
    }).always(function () {
      cockpit.file("/etc/machine-id").close();
    });
    // -- Operating system --
    cockpit.file("/etc/nethserver-release").read().done(function (content) {
      $scope.localSystem.osRelease = content;
      // applying scope
      $scope.$apply();
    }).fail(function (ex) {
      console.error("Error reading os release", ex);
    }).always(function () {
      cockpit.file("/etc/nethserver-release").close();
    });
    // -- Hostname --
    cockpit.file("/etc/hostname").read().done(function (content) {
      $scope.localSystem.hostname = content;
      // applying scope
      $scope.$apply();
    }).fail(function (ex) {
      console.error("Error reading hostname", ex);
    }).always(function () {
      cockpit.file("/etc/hostname").close();
    });
    // -- Datetime --
    cockpit.spawn(['date', '+%F %H:%M'], {
        'superuser': 'require'
      }).done(function (output) {
        $scope.localSystem.datetime = output;

        // applying scope
        $scope.$apply();
      })
      .fail(function (ex) {
        console.error("couldn't read datetime: " + ex);
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
