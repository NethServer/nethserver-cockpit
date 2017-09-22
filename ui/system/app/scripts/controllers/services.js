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
    // controller objects
    $scope.objects = {
      searchString: '',
      selectedServices: []
    };

    $scope.localSystem.services = {};
    $scope.localSystem.services.list = [{
        name: 'chronyd',
        description: 'Network time protocol',
        status: 'enabled',
        running: true,
        ports: {
          udp: [123]
        },
      },
      {
        name: 'collectd',
        description: 'System performance statistics collector',
        status: 'disabled',
        running: false,
      },
      {
        name: 'dnsmasq',
        description: 'DNS and DHCP',
        status: 'enabled',
        running: true,
        ports: {
          udp: [53, 67, 69],
          tcp: [53]
        },
      },
      {
        name: 'asterisk',
        description: 'VoIP PBX',
        status: 'disabled',
        running: true,
        ports: {
          udp: [123]
        }
      },
      {
        name: 'janus-gateway',
        description: 'WebRTC daemon gateway',
        status: 'disabled',
        running: false
      },
      {
        name: 'postfix',
        description: 'SMTP',
        status: 'enabled',
        running: true,
        ports: {
          udp: [53, 67, 69],
          tcp: [53]
        }
      }
    ];

    // methods
    nethserver.System.services.getAll().then(function (services) {
      //$scope.localSystem.services.list = services;

      //$scope.$apply();
    }, function (err) {
      console.error("couldn't read services: " + err);
    });


    $scope.enableService = function (services) {
      nethserver.System.services.enableServices().then(function (services) {

      }, function (err) {
        console.error(err);
      });
    }

    $scope.disableService = function (services) {
      nethserver.System.services.disableServices().then(function () {

      }, function (err) {
        console.error(err);
      });
    }

    $scope.startService = function (services) {
      nethserver.System.services.startServices().then(function () {

      }, function (err) {
        console.error(err);
      });
    }

    $scope.stopService = function (services) {
      nethserver.System.services.stopServices().then(function () {

      }, function (err) {
        console.error(err);
      });
    }

    $scope.restartService = function (services) {
      nethserver.System.services.restartServices().then(function () {

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

    $scope.addToSelected = function (service) {
      if (service.checked) {
        $scope.objects.selectedServices.push(service);
      } else {
        // delete item for array
        for (var s in $scope.objects.selectedServices) {
          if ($scope.objects.selectedServices[s].name == service.name) {
            $scope.objects.selectedServices.splice(s, 1);
          };
        }
      }
    };
  });
