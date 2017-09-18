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

    nethserver.System.organization.getInfo().done(function (organization) {
      $scope.localSystem.organization = organization;

      // $scope.$apply();
    }).fail(function (err) {
      console.error(err);
    });

    $scope.saveOrganization = function () {
      nethserver.System.organization.saveInfo(organization).done(function () {

        // notify saving success
        $scope.addNotification({
          type: 'info',
          title: 'Saved',
          message: _('Organization info saved with success'),
          status: 'success',
        });
      }).fail(function (err) {
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
