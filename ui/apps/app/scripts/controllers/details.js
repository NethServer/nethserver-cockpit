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
    $scope.app = $scope.applications.filter(function (a) {
      return a.id == $scope.appNameRaw;
    })[0];
    $scope.appURL = '/cockpit/@localhost/' + $scope.appNameRaw + '/index.html';

    // add crumb path
    $scope.crumbs.push({
      name: 'Applications',
      url: '/'
    })
    $scope.crumbs.push({
      name: $scope.app.name,
      url: $scope.appURL
    });

    // events listeners
    nethserver.notificationMonitor.addEventListener('nsnotification', function (notification) {
      $scope.notifications.add({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        status: notification.status,
      });
      $scope.$apply();
    });

    // show fake backdrop when modal is open
    $('#app-frame').load(function () {
      $scope.view.isLoaded = true;

      // calculate height
      $('#app-frame').css('height', window.innerHeight - 50);

      // select the target node
      var target = document.querySelector('#app-frame').contentDocument.body;

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
  });
