'use strict';

/**
 * @ngdoc overview
 * @name appsAngularApp
 * @description
 * # appsAngularApp
 *
 * Main module of the application.
 */
angular
  .module('appsAngularApp', [
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngAnimate'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/details/:app', {
        templateUrl: 'views/details.html',
        controller: 'DetailsCtrl',
        controllerAs: 'details'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
