/*globals angular */
angular.module('app').controller('joinRoomController', function ($scope, $http, $state) {
    'use strict';

    $scope.join = function () {
        var name = 'http://localhost:8080/room/check?name=' + $scope.roomName;
        $http.get(name).then(function (response) {
            if (response.data) {
                $scope.showError = true;
            } else {
                $state.go('root.room', {
                    roomName: $scope.roomName
                });
            }
        });
    };
});