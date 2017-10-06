'use strict';

/**
 * @ngdoc filter
 * @name appsAngularApp.filter:translate
 * @function
 * @description
 * # translate
 * Filter in the appsAngularApp.
 */
angular.module('appsAngularApp')
  .filter('translate', function () {
    return function (input) {
      return cockpit.gettext(input);
    };
  });
