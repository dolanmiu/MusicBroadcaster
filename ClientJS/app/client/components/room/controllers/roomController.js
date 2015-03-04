/**
 * Created by Kelv on 09/02/2015.
 */
/*globals angular, console */
angular.module('app').controller('roomController', function ($rootScope, durationService, stompClientService, playerService, $scope, googleApiService, $http, $q, $stateParams, $interval) {
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
                $http.get('http://localhost:8080/room/' + roomName + '/current')
                    .then(function (playlist) {
                        console.log(playlist);
                        playerService.cueVideoById(playlist.data.id, playlist.data.currentSeek, 'hd1080');

                    });
            }
            if (message.media === 'ADDED') {

                console.log('Media has been added');
                $rootScope.$broadcast('refreshQueue');

                //$http.get('http://localhost:8080/room/' + roomName + '/current')
                //    .then(function (queue) {
                //        console.log('Queue data from GET is: ' + JSON.stringify(queue));
                //        if (playerService.isPlayerLoaded() !== false) {
                //            playerService.loadPlayer().then(function () {
                //                playerService.cueVideoById(queue.data.id);
                //                // playerService.seekTo(queue.data.currentSeek);
                //
                //                stompClientService.sendPlay();
                //                //$scope.refreshQueue = true;
                //            });
                //            //queue.data[0].id
                //        }
                //    });

                //$rootScope.$broadcast()
            }
            if (message.playback === 'PAUSE') {
                playerService.pauseVideo();
            }
            if (message.playlist === 'FINISHED') {
                playerService.stopVideo();
            }
        }).then(function () {
            $interval(function () {
                stompClientService.sendHeartBeat(playerService.getCurrentTime());
            }, 1000);
            //$http.get('http://localhost:8080/room/' + roomName + '/current')
            //    .then(function (queue) {
            //        var happy = JSON.stringify(queue);
            //        console.log('Queue data from GET is: ' + happy);
            //        // && happy.data !== undefined
            //        if (playerService.isPlayerLoaded() === false) {
            //            console.log(happy.data);
            //            playerService.loadPlayer().then(function () {
            //                playerService.cueVideoById(queue.data.id);
            //                playerService.seekTo(queue.data.currentSeek / 1000);
            //                stompClientService.sendPlay();
            //            });
            //            //queue.data[0].id
            //        }
            //    }, function (fail) {
            //        console.log(fail);
            //    });

        });
    }

    setTimeout(function () {
        $http.get('http://localhost:8080/room/' + stompClientService.getRoomName() + '/current')
            .then(function (queue) {
                playerService.cueVideoById(queue.data.id, queue.data.currentSeek / 1000, 'hd1080');
            });
    }, 2000);

    connect($stateParams.roomName);
});