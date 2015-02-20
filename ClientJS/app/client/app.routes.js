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
            });
        $urlRouterProvider.otherwise('home');
    });