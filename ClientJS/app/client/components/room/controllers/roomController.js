/**
 * Created by Kelv on 09/02/2015.
 */
/*globals angular, console */
angular.module('app').controller('roomController', function ($rootScope, durationService, stompClientService, playerService, $scope, googleApiService, $http, $q, $stateParams, $interval, userService) {
    'use strict';

    $scope.roomName = $stateParams.roomName;

    function connect(roomName) {
        stompClientService.connect(roomName, function (message) {
            message = JSON.parse(message.body);
            console.log('greeting.body is: ' + message);

            if (Math.abs(message.seek - playerService.getCurrentTime) > 4) {
                playerService.seekTo(playerService.getCurrentTime());
                stompClientService.send("/app/room/" + roomName + "/seek", {}, JSON.stringify({
                    'milliseconds': message.seek
                }));
            }

            if (message.playback === 'PLAY') {
                playerService.playVideo();
            }

            if (message.playlist === 'NEXT') {
                $http.get('http://localhost:8080/room/' + roomName + '/current').then(function (current) {
                    playerService.cueVideoById(current.data.media.id, current.data.media.currentSeek / 1000, 'hd1080');
                    $rootScope.$broadcast('refreshQueue');
                });
            }
            if (message.media === 'ADDED') {
                console.log('Media has been added');
                $rootScope.$broadcast('refreshQueue');
            }
            if (message.playback === 'PAUSE') {
                playerService.pauseVideo();
            }
            if (message.playlist === 'FINISHED') {
                playerService.stopVideo();
            }
            if (angular.isDefined(message.seek)) {
                if (message.excludeId === userService.id) {
                    return;
                }
                playerService.seekTo(message.seek);
            }
            if (message.req === 'seek') {
                stompClientService.sendHeartBeat(playerService.getCurrentTime());
            }
        }).then(function () {
            $rootScope.$broadcast('refreshQueue');
        });
    }

    connect($stateParams.roomName);
});