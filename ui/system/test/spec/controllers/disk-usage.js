'use strict';

describe('Controller: DiskUsageCtrl', function () {

  // load the controller's module
  beforeEach(module('systemAngularApp'));

  var DiskUsageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DiskUsageCtrl = $controller('DiskUsageCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DiskUsageCtrl.awesomeThings.length).toBe(3);
  });
});
