'use strict';

describe('Controller: DetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('appsAngularApp'));

  var DetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DetailsCtrl = $controller('DetailsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DetailsCtrl.awesomeThings.length).toBe(3);
  });
});
