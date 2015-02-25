/*globals angular */
angular.module('app').directive("menu", function () {
    'use strict';
    return {
        restrict: "E",
        template: "<div ng-class='{ show: visible, left: alignment === \"left\", right: alignment === \"right\" }' ng-transclude></div>",
        transclude: true,
        scope: {
            visible: "=",
            alignment: "@"
        }
    };
});

angular.module('app').directive("menuItem", function () {
    'use strict';
    return {
        restrict: "E",
        template: "<div ng-click='navigate()' ng-transclude></div>",
        transclude: true,
        scope: {
            hash: "@"
        },
        link: function ($scope) {
            $scope.navigate = function () {
                window.location.hash = $scope.hash;
            };
        }
    };
});