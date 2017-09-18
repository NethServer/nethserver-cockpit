'use strict';

/**
 * @ngdoc filter
 * @name systemAngularApp.filter:capitalize
 * @function
 * @description
 * # capitalize
 * Filter in the systemAngularApp.
 */
angular.module('systemAngularApp')
  .filter('capitalize', function () {
    return function (input) {
      return input.charAt(0).toUpperCase() + input.slice(1);
    };
  });
