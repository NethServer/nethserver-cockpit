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

    // retrieve app name
    $scope.appNameRaw = $routeParams.app;
    $scope.appNameFull = $scope.applications.filter(function (a) {
      return a.id == $scope.appNameRaw;
    })[0].name;
    $scope.appURL = '/cockpit/@localhost/' + $scope.appNameRaw + '/index.html';

    // add crumb path
    $scope.crumbs.push({
      name: 'Applications',
      url: '/'
    })
    $scope.crumbs.push({
      name: $scope.appNameFull,
      url: $scope.appURL
    });

    // events listeners
    $('body').on('modalShow', function (e) {
      $scope.initObjects.isFake = true;
      $scope.$apply();
    });
    $('body').on('modalHide', function (e) {
      $scope.initObjects.isFake = false;
      $scope.$apply();
    });

    $('body').on('showNotification', function (e, notification) {
      $scope.notifications.add({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        status: notification.status,
      });
      $scope.$apply();
    });

    $('#app-frame').load(function () {
      $scope.view.isLoaded = true;
      $scope.$apply();
    });
  });
