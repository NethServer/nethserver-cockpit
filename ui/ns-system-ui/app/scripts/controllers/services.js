'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:ServicesCtrl
 * @description
 * # ServicesCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('ServicesCtrl', function ($scope) {
    nethserver.System.services.getAllServices(function (services) {
      $scope.allServices = services;

      // applying scope
      // $scope.$apply();
    }, function (err) {
      console.error("couldn't read services: " + err);
    });

    $scope.enable = function () {
      nethserver.System.services.enableService(function () {

      }, function (err) {
        console.error(err);
      });
    }

    $scope.disable = function () {
      nethserver.System.services.disableService(function () {

      }, function (err) {
        console.error(err);
      });
    }

    $scope.start = function () {
      nethserver.System.services.startService(function () {

      }, function (err) {
        console.error(err);
      });
    }

    $scope.stop = function () {
      nethserver.System.services.stopService(function () {

      }, function (err) {
        console.error(err);
      });
    }

    $scope.restart = function () {
      console.log('restart');
      nethserver.System.services.restartService(function () {

      }, function (err) {
        console.error(err);
      });
    }
  });
