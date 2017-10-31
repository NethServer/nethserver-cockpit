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

    $('#logs-frame').on('load', function () {
      $scope.view.isLoaded = true;

      // select the target node
      var target = document.querySelector('#logs-frame').contentDocument.body;
      $(target).css('background-color', '#f5f5f5');

      $scope.$apply();
    });

    $scope.$on('$routeChangeStart', function (next, current) {
      $scope.initObjects.isFake = false;
    });
  });
