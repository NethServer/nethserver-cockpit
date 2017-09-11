'use strict';

/**
 * @ngdoc overview
 * @name systemAngularApp
 * @description
 * # systemAngularApp
 *
 * Main module of the application.
 */
angular
  .module('systemAngularApp', [
    'ngResource',
    'ngRoute',
    'ngSanitize'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        name: 'Main',
        description: 'Main system view',
        icon: 'pficon pficon-home',
      })
      .when('/disk-usage', {
        templateUrl: 'views/disk-usage.html',
        controller: 'DiskUsageCtrl',
        controllerAs: 'diskUsage',
        name: 'Disk usage',
        description: 'Check usage of your disk',
        icon: 'pficon pficon-volume',
      })
      .when('/services', {
        templateUrl: 'views/services.html',
        controller: 'ServicesCtrl',
        controllerAs: 'services',
        name: 'Services',
        description: 'Manage your system services',
        icon: 'fa fa-fighter-jet',
      })
      .when('/users-groups', {
        templateUrl: 'views/users-groups.html',
        controller: 'UsersGroupsCtrl',
        controllerAs: 'usersGroups',
        name: 'User and Groups',
        description: 'Manage your users and groups',
        icon: 'pficon pficon-users',
      })
      .when('/dns', {
        templateUrl: 'views/dns.html',
        controller: 'DnsCtrl',
        controllerAs: 'dns',
        name: 'DNS',
        description: 'Manage your DNS servers',
        icon: 'pficon pficon-regions',
      })
      .when('/network', {
        templateUrl: 'views/network.html',
        controller: 'NetworkCtrl',
        controllerAs: 'network',
        name: 'Network',
        description: 'Network settings',
        icon: 'pficon pficon-network',
      })
      .when('/organization', {
        templateUrl: 'views/organization.html',
        controller: 'OrganizationCtrl',
        controllerAs: 'organization',
        name: 'Organization',
        description: 'Manage your organization information',
        icon: 'fa fa-building',
      })
      .when('/certificates', {
        templateUrl: 'views/certificates.html',
        controller: 'CertificatesCtrl',
        controllerAs: 'certificates',
        name: 'Certificates',
        description: 'Manage your server certificates',
        icon: 'fa fa-key',
      })
      .otherwise({
        redirectTo: '/'
      });
  });
