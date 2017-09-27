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
    $('#storage-frame').load(function () {
      $scope.view.isLoaded = true;
      $('#storage-frame').contents().find('body').bind('DOMSubtreeModified', function () {
        if ($(this).hasClass("modal-open")) {
          $scope.initObjects.isFake = true;
        } else {
          $scope.initObjects.isFake = false;
        }
        $scope.$apply();
      })
    });

  });
