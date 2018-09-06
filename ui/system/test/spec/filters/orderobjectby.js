'use strict';

describe('Filter: orderObjectBy', function () {

  // load the filter's module
  beforeEach(module('systemAngularApp'));

  // initialize a new instance of the filter before each test
  var orderObjectBy;
  beforeEach(inject(function ($filter) {
    orderObjectBy = $filter('orderObjectBy');
  }));

  it('should return the input prefixed with "orderObjectBy filter:"', function () {
    var text = 'angularjs';
    expect(orderObjectBy(text)).toBe('orderObjectBy filter: ' + text);
  });

});
