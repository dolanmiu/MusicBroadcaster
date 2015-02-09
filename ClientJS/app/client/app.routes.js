/**
 * Created by Kelv on 08/02/2015.
 */
angular.module('app')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'client/components/home/partial.home.html'
            }
        )
            .state('room',{
                url:'/room',
                templateUrl: 'client/shared/room/partial.room.html'

            });
        $urlRouterProvider.otherwise('home');
    });