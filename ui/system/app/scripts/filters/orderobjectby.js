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
    return function (items, reverse) {
      var keys = Object.keys(items || {}).sort();
      if(reverse) keys.reverse();
      for (var ordered = {}, i = 0; keys[i]; i++) {
        ordered[keys[i]] = items[keys[i]];
      }
      return ordered;
    };
  });
