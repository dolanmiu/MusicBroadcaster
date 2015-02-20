/*globals angular */
angular.module('app')
    .config(function ($stateProvider, $urlRouterProvider) {
        'use strict';
        $stateProvider
            .state('root.create', {
                url: '/create',
                views: {
                    'main@root': {
                        templateUrl: 'client/components/create.join/templates/partial.createjoin.html'
                    },
                    'header@root': {
                        templateUrl: 'client/components/root/partial.nonstickheader.html'
                    },
                    'create@root.create': {
                        templateUrl: 'client/components/create.join/templates/partial.create.html',
                        controller: 'createroomController'

                    },
                    'join@root.create': {
                        templateUrl: 'client/components/create.join/templates/partial.join.html',
                        controller: 'joinRoomController'
                    }
                }
            })        
        .state('root.home.create', {
            onEnter: function ($document, $location, $anchorScroll, anchorSmoothScroll) {
                if (document.readyState === "complete") {
                    $document.scrollTop(0, 500);
                }
            }
        });
        $urlRouterProvider.otherwise('home');
    });