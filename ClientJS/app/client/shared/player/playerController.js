/**
 * Created by Kelv on 09/02/2015.
 */
/*globals angular, document, done, YT */
angular.module('app')
    .controller('playerController', function ($scope, $window) {
        'use strict';
        var player,
            videoId;

        $scope.createPlayer = function () {
            var tag = document.createElement('script'),
                targetTag = document.getElementById('hello');

            tag.src = "https://www.youtube.com/iframe_api";
            targetTag.parentNode.insertBefore(tag, targetTag);

            $window.onYouTubeIframeAPIReady = function () {
                player = new YT.Player('player', {
                    height: '390',
                    width: '640',
                    videoId: '51nAi3eDYN8',
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

        };


        $scope.loadNewVideo = function (videoId) {
            player.loadVideoById(videoId, 5, "large");
        };
    });