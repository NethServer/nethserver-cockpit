'use strict';

describe('Controller: NetworkCtrl', function () {

  // load the controller's module
  beforeEach(module('systemAngularApp'));

  var NetworkCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NetworkCtrl = $controller('NetworkCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NetworkCtrl.awesomeThings.length).toBe(3);
  });
});
