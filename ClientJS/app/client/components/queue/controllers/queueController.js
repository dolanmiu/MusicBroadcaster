/*globals angular, console */
angular.module('app').controller('queueController', function ($rootScope, $scope, $http, stompClientService) {
    'use strict';

    $scope.queueControl = {};
    $scope.queueArray = {};

    $scope.image = {};

    $scope.title = {};

    $scope.length = {};
    $scope.$on('refreshQueue', function () {
        //    Code to refresh the queue needed here.
        $http.get('http://localhost:8080/room/' + stompClientService.getRoomName() + '/playlist')
            .then(function (queue) {
                console.log(queue.data);
                $scope.queueArray = queue.data;
                //console.log($rootScope.refreshQueue);
            });
    });
    $scope.getQueue = function () {

    };
});