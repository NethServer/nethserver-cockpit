'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:UsersGroupsCtrl
 * @description
 * # UsersGroupsCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('UsersGroupsCtrl', function ($scope) {
    // controller objects
    $scope.objects = {
      searchString: '',
      newProvider: {}
    };

    $scope.localSystem.users = {};
    $scope.localSystem.users.provider = null;

    // methods
    $scope.selectProvider = function (provider) {
      $scope.localSystem.users.provider = provider;
    };

    $scope.openBindToRemote = function () {
      $scope.objects.newProvider = {};
      $('#bindToRemoteModal').modal('show');
    };
    $scope.bindToRemote = function (newProvider) {

    };
    $scope.checkBindConfig = function(newProvider) {

    };

    $scope.openInstallLDAP = function () {
      $scope.objects.newProvider = {};
      $('#installLDAPModal').modal('show');
    };
    $scope.installLDAP = function () {

    };

    $scope.openJoinADomain = function () {
      $scope.objects.newProvider = {};
      $('#joinADomainModal').modal('show');
    };
    $scope.joinADomain = function (newProvider) {

    };

    $scope.openCreateDC = function () {
      $scope.objects.newProvider = {};
      $('#createDCModal').modal('show');
    };
    $scope.createDC = function (newProvider) {

    };

  });
