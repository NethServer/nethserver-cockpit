'use strict';

/**
 * @ngdoc function
 * @name appsAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appsAngularApp
 */
angular.module('appsAngularApp')
  .controller('MainCtrl', function ($scope, $route, $location) {
    // view object
    $scope.view = {
      isLoaded: false
    };

    $scope.objects = {
      searchString: '',
    };

    $scope.initApps = function () {
      $scope.view.isLoaded = true;
    };
    $scope.crumbs.push({
      name: 'Applications',
      url: '/'
    });

    $scope.initApps();
  });
