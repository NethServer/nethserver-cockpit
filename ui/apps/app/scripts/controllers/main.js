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
      $scope.applications = [];
      nethserver.applications.getApplications().then(function (applications) {
        $scope.view.isLoaded = true;

        $scope.applications = applications;
        $scope.$apply();
      }, function (err) {
        console.error("couldn't read applications list: " + err);
      });
    };
    $scope.crumbs.push({
      name: 'Applications',
      url: '/'
    });

    $scope.initApps();
  });
