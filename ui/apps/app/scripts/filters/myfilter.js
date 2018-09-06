'use strict';

/**
 * @ngdoc filter
 * @name appsAngularApp.filter:myFilter
 * @function
 * @description
 * # myFilter
 * Filter in the appsAngularApp.
 */
angular.module('appsAngularApp')
  .filter('myFilter', function () {
    return function (input) {
      return 'myFilter filter: ' + input;
    };
  });
