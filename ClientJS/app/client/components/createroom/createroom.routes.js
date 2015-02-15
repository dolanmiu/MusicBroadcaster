angular.module('app').config(function ($stateProvider, $urlRouterProvider) {
    'use strict';
    $stateProvider
        .state('root.home.createroom', {
            url: "^/add",
            onEnter: function ($stateParams, $rootScope, $state, ngDialog) {
                ngDialog.open({
                    controller: 'createroomController',
                    template: "client/components/createroom/partial.modal.html"
                });

                $rootScope.$on("ngDialog.closed", function (e, $dialog) {
                    $state.go("^");
                });
            }
        });
});