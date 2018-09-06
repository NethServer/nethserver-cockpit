'use strict';

describe('Filter: capitalize', function () {

  // load the filter's module
  beforeEach(module('systemAngularApp'));

  // initialize a new instance of the filter before each test
  var capitalize;
  beforeEach(inject(function ($filter) {
    capitalize = $filter('capitalize');
  }));

  it('should return the input prefixed with "capitalize filter:"', function () {
    var text = 'angularjs';
    expect(capitalize(text)).toBe('capitalize filter: ' + text);
  });

});
