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
    // show body when angular is fully loaded
    $('body').show();

    // variables declaration
    $scope.notifications = [];
    $scope.localSystem = {};

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

    // methods declaration
    $scope.goTo = function (route) {
      $location.path(route);
    };

    $scope.addNotification = function (notification) {
      $scope.notifications.push(notification);
    };

    $scope.removeNotification = function (index) {
      $scope.notifications.splice(index, 1);
    };

    $scope.addNotification({
      type: 'task',
      title: 'Event',
      message: 'Expand-template /etc/hosts',
      status: 'warning',
      action: 'check',
      progress: 76,
      url: 'http://www.patternfly.org'
    });
    $scope.addNotification({
      type: 'action',
      title: 'Service',
      message: 'sshd is stopped',
      status: 'danger',
      action: 'Restart',
      url: 'http://www.patternfly.org'
    });

    // events listeners
    $scope.$on('$routeChangeSuccess', function (next, current) {
      var name = $route.routes[$location.path()];
      var crumbs = name.originalPath === '/' ? [""] : name.originalPath.split('/');
      $scope.crumbs = crumbs.map(function (v) {
        return {
          name: $route.routes['/' + v].name,
          url: '/' + v
        }
      });
    });
  });
