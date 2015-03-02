/*globals angular */
angular.module('app').service('subscribeEventService', function ($http, stompClientService, playerService) {
    'use strict';

    this.connect = function (roomName) {
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
                console.log("Playback: play has been receied");
                //$scope.loadYTVideo(videoId);
                setTimeout(function () {
                    //player.playVideo();
                    playerService.playVideo();
                }, 4000);
            }

            if (message.playlist === 'NEXT') {
                $http.get('http://localhost:8080/room/' + roomName + '/current')
                    .then(function (playlist) {
                        console.log(playlist);
                        playerService.cueVideoById(playlist.data.id);
                        //playerService.playVideo();
                        // $rootScope.refreshQueue = true;
                    });
            }
            if (message.media === 'ADDED') {

                console.log('Media has been added');
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
            }
            if (message.playback === 'PAUSE') {
                console.log('Media has been paused');
                playerService.pauseVideo();
            }
            console.log("received broadcasted data");
        }).then(function () {
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
    };
});