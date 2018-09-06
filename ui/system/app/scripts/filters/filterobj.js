'use strict';

/**
 * @ngdoc filter
 * @name systemAngularApp.filter:filterObj
 * @function
 * @description
 * # filterObj
 * Filter in the systemAngularApp.
 */
angular.module('systemAngularApp')
  .filter('filterObj', function () {
    return function (items, search) {
      if (search.length == 0)
        return items;

      var result = {};
      angular.forEach(items, function (value, key) {
        angular.forEach(value, function (prop, keyProp) {
          if (prop && prop.length && prop.indexOf(search.toLowerCase()) >= 0 || key.indexOf(search.toLowerCase()) >= 0) {
            result[key] = value;
          }
        })
      });
      return result;
    };
  });
