'use strict';

describe('Controller: DnsCtrl', function () {

  // load the controller's module
  beforeEach(module('systemAngularApp'));

  var DnsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DnsCtrl = $controller('DnsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DnsCtrl.awesomeThings.length).toBe(3);
  });
});
