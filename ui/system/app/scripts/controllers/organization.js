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

    $scope.localSystem.organization = {};

    nethserver.system.organization.getInfo().then(function (organization) {
      $scope.localSystem.organization = organization;

      // $scope.$apply();
    }, function (err) {
      console.error(err);
    });

    $scope.saveOrganization = function () {
      nethserver.system.organization.saveInfo(organization).then(function () {

        // notify saving success
        $scope.addNotification({
          type: 'info',
          title: 'Saved',
          message: _('Organization info saved with success'),
          status: 'success',
        });
      }, function (err) {
        console.error(err);
        // notify saving error
        $scope.addNotification({
          type: 'info',
          title: 'Error',
          message: _('Organization info not saved'),
          status: 'danger',
        });
      });
    };

  });
