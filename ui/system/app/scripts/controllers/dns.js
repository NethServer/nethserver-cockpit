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
    $scope.getAllRemoteHosts = function () {
      nethserver.system.dns.getAllRemoteHosts().then(function (hosts) {
        $scope.localSystem.dns.hosts = hosts;

        $scope.$apply();
      }, function (err) {
        console.error("couldn't read remote hosts db: " + err);
      });
    };

    $scope.saveDNS = function (host) {
      if (host.isEdit) {
        nethserver.system.dns.editRemoteHost(host).then(function () {
          $('#newDNSModal').modal('hide');
          $scope.notifications.add({
            type: 'info',
            title: 'Edited',
            message: 'DNS record edited with success',
            status: 'success',
          });
          $scope.getAllRemoteHosts();
        }, function (err) {
          console.log(err);
          if (err.type == 'TaskRun') {
            $scope.objects.newDNS.onTaskRunning = true;
          } else {
            $scope.objects.newDNS.onTaskRunning = false;
            $scope.objects.newDNS.errorMessage = err.message;
            $scope.objects.newDNS.errorProp = err.attribute;
          }
          $scope.$apply();
        });
      } else {
        nethserver.system.dns.addRemoteHost(host).then(function () {
          $('#newDNSModal').modal('hide');
          $scope.notifications.add({
            type: 'info',
            title: 'Saved',
            message: 'DNS record added with success',
            status: 'success',
          });
          $scope.getAllRemoteHosts();
        }, function (err) {
          console.log(err);
          if (err.type == 'TaskRun') {
            $scope.objects.newDNS.onTaskRunning = true;
          } else {
            $scope.objects.newDNS.onTaskRunning = false;
            $scope.objects.newDNS.errorMessage = err.message;
            $scope.objects.newDNS.errorProp = err.attribute;
          }
          $scope.$apply();
        });
      }
    };
    $scope.newDNS = function (host) {
      $scope.objects.newDNS = {};
      $('#newDNSModal').modal('show');
    };
    $scope.editDNS = function (host) {
      $scope.objects.newDNS = angular.copy(host) || {};
      $scope.objects.newDNS.errorMessage = null;
      $scope.objects.newDNS.errorProp = null;
      $scope.objects.newDNS.isEdit = true;
      $('#newDNSModal').modal('show');
    };
    $scope.openDeleteDNS = function (host) {
      $scope.objects.toDeleteDNS = angular.copy(host);
      $('#deleteDNSModal').modal('show');
    };
    $scope.deleteDNS = function (host) {
      nethserver.system.dns.deleteRemoteHost(host.key).then(function () {
        $scope.getAllRemoteHosts();
        $('#deleteDNSModal').modal('hide');
      }, function (err) {
        console.error(err);
      });
    };

    $scope.getAllRemoteHosts();
  });
