'use strict';

describe('Controller: UserGroupsCtrl', function () {

  // load the controller's module
  beforeEach(module('systemAngularApp'));

  var UserGroupsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserGroupsCtrl = $controller('UserGroupsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UserGroupsCtrl.awesomeThings.length).toBe(3);
  });
});
