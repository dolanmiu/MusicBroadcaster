/**
 * Created by Kelv on 09/02/2015.
 */
/*globals angular, console, YT */
angular.module('app').directive('youtube', function ($window, angularLoad, googleApiService) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            height: '=',
            width: '=',
            videoId: '='
        },
        template: '',
        controller: function ($scope, durationService, $q, stompClientService) {
            var player,
                self = this;

            $scope.onPlayerStateChange = function (event) {
                console.log("State is changed.... State is now: " + event.data);

                if (event.data === 1) {
                    stompClientService.sendPlay();
                }

                if (event.data === 2) {
                    stompClientService.sendPause();
                    console.log('State changed to 2, ws pause sent');
                }
            };

            $scope.getCurrentTime = function () {
                return durationService.convert(player.getCurrentTime());
            };


            $scope.cueVideoById = function (videoId) {
                var deferred = $q.defer();
                player.cueVideoById(videoId)
                    .then(function (success) {
                        deferred.resolve();
                    }, function (fail) {
                        deferred.reject();
                    });
            };

            $scope.playVideo = function () {
                player.playVideo();
            };

            $scope.pauseVideo = function () {
                player.pauseVideo();
            };

            $scope.seekTo = function (milliseconds) {
                player.seekTo(milliseconds, false);
            };
        },
        link: function (scope, element, attrs, controller) {
            angularLoad.loadScript('https://apis.google.com/js/client.js').then(function () {
                googleApiService.handleClientLoad();
                console.log('API key set');
            });

            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            element.append(tag);

            $window.onYouTubeIframeAPIReady = function () {
                scope.player = new YT.Player('player', {
                    height: scope.height,
                    width: scope.width,
                    playerVars: {
                        controls: '1',
                        rel: '0',
                        modestbranding: '1',
                        autoplay: '1'
                    },
                    events: {
                        'onReady': function () {
                            console.log('player has been created');
                        },
                        'onStateChange': scope.onPlayerStateChange
                    }
                });
            };
        }

    };

});