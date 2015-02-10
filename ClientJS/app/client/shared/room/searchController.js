/**
 * Created by Kelv on 09/02/2015.
 */
/*globals angular, console, document, done */

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

    $scope.setApiKey = function () {
        googleApiService.handleClientLoad();
    };

    $scope.submitSearch = function () {
        var search = $scope.searchValue;
        gapi.client.request({
            'path': '/youtube/v3/search',
            'params': {
                'part': 'snippet',
                'q': search,
                'order': 'relevance',
                'type': 'video'

            }
        }).then(function (response) {
            $scope.searchResults = response.result;
            console.log($scope.searchResults);
            $scope.$apply();
        }, function (reason) {
            console.log('Error: ' + reason.result.error.message);
            $scope.$apply();
        });

    };

    $scope.setVideoId = function (videoId) {
        $scope.videoId = videoId;
    };


    $scope.checkResults = function () {
        console.log(self.searchResults);
    };

    $scope.$on("$destroy", function () {
        player = undefined;
    });

    $scope.loadYTVideo = function (videoId) {
        if (player === undefined) {
            var tag = document.createElement('script'),
                targetTag = document.getElementById('hello');

            tag.src = "https://www.youtube.com/iframe_api";
            targetTag.parentNode.insertBefore(tag, targetTag);

            $window.onYouTubeIframeAPIReady = function () {
                player = new YT.Player('player', {
                    height: '   390',
                    width: '640',
                    playerVars: {
                        controls: '1'
                    },
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

    $scope.play = function(){
        player.playVideo();
    };

    $scope.pause = function(){
        player.pauseVideo();
    }

    $scope.loadNewVideo = function (videoId) {
        player.loadVideoById(videoId, 5, "large");
    };


});