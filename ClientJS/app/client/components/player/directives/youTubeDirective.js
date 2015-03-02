/**
 * Created by Kelv on 09/02/2015.
 */
/*globals angular, console, YT, document */
angular.module('app').directive('youtube', function (stompClientService, playerService, $window, angularLoad, googleApiService, restService) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            height: '=',
            width: '=',
            videoId: '='
        },
        template: '',
        controller: function ($rootScope, $scope, durationService, $q, stompClientService, playerService) {
            var player;

            $scope.onPlayerStateChange = function (event) {
                console.log("State is changed.... State is now: " + event.data);

                if (event.data === 1) {
                    stompClientService.sendPlay();
                }

                if (event.data === 2) {
                    stompClientService.sendPause();
                    console.log('State changed to 2, ws pause sent');
                }

                if (event.data === 5) {
                    stompClientService.sendPlay();

                    console.log('State is cued, will send play');
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
                playerService.playVideo();
            };


            $scope.loadCurrentSong = function () {
                var currentSong = restService.getCurrentSong(roomName);

                $scope.cueVideoById(videoId);

            };

            $scope.pauseVideo = function () {
                player.pauseVideo();
            };

            $scope.seekTo = function (milliseconds) {
                player.seekTo(milliseconds, false);
            };

            $scope.$on('setRoom', function () {
                $scope.roomName = stompClientService.getRoomName();
                console.log($scope.roomName);
            });

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
                            playerService.setPlayer(scope.player);

                        },
                        'onStateChange': scope.onPlayerStateChange
                    }
                });
            };
        }

    };

});