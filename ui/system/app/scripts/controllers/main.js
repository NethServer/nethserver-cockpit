'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('MainCtrl', function ($scope, $route) {
    // $scope.service = cockpit.dbus('org.domain.dbusname')
    // $scope.cdb = $scope.service.proxy('org.domain.dbusname.ProxyName', '/org/domain/dbusname/ProxyName/configuration');
    //
    // $scope.cdb.wait(function () {
    //   // do things here...
    // });

    $scope.allRoutes = [];

    for (var i in $route.routes) {
      if (i !== 'null' && i.match(/.+[^/]$/)) {
        $scope.allRoutes.push({ id: i, value : $route.routes[i] });
      }
    }

    console.log($scope.allRoutes);
  });
