'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:ServicesCtrl
 * @description
 * # ServicesCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('ServicesCtrl', function ($scope, $filter) {
    // controller objects
    $scope.objects = {
      searchString: '',
      selectedServices: []
    };

    $scope.view = {
      isLoaded: false
    };

    $scope.localSystem.services = {};

    // methods
    $scope.getAllServices = function () {
      nethserver.system.services.getAllServices().then(function (services) {
        $scope.localSystem.services.list = services;
        $scope.view.isLoaded = true;
        $scope.$apply();
      }, function (err) {
        console.error("couldn't read services: " + err);
      });
    };

    $scope.enableService = function (service) {
      nethserver.system.services.enableService(service).then(function (services) {
      }, function (err) {
        console.error(err);
      });
    }

    $scope.disableService = function (service) {
      nethserver.system.services.disableService(service).then(function () {
      }, function (err) {
        console.error(err);
      });
    }

    $scope.startService = function (service) {
      nethserver.system.services.startService(service).then(function () {
      }, function (err) {
        console.error(err);
      });
    }

    $scope.stopService = function (service) {
      nethserver.system.services.stopService(service).then(function () {
      }, function (err) {
        console.error(err);
      });
    }

    $scope.restartService = function (service) {
      nethserver.system.services.restartService(service).then(function () {
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

    $scope.getAllServices();

    nethserver.eventMonitor.addEventListener('nsevent.succeeded', function (success) {
      $scope.getAllServices();
    });

  });
