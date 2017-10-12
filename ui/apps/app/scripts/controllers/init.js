'use strict';

/**
 * @ngdoc function
 * @name appsAngularApp.controller:InitCtrl
 * @description
 * # InitCtrl
 * Controller of the appsAngularApp
 */
angular.module('appsAngularApp')
  .controller('InitCtrl', function ($scope, $route, $location, $window) {
    // show body when angular is fully loaded
    $('body').show();

    // variables declaration
    $scope.notifications = {
      list: [],
      add: function (notification) {
        notification.timeAdded = new Date().getTime();
        this.list.push(notification);
      },
      remove: function (index) {
        this.list.splice(index, 1);
      },
      task: {
        isShown: false,
        title: 'Event',
        message: '...',
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

    // remove notifications after 5 seconds
    setInterval(function () {
      for (var n in $scope.notifications.list) {
        var notification = $scope.notifications.list[n];
        if (notification.status == 'success' && notification.timeAdded < (new Date().getTime() - 5000)) {
          $scope.notifications.remove(n);
          $scope.$apply();
        }
      }
    }, 5000);

    // get applications list
    nethserver.applications.getApplications().then(function (applications) {
      $scope.applications = applications;
      $scope.$apply();
    }, function (err) {
      console.error("couldn't read oapplications list: " + err);
    });

    $scope.stats = {
      updates: []
    };

    $scope.initObjects = {
      isFake: false
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
    $scope.goToExternal = function (url) {
      $window.open(url, '_blank');
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

    // events listeners
    nethserver.eventMonitor.addEventListener('nsevent.succeeded', function (success) {
      $scope.notifications.task.setData({
        progress: 100,
      });
      $scope.$apply();
      setTimeout(function () {
        $scope.notifications.task.hide();
        $scope.$apply();
      }, 1000);
    });
    nethserver.eventMonitor.addEventListener('nsevent.failed', function (fail) {
      $scope.notifications.add({
        type: 'info',
        title: fail.detail.title,
        message: fail.detail.message,
        status: 'danger',
      });
      $scope.$apply();
    });
    nethserver.eventMonitor.addEventListener('nsevent.progress', function (progress) {
      $scope.notifications.task.show();
      $scope.notifications.task.setData({
        progress: Math.round(progress.detail.progress * 100),
        title: progress.detail.title,
        message: progress.detail.message,
      });
      $scope.$apply();
    });

    $scope.$on('$routeChangeSuccess', function (next, current) {
      $scope.crumbs = [];
    });
  });
