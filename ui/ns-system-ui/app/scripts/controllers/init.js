'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:InitCtrl
 * @description
 * # InitCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('InitCtrl', function ($scope) {
    $('body').show();

    $scope.stats = {
      tasks: [{}],
      updates: [],
      errors: []
    };

    $scope.iconMap = {
      'info' : 'info',
      'error' : 'error-circle-o',
      'success' : 'ok',
      'warning' : 'warning-triangle-o'
    };

    $scope.notifications = [];

    $scope.addNotification = function (notification) {
      $scope.notifications.push(notification);
    }

    $scope.removeNotification = function (index) {
      $scope.notifications.splice(index, 1);
    }

    // $scope.addNotification({ message: 'test1', status: 'info', action: 'check',  url: 'http://www.patternfly.org' });
  });
