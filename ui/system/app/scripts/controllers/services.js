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
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Enabled'),
          message: $filter('translate')('Service enabled with success'),
          status: 'success',
        });
      }, function (err) {
        console.error(err);
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Error'),
          message: $filter('translate')('Service not enabled'),
          status: 'danger',
        });
        $scope.$apply();
      });
    }

    $scope.disableService = function (service) {
      nethserver.system.services.disableService(service).then(function () {
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Disabled'),
          message: $filter('translate')('Service disabled with success'),
          status: 'success',
        });
      }, function (err) {
        console.error(err);
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Error'),
          message: $filter('translate')('Service not disabled'),
          status: 'danger',
        });
        $scope.$apply();
      });
    }

    $scope.startService = function (service) {
      nethserver.system.services.startService(service).then(function () {
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Started'),
          message: $filter('translate')('Service started with success'),
          status: 'success',
        });
      }, function (err) {
        console.error(err);
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Error'),
          message: $filter('translate')('Service not started'),
          status: 'danger',
        });
        $scope.$apply();
      });
    }

    $scope.stopService = function (service) {
      nethserver.system.services.stopService(service).then(function () {
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Stopped'),
          message: $filter('translate')('Service stopped with success'),
          status: 'success',
        });
      }, function (err) {
        console.error(err);
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Error'),
          message: $filter('translate')('Service not stopped'),
          status: 'danger',
        });
        $scope.$apply();
      });
    }

    $scope.restartService = function (service) {
      nethserver.system.services.restartService(service).then(function () {
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Restarted'),
          message: $filter('translate')('Service restarted with success'),
          status: 'success',
        });
      }, function (err) {
        console.error(err);
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Error'),
          message: $filter('translate')('Service not restarted'),
          status: 'danger',
        });
        $scope.$apply();
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
