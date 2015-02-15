/*globals angular */
angular.module('app').controller('createroomController', function ($scope, ngDialog, restService, $state, $rootScope) {
    'use strict';

    $scope.createdRoom = false;
    $scope.url = '';

    $scope.createRoom = function () {
        $scope.createdRoom = true;

        restService.createRoom($scope.roomName).then(function (roomURL) {
            $scope.createdRoom = true;
            $scope.url = roomURL;
        }, function (reason) {
            console.log('Room failed to initialise because: ' + reason);
        });
    };

    $scope.goToRoom = function () {
        ngDialog.closeAll();
        $state.go('root.room', {
            "roomName": $scope.roomName
        });
    };


});