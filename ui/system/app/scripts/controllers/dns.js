'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:DnsCtrl
 * @description
 * # DnsCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('DnsCtrl', function ($scope, $filter) {
    // controller objects
    $scope.objects = {
      searchString: '',
      newDNS: {},
      toDeleteDNS: {}
    };

    $scope.view = {
      isLoaded: false
    };

    $scope.localSystem.dns = {};
    $scope.localSystem.dns.hosts = [];

    // methods
    $scope.getAllRemoteHosts = function () {
      nethserver.system.dns.getAllRemoteHosts().then(function (hosts) {
        $scope.view.isLoaded = true;
        $scope.localSystem.dns.hosts = hosts;

        $scope.$apply();
      }, function (err) {
        console.error("couldn't read remote hosts db: " + err);
      });
    };

    $scope.cleanErrors = function () {
      delete $scope.objects.newDNS.errorMessage;
      delete $scope.objects.newDNS.errorProps;
      delete $scope.objects.newDNS.onTaskRunning;
    };

    $scope.saveDNS = function (host) {
      $scope.cleanErrors();
      if (host.isEdit) {
        nethserver.system.dns.editRemoteHost(host).then(function () {
          $('#newDNSModal').modal('hide');
        }, function (err) {
          console.log(err);
          if (err.type == 'TaskRun') {
            $scope.objects.newDNS.onTaskRunning = true;
          } else {
            $scope.objects.newDNS.onTaskRunning = false;
            $scope.objects.newDNS.errorMessage = err.message;
            $scope.objects.newDNS.errorProps = err.attributes;
          }
          $scope.$apply();
        });
      } else {
        nethserver.system.dns.addRemoteHost(host).then(function () {
          $('#newDNSModal').modal('hide');
        }, function (err) {
          console.log(err);
          if (err.type == 'TaskRun') {
            $scope.objects.newDNS.onTaskRunning = true;
          } else {
            $scope.objects.newDNS.onTaskRunning = false;
            $scope.objects.newDNS.errorMessage = err.message;
            $scope.objects.newDNS.errorProps = err.attributes;
          }
          $scope.$apply();
        });
      }
    };
    $scope.newDNS = function () {
      $scope.objects.newDNS = {};
      $('#newDNSModal').modal('show');
    };
    $scope.editDNS = function (host) {
      $scope.cleanErrors();
      $scope.objects.newDNS = host;
      $scope.objects.newDNS.isEdit = true;
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

    $scope.getAllRemoteHosts();

    nethserver.eventMonitor.addEventListener('nsevent.succeeded', function (success) {
      $scope.getAllRemoteHosts();
    });
  });
