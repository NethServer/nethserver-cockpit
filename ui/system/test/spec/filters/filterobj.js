'use strict';

describe('Filter: filterObj', function () {

  // load the filter's module
  beforeEach(module('systemAngularApp'));

  // initialize a new instance of the filter before each test
  var filterObj;
  beforeEach(inject(function ($filter) {
    filterObj = $filter('filterObj');
  }));

  it('should return the input prefixed with "filterObj filter:"', function () {
    var text = 'angularjs';
    expect(filterObj(text)).toBe('filterObj filter: ' + text);
  });

});
