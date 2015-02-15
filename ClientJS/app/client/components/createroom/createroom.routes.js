angular.module('app').controller('createroomController', function (ngDialog) {
    'use strict';

});

angular.module('app').config(function ($stateProvider, $urlRouterProvider) {
    'use strict';
    $stateProvider
        .state('root.home.createroom', {
            url: "^/add",
            onEnter: function ($stateParams, $rootScope, $state, ngDialog) {
                ngDialog.open({
                    //controller: moduleNamespace.clientAddController,
                    //template: "app/client/templates/client-add.tpl.html"
                });

                $rootScope.$on("ngDialog.closed", function (e, $dialog) {
                    $state.go("^");
                });
            }
        });
});