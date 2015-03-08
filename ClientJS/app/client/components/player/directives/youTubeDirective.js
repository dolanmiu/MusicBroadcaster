/**
 * Created by Kelv on 09/02/2015.
 */
/*globals angular, console, YT, document */
angular.module('app').directive('youtube', function (stompClientService, playerService, $window, angularLoad, googleApiService, restService, $http) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            height: '=',
            width: '=',
            videoId: '='
        },
        transclude: true,
        template: '<div id="youtube-wrapper"></div>',
        controller: function ($rootScope, $scope, durationService, $q, stompClientService, playerService) {
            var player;

            $scope.onPlayerStateChange = function (event) {
                console.log("State is changed.... State is now: " + event.data);

                if (event.data === YT.PlayerState.PLAYING) {
                    stompClientService.sendPlay();
                }
                if (event.data === YT.PlayerState.ENDED) {
                    console.log('song ended');
                }

                if (event.data === YT.PlayerState.PAUSED) {
                    stompClientService.sendPause();
                    console.log('State changed paused, ws pause sent');
                }

                if (event.data === YT.PlayerState.CUED) {
                    //stompClientService.sendPlay();
                    console.log('State is cued');
                }
            };

            $scope.getCurrentTime = function () {
                return durationService.convert(player.getCurrentTime());
            };

            $scope.cueVideoById = function (videoId) {
                var deferred = $q.defer();
                player.cueVideoById(videoId).then(function (success) {
                    deferred.resolve();
                }, function (fail) {
                    deferred.reject();
                });
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
            element.children().append(tag);

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
                            playerService.setPlayer(scope.player);
                            $http.get('http://localhost:8080/room/' + stompClientService.getRoomName() + '/current').then(function (current) {
                                playerService.cueVideoById(current.data.media.id, current.data.media.currentSeek / 1000, 'hd1080');
                                if (current.data.playStatus === 'PLAY') {
                                    scope.player.playVideo();
                                }
                            });
                        },
                        'onStateChange': scope.onPlayerStateChange
                    }
                });
            };
        }

    };

});