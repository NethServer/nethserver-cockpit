'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:UsersGroupsCtrl
 * @description
 * # UsersGroupsCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('UsersGroupsCtrl', function ($scope, $filter) {
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
      toDelete: {},
      newProvider: {},
      currentStep: 1
    };

    $scope.view = {
      isLoaded: false
    };

    $scope.localSystem.users = {};
    $scope.localSystem.users.provider = null;
    $scope.localSystem.users.chooseProvider = null;
    $scope.localSystem.users.chooseBind = null;
    $scope.localSystem.users.providerInfo = {};

    $scope.localSystem.users.domain = '@' + 'nethesis.it';
    $scope.localSystem.users.list = {};

    $scope.localSystem.groups = {};
    $scope.localSystem.groups.domain = '@' + 'nethesis.it';
    $scope.localSystem.groups.list = {};

    setTimeout(function () {
      $('.combobox').combobox();
    }, 2000);

    // methods
    $scope.selectProvider = function (provider) {
      $scope.localSystem.users.chooseProvider = provider;
      $scope.localSystem.users.chooseBind = null;
      $scope.objects.newProvider = {};
    };
    $scope.selectBind = function (bind) {
      $scope.localSystem.users.chooseBind = bind;
      $scope.objects.newProvider = {};
      $scope.getAdDefault();
    };

    $scope.checkIfDisabled = function () {
      if ($scope.objects.currentStep == 1) {
        if ($scope.localSystem.users.chooseProvider == null) {
          return true;
        } else {
          return false;
        }
      }

      if ($scope.objects.currentStep == 2) {
        if ($scope.localSystem.users.chooseBind == null) {
          return true;
        } else {
          return false;
        }
      }

      if ($scope.objects.currentStep == 3) {
        if ($scope.localSystem.users.chooseProvider == 'ldap' && $scope.localSystem.users.chooseBind == 'local') {
          return false;
        }
        if ($scope.localSystem.users.chooseProvider == 'ldap' && $scope.localSystem.users.chooseBind == 'remote') {
          if ($scope.objects.newProvider.info && !$scope.objects.newProvider.probeError) {
            return false;
          } else {
            return true;
          }
        }
        if ($scope.localSystem.users.chooseProvider == 'ad' && $scope.localSystem.users.chooseBind == 'local') {
          if ($scope.objects.newProvider.Realm.length > 0 && $scope.objects.newProvider.Workgroup.length > 0 && $scope.objects.newProvider.IpAddress.length > 0) {
            return false;
          } else {
            return true;
          }
        }
        if ($scope.localSystem.users.chooseProvider == 'ad' && $scope.localSystem.users.chooseBind == 'remote') {
          if ($scope.objects.newProvider.info && !$scope.objects.newProvider.probeError && $scope.objects.newProvider.info.BindPassword && $scope.objects.newProvider.info.BindPassword.length > 0) {
            return false;
          } else {
            return true;
          }
        }
      }
    };
    $scope.nextStep = function () {
      if ($scope.objects.currentStep == 3) {
        if ($scope.localSystem.users.chooseProvider == 'ldap' && $scope.localSystem.users.chooseBind == 'local') {
          $scope.installLDAP();
        }
        if ($scope.localSystem.users.chooseProvider == 'ldap' && $scope.localSystem.users.chooseBind == 'remote') {
          $scope.bindToRemoteLdap($scope.objects.newProvider);
        }
        if ($scope.localSystem.users.chooseProvider == 'ad' && $scope.localSystem.users.chooseBind == 'local') {
          $scope.createDC($scope.objects.newProvider);
        }
        if ($scope.localSystem.users.chooseProvider == 'ad' && $scope.localSystem.users.chooseBind == 'remote') {
          $scope.joinADomain($scope.objects.newProvider);
        }
      } else {
        $scope.objects.currentStep++;
      }
    };
    $scope.prevStep = function () {
      $scope.objects.currentStep--;
    };

    $scope.switchFilterSearch = function (filter) {
      $scope.objects.currentSearchFilter = filter;
    };

    $scope.groupAlreadyAdded = function (group) {
      return $scope.objects.newUser.groups.indexOf(group) > -1;
    };
    $scope.userAlreadyAdded = function (user) {
      return $scope.objects.newGroup.members.indexOf(user) > -1;
    };

    $scope.cancelWizard = function () {
      $('#accountProviderWizard').modal('hide');
      $scope.goTo('/');
    };

    $scope.cleanUserErrors = function() {
      delete $scope.objects.newUser.errorMessage;
      delete $scope.objects.newUser.errorProps;
      delete $scope.objects.newUser.onTaskRunning;
    };
    $scope.cleanGroupErrors = function() {
      delete $scope.objects.newGroup.errorMessage;
      delete $scope.objects.newGroup.errorProps;
      delete $scope.objects.newGroup.onTaskRunning;
    };

    $scope.getInfo = function () {
      nethserver.system.provider.getInfo().then(function (provider) {
        $scope.localSystem.users.provider = provider.isAD ? 'ad' : provider.isLdap ? 'ldap' : null;
        $scope.localSystem.users.providerInfo = provider;

        if (!$scope.localSystem.users.provider) {
          $('#accountProviderWizard').modal('show');
        }
        $scope.$apply();
      }, function (err) {
        console.error(err);
      });
    };

    $scope.getAdDefault = function () {
      nethserver.system.provider.getAdDefault().then(function (defaults) {
        $scope.objects.newProvider.Realm = defaults.Realm;
        $scope.objects.newProvider.Workgroup = defaults.Workgroup;
        $scope.objects.newProvider.IpAddress = "";
        $scope.$apply();
      }, function (err) {
        console.error(err);
      });
    };

    $scope.getUsers = function () {
      nethserver.system.users.getUsers().then(function (users) {
        $scope.localSystem.users.list = users;
        $scope.view.isLoaded = true;
        $scope.$apply();
      }, function (err) {
        console.error(err);
      });
    };

    $scope.getGroups = function () {
      nethserver.system.users.getGroups().then(function (groups) {
        $scope.localSystem.groups.list = groups;
        $scope.$apply();
      }, function (err) {
        console.error(err);
      });
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
          $scope.objects.newGroup.members.push(user);
        }
      }
    };
    $scope.removeUserFromGroup = function (index) {
      $scope.objects.newGroup.members.splice(index, 1);
    };

    $scope.generatePassword = function () {
      $scope.objects.newUser.isPassGenerated = true;
      nethserver.system.users.mkpasswd().then(function (password) {
        $scope.objects.newUser.password = password.trim();
        $scope.objects.newUser.confirmPassword = password.trim();
        $scope.$apply();
      }, function (err) {
        console.error(err);
      });
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
      user.expires = user.expires ? 'yes' : 'no';
      user.shell = user.shell ? '/bin/bash' : '/usr/libexec/openssh/sftp-server';
      $scope.cleanUserErrors();
      nethserver.system.users.addUser(user).then(function () {
        $('#createUserModal').modal('hide');
      }, function (err) {
        console.error(err);
        $scope.objects.newUser.errorMessage = err.message;
        $scope.objects.newUser.errorProps = err.attributes;
        $scope.$apply();
      });
    };

    $scope.openEditUser = function (ku, user) {
      $scope.objects.newUser = user;
      $scope.objects.newUser.key = ku;
      $scope.objects.newUser.isEdit = true;
      $scope.objects.newUser.isPassEdit = false;
      $scope.objects.newUser.loadGroups = true;
      nethserver.system.users.getUserMembership(ku).then(function (groups) {
        $scope.objects.newUser.groups = groups;
        $scope.objects.newUser.loadGroups = false;
        $scope.$apply();
      }, function (err) {
        console.error(err);
        $scope.objects.newUser.loadGroups = false;
      });
      $('#createUserModal').modal('show');
    };
    $scope.editUser = function (user) {
      user.expires = user.expires ? 'yes' : 'no';
      user.shell = user.shell ? '/bin/bash' : '/usr/libexec/openssh/sftp-server';
      $scope.cleanUserErrors();
      nethserver.system.users.editUser(user).then(function () {
        $('#createUserModal').modal('hide');
        $scope.$apply();
      }, function (err) {
        console.error(err);
        $scope.objects.newUser.errorMessage = err.message;
        $scope.objects.newUser.errorProps = err.attributes;
        $scope.$apply();
      });
    };
    $scope.openChangePassword = function (ku, user) {
      $scope.objects.newUser = user;
      $scope.objects.newUser.key = ku;
      $scope.objects.newUser.isEdit = true;
      $scope.objects.newUser.isPassEdit = true;
      $('#createUserModal').modal('show');
    };
    $scope.changePassword = function (user) {
      $scope.cleanUserErrors();
      nethserver.system.users.setPassword(user.key, user.password).then(function () {
        $('#createUserModal').modal('hide');
        $scope.$apply();
      }, function (err) {
        console.error(err);
        $scope.objects.newUser.errorMessage = err.message;
        $scope.objects.newUser.errorProps = err.attributes;
        $scope.$apply();
      });
    };

    $scope.openDeleteUser = function (ku, toDelete) {
      $scope.objects.toDelete = toDelete;
      $scope.objects.toDelete.isGroup = false;
      $scope.objects.toDelete.key = ku;
      $('#deleteModal').modal('show');
    };
    $scope.deleteUser = function (user) {
      $scope.cleanUserErrors();
      nethserver.system.users.deleteUser(user.key).then(function () {
        $('#deleteModal').modal('hide');
      }, function (err) {
        console.error(err);
      });
    };

    $scope.openCreateGroup = function () {
      $scope.objects.newGroup = {
        selectedUser: null,
        members: []
      };
      $('#createGroupModal').modal('show');
    };
    $scope.addGroup = function (group) {
      $scope.cleanGroupErrors();
      nethserver.system.users.addGroup(group).then(function () {
        $('#createGroupModal').modal('hide');
      }, function (err) {
        console.error(err);
        $scope.objects.newGroup.errorMessage = err.message;
        $scope.objects.newGroup.errorProps = err.attributes;
        $scope.$apply();
      });
    };

    $scope.openEditGroup = function (kg, group) {
      $scope.objects.newGroup = group;
      $scope.objects.newGroup.key = kg;
      $scope.objects.newGroup.isEdit = true;
      $scope.objects.newGroup.loadMembers = true;
      nethserver.system.users.getGroupMembers(kg).then(function (members) {
        $scope.objects.newGroup.members = members;
        $scope.objects.newGroup.loadMembers = false;
        $scope.$apply();
      }, function (err) {
        console.error(err);
        $scope.objects.newGroup.loadMembers = false;
      });
      $('#createGroupModal').modal('show');
    };
    $scope.editGroup = function (group) {
      $scope.cleanGroupErrors();
      nethserver.system.users.editGroup(group).then(function () {
        $('#createGroupModal').modal('hide');
      }, function (err) {
        console.error(err);
        $scope.objects.newGroup.errorMessage = err.message;
        $scope.objects.newGroup.errorProps = err.attributes;
        $scope.$apply();
      });
    };

    $scope.openDeleteGroup = function (kg, toDelete) {
      $scope.objects.toDelete = toDelete;
      $scope.objects.toDelete.isGroup = true;
      $scope.objects.toDelete.key = kg;
      $('#deleteModal').modal('show');
    };
    $scope.deleteGroup = function (group) {
      $scope.cleanGroupErrors();
      nethserver.system.users.deleteGroup(group.key).then(function () {
        $('#deleteModal').modal('hide');
      }, function (err) {
        console.error(err);
      });
    };

    $scope.updateValues = function (k, v) {
      $scope.objects.newProvider.info[k] = v;
    };

    $scope.uninstallProvider = function () {
      nethserver.system.provider.uninstall().then(function () {
        $('#changeProviderModal').modal('hide');
        $scope.localSystem.users.provider = null;
        $scope.localSystem.users.chooseProvider = null;
        $scope.localSystem.users.chooseBind = null;
        $scope.localSystem.users.providerInfo = {};
        $scope.$apply();
      }, function (err) {
        console.error(err);
      });
    };

    $scope.bindToRemoteLdap = function (newProvider) {
      nethserver.system.provider.bindToRemoteLdap(newProvider.info).then(function () {
        $('#accountProviderWizard').modal('hide');
      }, function (err) {
        console.error(err);
      });
    };
    $scope.changeBindType = function (v) {
      $scope.objects.newProvider.info.BindType = v ? 'authenticated' : 'anonymous';
    };
    $scope.changeStartTLS = function (v) {
      $scope.objects.newProvider.info.StartTls = v ? 'enabled' : 'disabled';
    };
    $scope.checkLdapConfig = function (newProvider) {
      $scope.objects.newProvider.isChecking = true;
      $scope.objects.newProvider.info = {};
      nethserver.system.provider.probeLdap(newProvider.hostname, newProvider.tcpport).then(function (info) {
        $scope.objects.newProvider.info = info;
        $scope.objects.newProvider.probeError = false;
        $scope.objects.newProvider.isChecking = false;
        $scope.$apply();
      }, function (err) {
        console.error(err);
        $scope.objects.newProvider.probeError = true;
        $scope.objects.newProvider.isChecking = false;
        $scope.$apply();
      });
    };

    $scope.installLDAP = function () {
      nethserver.system.provider.installLocalLdap().then(function () {
        $('#accountProviderWizard').modal('hide');
        $scope.$apply();
      }, function (err) {
        console.error(err);
      });
    };

    $scope.checkAdConfig = function (newProvider) {
      $scope.objects.newProvider.isChecking = true;
      $scope.objects.newProvider.info = {};
      nethserver.system.provider.probeAd(newProvider.Realm, newProvider.adDNSServer).then(function (info) {
        $scope.objects.newProvider.info = info;
        $scope.objects.newProvider.probeError = false;
        $scope.objects.newProvider.isChecking = false;
        $scope.$apply();
      }, function (err) {
        console.error(err);
        $scope.objects.newProvider.probeError = true;
        $scope.objects.newProvider.isChecking = false;
        $scope.$apply();
      });
    };
    $scope.joinADomain = function (newProvider) {
      nethserver.system.provider.joinDomain(newProvider.info).then(function () {
        $('#accountProviderWizard').modal('hide');
      }, function (err) {
        console.error(err);
      });
    };

    $scope.createDC = function (newProvider) {
      nethserver.system.provider.installLocalAd(newProvider).then(function () {
        $('#accountProviderWizard').modal('hide');
      }, function (err) {
        console.error(err);
      });
    };

    $scope.getInfo();
    $scope.getUsers();
    $scope.getGroups();

    nethserver.eventMonitor.addEventListener('nsevent.succeeded', function (success) {
      $scope.getInfo();
      $scope.getUsers();
      $scope.getGroups();
    });

  });
