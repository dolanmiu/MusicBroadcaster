/*globals angular */
angular.module('app').controller('searchController', function (durationService, stompClientService, playerService, $scope, googleApiService, $http, $q, $stateParams, angularLoad, $window) {
    'use strict';

    var search, searchData;
    $scope.showNewSearchMessage = true;
    $scope.searchResultHeight = $window.innerHeight - 36;

    $scope.submitSearch = function () {
        search = $scope.searchValue;
        googleApiService.sendRequest({
            'path': '/youtube/v3/search',
            'params': {
                'part': 'snippet',
                'q': search,
                'order': 'relevance',
                'type': 'video'
            }
        }).then(function (data) {
            $scope.searchResultsArray = data.items;
            $scope.showNewSearchMessage = false;
            console.log($scope.searchResultsArray);
            searchData = data;
        }, function (reason) {
            console.log('Reason is: ' + reason);
        });
    };

    $scope.scrollDown = function () {
        var i;
        googleApiService.sendRequest({
            'path': '/youtube/v3/search',
            'params': {
                'part': 'snippet',
                'q': search,
                'order': 'relevance',
                'type': 'video',
                'pageToken': searchData.nextPageToken
            }
        }).then(function (data) {
            searchData = data.result;
            for (i = 0; i < data.result.items.length; i++) {
                $scope.searchResultsArray.push(data.result.items[i]);
            }
        }, function (reason) {
            console.log('Scroll down failed because: ' + reason);
        });
    };

    /*$scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
        $scope.searchResultHeight = newValue.h;
    }, true);*/

});