'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:StorageCtrl
 * @description
 * # StorageCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('StorageCtrl', function ($scope) {
    $scope.view = {
      isLoaded: false
    };

    // show fake backdrop when modal is open
    $('#storage-frame').on('load', function () {
      $scope.view.isLoaded = true;

      // select the target node
      var target = document.querySelector('#storage-frame').contentDocument.body;
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
