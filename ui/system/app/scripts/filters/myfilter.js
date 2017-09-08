'use strict';

/**
 * @ngdoc filter
 * @name systemAngularApp.filter:myFilter
 * @function
 * @description
 * # myFilter
 * Filter in the systemAngularApp.
 */
angular.module('systemAngularApp')
  .filter('myFilter', function () {
    return function (input) {
      return 'myFilter filter: ' + input;
    };
  });
