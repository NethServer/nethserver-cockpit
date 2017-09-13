'use strict';

/**
 * @ngdoc filter
 * @name systemAngularApp.filter:translate
 * @function
 * @description
 * # translate
 * Filter in the systemAngularApp.
 */
angular.module('systemAngularApp')
  .filter('translate', function () {
    return function (input) {
      return cockpit.gettext(input);
    };
  });
