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
    $scope.notifications = {
      list: [],
      task: {
        isShown: false,
        title: 'Event',
        message: 'Expand /etc/hosts',
        progress: 60,
        show: function () {
          this.isShown = true;
        },
        hide: function () {
          this.isShown = false;
        },
        getData: function () {
          return {
            title: this.title,
            message: this.message,
            progress: this.progress
          }
        },
        setData: function (data) {
          this.title = data.title || this.title;
          this.message = data.message || this.message;
          this.progress = data.progress || this.progress;
        }
      }
    };
    $scope.localSystem = {};

    $scope.stats = {
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
    $scope.goTo = function (route, isJumping) {
      if (isJumping) {
        cockpit.jump(route);
      } else {
        $location.path(route);
      }
    };

    $scope.addNotification = function (notification) {
      $scope.notifications.list.push(notification);
    };

    $scope.removeNotification = function (index) {
      $scope.notifications.list.splice(index, 1);
    };

    $scope.progressBarWidth = function (percent) {
      return {
        "width": percent + '%',
      };
    };

    $scope.offsetNotification = function (offset) {
      return {
        "margin-top": $scope.notifications.task.isShown ? (offset + 1) * 4.5 + 'em' : offset * 4.5 + 'em',
      };
    };


    /*  $scope.notifications.task.show();
     $scope.addNotification({
       type: 'action',
       title: 'Service',
       message: 'sshd is stopped',
       status: 'danger',
       action: 'Restart',
       url: 'http://www.patternfly.org'
     });
     $scope.addNotification({
       type: 'info',
       title: 'Service',
       message: 'sshd is stopped',
       status: 'success',
     }); */

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
