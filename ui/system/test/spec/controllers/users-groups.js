'use strict';

describe('Controller: UsersGroupsCtrl', function () {

  // load the controller's module
  beforeEach(module('systemAngularApp'));

  var UsersGroupsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsersGroupsCtrl = $controller('UsersGroupsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UsersGroupsCtrl.awesomeThings.length).toBe(3);
  });
});
