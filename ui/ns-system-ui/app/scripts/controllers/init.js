'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:InitCtrl
 * @description
 * # InitCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('InitCtrl', function ($scope, $route, $location) {
    $('body').show();

    $scope.stats = {
      tasks: [{}],
      updates: [],
      errors: []
    };

    $scope.crumbs = [];

    $scope.iconMap = {
      'info': 'info',
      'danger': 'error-circle-o',
      'success': 'ok',
      'warning': 'warning-triangle-o'
    };

    $scope.notifications = [];

    $scope.addNotification = function (notification) {
      $scope.notifications.push(notification);
    }

    $scope.removeNotification = function (index) {
      $scope.notifications.splice(index, 1);
    }

    $scope.$on('$routeChangeSuccess', function (next, current) {
      var name = $route.routes[$location.path()];
      var crumbs = name.originalPath === '/' ? [""] : name.originalPath.split('/');
      $scope.crumbs = crumbs.map(v => ({
        name: $route.routes['/' + v].name,
        url: '/' + v
      }));
    });

    $scope.addNotification({
      type: 'task',
      message: 'Expand-template /etc/hosts',
      status: 'warning',
      action: 'check',
      progress: 76,
      url: 'http://www.patternfly.org'
    });
    $scope.addNotification({
      type: 'action',
      message: 'sshd is stopped',
      status: 'danger',
      action: 'Restart',
      url: 'http://www.patternfly.org'
    });
    $scope.addNotification({
      type: 'info',
      message: 'DNS server saved with success',
      status: 'success',
      action: 'check',
      url: 'http://www.patternfly.org'
    });
  });
