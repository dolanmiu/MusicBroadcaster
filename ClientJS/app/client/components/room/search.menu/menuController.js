/*globals angular */
angular.module('app').controller("menuController", function ($scope, $rootScope) {
    'use strict';
    function close() {
        $scope.$apply(function () {
            $scope.close();
        });
    }
    
    $scope.leftVisible = false;
    $scope.rightVisible = false;

    $scope.close = function () {
        $scope.leftVisible = false;
        $scope.rightVisible = false;
    };

    $scope.showLeft = function (e) {
        $scope.leftVisible = true;
        e.stopPropagation();
    };

    $scope.showRight = function (e) {
        $scope.rightVisible = true;
        e.stopPropagation();
    };

    $rootScope.$on("documentClicked", close);
    $rootScope.$on("escapePressed", close);
});