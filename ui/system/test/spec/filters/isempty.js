'use strict';

describe('Filter: isempty', function () {

  // load the filter's module
  beforeEach(module('systemAngularApp'));

  // initialize a new instance of the filter before each test
  var isempty;
  beforeEach(inject(function ($filter) {
    isempty = $filter('isempty');
  }));

  it('should return the input prefixed with "isempty filter:"', function () {
    var text = 'angularjs';
    expect(isempty(text)).toBe('isempty filter: ' + text);
  });

});
