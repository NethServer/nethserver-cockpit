'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:UsersGroupsCtrl
 * @description
 * # UsersGroupsCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('UsersGroupsCtrl', function ($scope) {
    // controller objects
    $scope.objects = {
      searchString: '',
      currentSearchFilter: 'user',
      availableSearchFilter: {
        'user': 'Users',
        'group': 'Groups'
      },
      newUser: {
        selectedGroup: null,
        groups: [],
        password: '',
        passwordStrength: 0
      },
      newGroup: {
        selectedUser: null,
        users: []
      },
      toDelete: {}
    };

    $scope.localSystem.users = {};
    $scope.localSystem.users.provider = 'ldap';
    $scope.localSystem.users.domain = '@' + 'nethesis.it';
    $scope.localSystem.users.list = [{
      username: 'alessandro',
      name: 'Alessandro Polidori'
    }, {
      username: 'andrea',
      name: 'Andrea Marchionni'
    }];

    $scope.localSystem.groups = {};
    $scope.localSystem.groups.domain = '@' + 'nethesis.it';
    $scope.localSystem.groups.list = [{
      id: 1,
      name: 'domain admins@nethesis.it'
    }, {
      id: 2,
      name: 'wheel@nethesis.it'
    }];
    setTimeout(function () {
      $('.combobox').combobox();
    }, 100);

    // methods
    $scope.selectProvider = function (provider) {
      $scope.localSystem.users.chooseProvider = provider;
    };

    $scope.switchFilterSearch = function (filter) {
      $scope.objects.currentSearchFilter = filter;
    };

    $scope.groupAlreadyAdded = function (group) {
      return $scope.objects.newUser.groups.indexOf(group) > -1;
    };
    $scope.userAlreadyAdded = function (user) {
      return $scope.objects.newGroup.users.indexOf(user) > -1;
    };

    $scope.addGroupToUser = function (group) {
      if (group.length > 0) {
        if (!$scope.groupAlreadyAdded(group)) {
          $scope.objects.newUser.groups.push(group);
        }
      }
    };
    $scope.removeGroupFromUser = function (index) {
      $scope.objects.newUser.groups.splice(index, 1);
    };

    $scope.addUserToGroup = function (user) {
      if (user.length > 0) {
        if (!$scope.userAlreadyAdded(user)) {
          $scope.objects.newGroup.users.push(user);
        }
      }
    };
    $scope.removeUserFromGroup = function (index) {
      $scope.objects.newGroup.users.splice(index, 1);
    };


    $scope.generatePassword = function () {
      $scope.objects.newUser.isPassGenerated = true;
      // nethserver.Syste.Users.genPass();
      $scope.objects.newUser.password = 'Nethesis,1234';
      $scope.objects.newUser.confirmPassword = 'Nethesis,1234';
    };

    $scope.openCreateUser = function () {
      $scope.objects.newUser = {
        selectedGroup: null,
        groups: [],
        password: '',
        passwordStrength: 0
      };
      $('#createUserModal').modal('show');
    };
    $scope.createUser = function (user) {
      console.log(user);
    };

    $scope.openEditUser = function (user) {
      $scope.objects.newUser = user;
      $scope.objects.newUser.isEdit = true;
      $scope.objects.newUser.isPassEdit = false;
      $('#createUserModal').modal('show');
    };
    $scope.editUser = function (user) {

    };
    $scope.openChangePassword = function (user) {
      $scope.objects.newUser = user;
      $scope.objects.newUser.isEdit = true;
      $scope.objects.newUser.isPassEdit = true;
      $('#createUserModal').modal('show');
    };
    $scope.changePassword = function (user) {

    };

    $scope.openDeleteUser = function (toDelete) {
      $scope.objects.toDelete = toDelete;
      $scope.objects.toDelete.isGroup = false;
      $('#deleteModal').modal('show');
    };
    $scope.deleteUser = function (user) {

    };

    $scope.openCreateGroup = function () {
      $scope.objects.newGroup = {
        selectedUser: null,
        users: []
      };
      $('#createGroupModal').modal('show');
    };
    $scope.createGroup = function (group) {
      console.log(group);
    };

    $scope.openEditGroup = function (group) {
      $scope.objects.newGroup = group;
      $scope.objects.newGroup.isEdit = true;
      $('#createGroupModal').modal('show');
    };
    $scope.editGroup = function (group) {

    };

    $scope.openDeleteGroup = function (toDelete) {
      $scope.objects.toDelete = toDelete;
      $scope.objects.toDelete.isGroup = true;
      $('#deleteModal').modal('show');
    };
    $scope.deleteGroup = function (group) {

    };

    $scope.openBindToRemote = function () {
      $scope.objects.newProvider = {};
      $('#bindToRemoteModal').modal('show');
    };
    $scope.bindToRemote = function (newProvider) {

    };
    $scope.checkBindConfig = function (newProvider) {

    };

    $scope.openInstallLDAP = function () {
      $scope.objects.newProvider = {};
      $('#installLDAPModal').modal('show');
    };
    $scope.installLDAP = function () {

    };

    $scope.openJoinADomain = function () {
      $scope.objects.newProvider = {};
      $('#joinADomainModal').modal('show');
    };
    $scope.joinADomain = function (newProvider) {

    };

    $scope.openCreateDC = function () {
      $scope.objects.newProvider = {};
      $('#createDCModal').modal('show');
    };
    $scope.createDC = function (newProvider) {

    };

  });
