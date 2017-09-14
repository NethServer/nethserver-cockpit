'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:OrganizationCtrl
 * @description
 * # OrganizationCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('OrganizationCtrl', function ($scope) {
    $scope.saveOrganization = function () {
      nethserver.System.organization.updateOrganization($scope.organization, function() {
        //TODO
      }, function (err) {
        console.error(err);
      });
    }
  });