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
                    'footer@root': {
                        templateUrl: 'client/components/root/partial.footer.html'
                    }
                }
            })
            .state('root.room', {
                url: '/room/{roomName}',
                views: {
                    'main@root': {
                        templateUrl: 'client/components/room/partial.room.html',
                        controller: 'searchController',
                        controllerAs: 'searchCtrl'
                    }
                }
            })
            .state('root.room.music', {
                url: '/room-music',
                views: {
                    '': {
                        templateUrl: 'client/components/room/partial.room.music.html',
                        controller: 'searchController',
                        controllerAs: 'searchCtrl'
                    }
                }
            });
        $urlRouterProvider.otherwise('home');
    });