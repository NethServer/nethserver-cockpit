'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:InitCtrl
 * @description
 * # InitCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('InitCtrl', function ($scope) {
    $scope.stats = {
      tasks: [{}],
      updates: [],
      errors: []
    };
  });
