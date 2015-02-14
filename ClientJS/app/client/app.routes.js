/**
 * Created by Kelv on 08/02/2015.
 */
/*globals angular */
angular.module('app')
    .config(function ($stateProvider, $urlRouterProvider) {
        'use strict';
        $stateProvider
            .state('root', {
                abstract: true,
                name: '',
                url: '^',
                views: {
                    'root': {
                        templateUrl: 'client/components/root/partial.root.html'
                    },
                    'header@root': {
                        templateUrl: 'client/components/root/partial.header.html'
                    },
                    'footer@root': {}
                }
            })
            .state('root.home', {
                url: '/home',
                views: {
                    'main@root': {
                        templateUrl: 'client/components/home/partial.home.html'
                    }
                }
            })
            .state('root.room', {
                url: '/room',
                views: {
                    'main@root': {
                        templateUrl: 'client/shared/room/partial.room.html',
                        controller: 'searchController',
                        controllerAs: 'searchCtrl'
                    }
                }
            })
            .state('root.room.music', {
                url: '/room-music',
                views: {
                    '': {
                        templateUrl: 'client/shared/room/partial.room.music.html',
                        controller: 'searchController',
                        controllerAs: 'searchCtrl'
                    }
                }
            });
        $urlRouterProvider.otherwise('home');
    });