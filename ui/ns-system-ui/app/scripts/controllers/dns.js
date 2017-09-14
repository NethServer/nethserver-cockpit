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
    $scope.dnss = [{
      hostname: 'test.neth.eu',
      ip: '78.45.12.6',
      description: 'Server dns di test'
    }];

    $scope.getAllDNSServers = function () {

    };

    $scope.saveDNSServer = function (dnsServer) {

    };
    $scope.newDNSServer = function () {
      $scope.newDNS = {};
      $('#newDNSModal').modal('show');
    };
    $scope.editDNSServer = function (dnsServer) {
      $scope.newDNS = angular.copy(dnsServer);
      $('#newDNSModal').modal('show');
    };
    $scope.openDeleteDNSModal = function (dnsServer) {
      $scope.DNSToDelete = angular.copy(dnsServer);
      $('#deleteDNSModal').modal('show');
    };
    $scope.deleteDNSServer = function (dnsServer) {

    };
  });
