'use strict';

describe('Controller: DateTimeCtrl', function () {

  // load the controller's module
  beforeEach(module('systemAngularApp'));

  var DateTimeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DateTimeCtrl = $controller('DateTimeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DateTimeCtrl.awesomeThings.length).toBe(3);
  });
});
