/*globals angular, console */
angular.module('app').controller('queueController', function ($rootScope, $scope, $http, stompClientService) {
    'use strict';

    $scope.queueControl = {};
    $scope.queueArray = {};

    $scope.image = {};

    $scope.title = {};

    $scope.length = {};

    function refreshQueue() {
        $http.get('http://localhost:8080/room/' + stompClientService.getRoomName() + '/playlist').then(function (queue) {
            console.log(queue.data);
            $scope.queueArray = queue.data;
        });
    }

    $scope.$on('refreshQueue', function () {
        refreshQueue();
    });
    
    refreshQueue();
});