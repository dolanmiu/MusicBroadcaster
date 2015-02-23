/**
 * Created by Kelv on 08/02/2015.
 */
/*globals angular */
angular.module('app')
    .config(function ($stateProvider, $urlRouterProvider) {
        'use strict';
        $stateProvider
            .state('root.room', {
                url: '/room/{roomName}',
                views: {
                    'header@root': {
                        templateUrl: 'client/components/root/partial.nonstickheader.html'
                    },
                    'main@root': {
                        templateUrl: 'client/components/room/templates/partial.room.html',
                        controller: 'roomController'
                    }
                }
            });
        $urlRouterProvider.otherwise('home');
    });