/*globals angular */
angular.module('app').controller('searchController', function (stompClientService, $scope, googleApiService, $http, $q, $stateParams, angularLoad, $window, durationService) {
    'use strict';

    var search, searchData;
    $scope.showNewSearchMessage = true;
    $scope.searchResultHeight = $window.innerHeight - 36;

    function videoRequest(videoId) {
        var deferred = $q.defer();
        googleApiService.sendRequest({
            'path': '/youtube/v3/videos',
            'params': {
                'part': 'contentDetails',
                'id': videoId
            }
        }).then(function (response) {
            var currentVideoLength = response.items[0].contentDetails.duration;

            console.log('videoRequest response is: ' + JSON.stringify(response.items[0]));
            //$scope.$apply();
            deferred.resolve(currentVideoLength);
        }, function (reason) {
            //$scope.$apply();
            deferred.reject();
        });
        return deferred.promise;
    }

    $scope.submitSearch = function () {
        search = $scope.searchValue;
        googleApiService.sendRequest({
            'path': '/youtube/v3/search',
            'params': {
                'part': 'snippet',
                'q': search,
                'order': 'relevance',
                'type': 'video',
                'maxResults': '15'
            }
        }).then(function (data) {
            $scope.searchResultsArray = data.items;
            $scope.showNewSearchMessage = false;
            searchData = data;
            console.log($scope.searchResultsArray);
        }, function (reason) {
            console.log(reason);
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
            for (i = 0; i < data.result.items.length; i += 1) {
                $scope.searchResultsArray.push(data.result.items[i]);
            }

        }, function (reason) {
            console.log('Scroll down failed because: ' + reason);
        });
    };

    $scope.addMedia = function (searchResult) {
        console.log(searchResult);
        videoRequest(searchResult.id.videoId).then(function (currentVideoLength) {
            var length = durationService.convert(currentVideoLength);
            stompClientService.addToQueue(searchResult.id.videoId, length, searchResult.snippet.title, searchResult.snippet.thumbnails.medium.url);
        }, function (reason) {
            console.log(reason);
        });
    };

    /*$scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
     $scope.searchResultHeight = newValue.h;
     }, true);*/

});