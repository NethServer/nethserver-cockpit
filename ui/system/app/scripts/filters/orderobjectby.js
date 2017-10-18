'use strict';

/**
 * @ngdoc filter
 * @name systemAngularApp.filter:orderObjectBy
 * @function
 * @description
 * # orderObjectBy
 * Filter in the systemAngularApp.
 */
angular.module('systemAngularApp')
  .filter('orderObjectBy', function () {
    return function (items, field) {
      var keys = Object.keys(items || {}).sort();
      for (var ordered = {}, i = 0; keys[i]; i++) {
        ordered[keys[i]] = items[keys[i]];
      }
      return ordered;
    };
  });
