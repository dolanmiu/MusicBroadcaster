/*globals angular, console */
angular.module('app').controller('queueController', function ($rootScope, $scope, $http, stompClientService) {
    'use strict';

    $scope.queueControl = {};
    $scope.queueArray = {};

    $scope.image = {};

    $scope.title = {};

    $scope.length = {};

    $scope.getQueue = function () {
        $http.get('http://localhost:8080/room/' + stompClientService.getRoomName() + '/playlist')
            .then(function (queue) {
                console.log(queue);
                //console.log($rootScope.refreshQueue);
            });
    };
});