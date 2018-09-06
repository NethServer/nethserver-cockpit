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
    $scope.view = {
      isLoaded: false
    };

    // retrieve app name
    $scope.appNameRaw = $routeParams.app;
    $scope.appURL = '/cockpit/@localhost/' + $scope.appNameRaw + '/index.html';

    // get app info
    nethserver.applications.getApplication($scope.appNameRaw).then(function (application) {
      $scope.app = application;

      $scope.app.content = $scope.app.provides.join('\n');

      $scope.crumbs.push({
        name: $scope.app.name,
        url: $scope.appURL
      });
      $scope.$apply();
    }, function (err) {
      console.error("couldn't read application info: " + err);
    });

    // add crumb path
    $scope.crumbs.push({
      name: 'Applications',
      url: '/'
    })

    // events listeners
    nethserver.notificationMonitor.addEventListener('nsnotification', function (notification) {
      var notification = notification.detail;
      $scope.notifications.add({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        status: notification.status,
        action: notification.action,
        method: notification.method,
      });
      $scope.$apply();
    });

    // show fake backdrop when modal is open
    $('#app-frame').load(function () {
      $scope.view.isLoaded = true;

      // calculate height
      $('#app-frame').css('height', window.innerHeight - 45);

      // select the target node
      var target = document.querySelector('#app-frame').contentDocument.body;
      $(target).css('background-color', '#f5f5f5');

      // create an observer instance
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if ($(mutation.target).hasClass("modal-open")) {
            $scope.initObjects.isFake = true;
          } else {
            $scope.initObjects.isFake = false;
          }
          $scope.$apply();
        });
      });

      // configuration of the observer:
      var config = {
        attributes: true,
        childList: true,
        characterData: true
      }

      // pass in the target node, as well as the observer options
      observer.observe(target, config);

      $scope.$apply();
    });

    $scope.$on('$routeChangeStart', function (next, current) {
      $scope.initObjects.isFake = false;
    });
  });
