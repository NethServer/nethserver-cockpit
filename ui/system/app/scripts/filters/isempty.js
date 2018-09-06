'use strict';

/**
 * @ngdoc filter
 * @name systemAngularApp.filter:isempty
 * @function
 * @description
 * # isempty
 * Filter in the systemAngularApp.
 */
angular.module('systemAngularApp')
  .filter('isempty', function () {
    return function (input) {
      return Object.keys(input).length == 0;
    };
  });
