/*globals angular */
angular.module('app').directive('createRoom', function () {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'client/components/create.join/templates/partial.create.html',
        controller: function ($scope, ngDialog, restService, $state, $rootScope) {
            'use strict';
            $scope.createdRoom = false;
            $scope.showError = false;
            $scope.url = '';

            $scope.createRoom = function () {

                restService.createRoom($scope.roomName).then(function (roomURL) {
                    $scope.createdRoom = true;
                    $scope.url = roomURL;
                }, function (reason) {
                    $scope.showError = true;
                });
            };

            $scope.goToRoom = function () {
                ngDialog.closeAll();
                $state.go('root.room', {
                    "roomName": $scope.roomName
                });
            };
        },
        link: function (scope, element, attrs, controllers) {}
    };
});