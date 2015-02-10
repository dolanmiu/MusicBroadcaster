/**
 * Created by Kelv on 09/02/2015.
 */
/*globals angular, console, document */

angular.module('app').controller('searchController', function ($scope, googleApiService, $window) {
    'use strict';
    var self = this,
        player;

    $scope.channel = {};

    $scope.onClientLoad = function () {
        console.log("hello");
        googleApiService.handleClientLoad().then(function (data) {
            $scope.channel = data;
        }, function (error) {
            console.log('Failed: ' + error);
        });
    };

    //$scope.watch('$viewContentLoaded',function(){
    //    googleApiService.handleClientLoad().then(function(data){
    //        console.log(data);
    //    });
    //});

    $scope.setApiKey = function () {
        googleApiService.handleClientLoad();
    };

    $scope.submitSearch = function () {
        var search = $scope.searchValue,
            restRequest = gapi.client.request({
                'path': '/youtube/v3/search',
                'params': {
                    'part': 'snippet',
                    'q': search,
                    'order': 'relevance',
                    'type': 'video'

                }
            });

        restRequest.then(function (response) {
            console.log(response.result);
            self.searchResults = response.result;
        }, function (reason) {
            console.log('Error: ' + reason.result.error.message);
        });

    };

    $scope.setVideoId = function (videoId) {
        $scope.videoId = videoId;
    };


    $scope.checkResults = function () {
        console.log(self.searchResults);
    };


    $scope.loadYTVideo = function (videoId) {
        if (player === undefined) {
            var tag = document.createElement('script'),
                targetTag = document.getElementById('hello');

            tag.src = "https://www.youtube.com/iframe_api";
            targetTag.parentNode.insertBefore(tag, targetTag);

            $window.onYouTubeIframeAPIReady = function () {
                player = new YT.Player('player', {
                    height: '390',
                    width: '640',
                    videoId: videoId,
                    events: {
                        'onReady': function (event) {
                            event.target.playVideo();
                        },
                        'onStateChange': function (event) {
                            if (event.data === YT.PlayerState.PLAYING && !done) {
                                setTimeout(stopVideo, 6000);
                                done = true;
                            }
                        }
                    }
                });
            };
        } else {
            player.loadVideoById(videoId, 5, "large");
        }
    };


    $scope.loadNewVideo = function (videoId) {
        player.loadVideoById(videoId, 5, "large");
    };


});