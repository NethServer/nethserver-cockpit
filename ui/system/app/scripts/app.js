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
        description: 'Main',
        icon: 'pficon pficon-home',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/disk-usage', {
        templateUrl: 'views/disk-usage.html',
        description: 'Disk Usage',
        icon: 'pficon pficon-volume',
        controller: 'DiskUsageCtrl',
        controllerAs: 'diskUsage'
      })
      .when('/services', {
        templateUrl: 'views/services.html',
        description: 'Services',
        icon: 'pficon pficon-on-running',
        controller: 'ServicesCtrl',
        controllerAs: 'services'
      })
      .when('/user-groups', {
        templateUrl: 'views/user-groups.html',
        description: 'Users and Groups',
        icon: 'pficon pficon-users',
        controller: 'UserGroupsCtrl',
        controllerAs: 'userGroups'
      })
      .when('/dns', {
        templateUrl: 'views/dns.html',
        description: 'DNS',
        icon: 'pficon pficon-regions',
        controller: 'DnsCtrl',
        controllerAs: 'dns'
      })
      .when('/date-time', {
        templateUrl: 'views/date-time.html',
        description: 'Date and Time',
        icon: 'fa fa-timer',
        controller: 'DateTimeCtrl',
        controllerAs: 'dateTime'
      })
      .when('/network', {
        templateUrl: 'views/network.html',
        description: 'Network',
        icon: 'pficon pficon-network',
        controller: 'NetworkCtrl',
        controllerAs: 'network'
      })
      .when('/organization', {
        templateUrl: 'views/organization.html',
        description: 'Organization',
        icon: 'fa fa-company',
        controller: 'OrganizationCtrl',
        controllerAs: 'organization'
      })
      .when('/certificates', {
        templateUrl: 'views/certificates.html',
        description: 'Certificates',
        controller: 'CertificatesCtrl',
        icon: 'pficon pficon-key',
        controllerAs: 'certificates'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
