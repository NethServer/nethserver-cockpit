'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:DnsCtrl
 * @description
 * # DnsCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('DnsCtrl', function ($scope) {
    // controller objects
    $scope.objects = {
      searchString: '',
      newDNS: {},
      toDeleteDNS: {}
    };

    $scope.localSystem.dns = {};
    $scope.localSystem.dns.hosts = [{
      hostname: 'test.neth.eu',
      ip: '78.45.12.6',
      description: 'Server dns di test'
    }];

    // methods
    nethserver.System.dns.getAll(function (hosts) {
      $scope.localSystem.dns.hosts = hosts;

      // $scope.$apply();
    }, function (err) {
      console.error("couldn't read dnss: " + err);
    });

    $scope.saveDNS = function (dnsServer) {
      nethserver.System.dns.saveDNS(dnsServer).then(function () {

      }, function (err) {
        console.error(err);
      });
    };
    $scope.editDNS = function (dnsServer) {
      $scope.objects.newDNS = angular.copy(dnsServer) || {};
      $('#newDNSModal').modal('show');
    };
    $scope.openDeleteDNS = function (dnsServer) {
      $scope.objects.toDeleteDNS = angular.copy(dnsServer);
      $('#deleteDNSModal').modal('show');
    };
    $scope.deleteDNS = function (dnsServer) {
      nethserver.System.dns.deleteDNS(dnsServer).then(function () {

      }, function (err) {
        console.error(err);
      });
    };
  });
