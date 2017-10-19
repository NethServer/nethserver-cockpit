'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:LogsCtrl
 * @description
 * # LogsCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('LogsCtrl', function ($scope) {
    $scope.view = {
      isLoaded: false
    };

    $('#logs-frame').load(function () {
      $scope.view.isLoaded = true;
      $scope.$apply();
    });

    $scope.$on('$routeChangeStart', function (next, current) {
      $scope.initObjects.isFake = false;
    });
  });
