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
    $scope.servicesSearchString = '';

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

    $scope.toggleDetails = function (event) {
      var $this = $(event.target);
      var $heading = $(event.target).parents(".list-group-item");
      var $subPanels = $heading.find(".list-group-item-container");
      var index = $heading.find(".list-view-pf-expand").index(event.target);

      $heading.find(".list-view-pf-expand.active").find(".fa-angle-right").removeClass("fa-angle-down")
        .end().removeClass("active")
        .end();
      // Add active to the clicked item
      $(event.target).addClass("active")
        .parents(".list-group-item")
        .end().find(".fa-angle-right").addClass("fa-angle-down");
      // check if it needs to hide
      if ($subPanels.eq(index).hasClass("hidden")) {
        $heading.find(".list-group-item-container:visible").addClass("hidden");
        $subPanels.eq(index).removeClass("hidden");
      } else {
        $subPanels.eq(index).addClass("hidden");
        $heading.find(".list-view-pf-expand.active").find(".fa-angle-right").removeClass("fa-angle-down")
          .end().removeClass("active")
          .end();
      }
    };
  });
