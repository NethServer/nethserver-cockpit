'use strict';

describe('Controller: InitCtrl', function () {

  // load the controller's module
  beforeEach(module('systemAngularApp'));

  var InitCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InitCtrl = $controller('InitCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InitCtrl.awesomeThings.length).toBe(3);
  });
});
