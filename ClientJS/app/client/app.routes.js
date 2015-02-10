/**
 * Created by Kelv on 08/02/2015.
 */
/*globals angular */
angular.module('app')
    .config(function ($stateProvider, $urlRouterProvider) {
        'use strict';
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'client/components/home/partial.home.html'
            })
            .state('room', {
                url: '/room',
                templateUrl: 'client/shared/room/partial.room.html',
                controller: 'searchController',
                controllerAs: 'searchCtrl'
            });
        $urlRouterProvider.otherwise('home');
    });