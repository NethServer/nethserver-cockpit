'use strict';

/**
 * @ngdoc function
 * @name appsAngularApp.controller:DetailsCtrl
 * @description
 * # DetailsCtrl
 * Controller of the appsAngularApp
 */
angular.module('appsAngularApp')
  .controller('DetailsCtrl', function ($scope, $routeParams) {
    // view object
    $scope.view = {
      isLoaded: false
    };

    $scope.appNameRaw = $routeParams.app;
    $scope.appNameFull = $scope.applications.filter(function (a) {
      return a.id == $scope.appNameRaw;
    })[0].name;
    $scope.appURL = '/cockpit/@localhost/' + $scope.appNameRaw + '/index.html';

    $('#app-frame').load(function () {
      $scope.view.isLoaded = true;
      $scope.crumbs.push({
        name: 'Applications',
        url: '/'
      })
      $scope.crumbs.push({
        name: $scope.appNameFull,
        url: $scope.appURL
      });
      $('#app-frame').contents().find('body').bind('DOMSubtreeModified', function () {
        console.log("change " + new Date());
        if ($(this).hasClass("modal-open")) {
          $scope.initObjects.isFake = true;
        } else {
          $scope.initObjects.isFake = false;
        }
        $scope.$apply();
      });
      $scope.$apply();
    });
  });
