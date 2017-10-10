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
    $scope.localSystem.dns.hosts = {};

    // methods
    nethserver.system.dns.getAllRemoteHosts().then(function (hosts) {
      $scope.localSystem.dns.hosts = hosts;

      $scope.$apply();
    }, function (err) {
      console.error("couldn't read remote hosts db: " + err);
    });

    $scope.saveDNS = function (host) {
      nethserver.system.dns.addRemoteHost(host).then(function () {
      $('#newDNSModal').modal('hide');
      }, function (err) {
        console.error(err);
      });
    };
    $scope.editDNS = function (host) {
      $scope.objects.newDNS = angular.copy(host) || {};
      $('#newDNSModal').modal('show');
    };
    $scope.openDeleteDNS = function (host) {
      $scope.objects.toDeleteDNS = angular.copy(host);
      $('#deleteDNSModal').modal('show');
    };
    $scope.deleteDNS = function (host) {
      nethserver.system.dns.deleteRemoteHost(host.key).then(function () {
        $('#deleteDNSModal').modal('hide');
      }, function (err) {
        console.error(err);
      });
    };
  });
