/**
 * Created by Kelv on 09/02/2015.
 */
/*globals angular, console, document, done, gapi */

angular.module('app').controller('roomController', function (durationService, stompClientService, playerService, $scope, googleApiService, $http, $q, $stateParams, subscribeEventService) {
    'use strict';
    var currentVideoLength,
        player,
        search,
        searchData,
        roomName;

    $scope.roomName = $stateParams.roomName;

    $scope.setVideoId = function (videoId) {
        $scope.videoId = videoId;
    };

    $scope.videoRequest = function (videoId) {
        var deferred = $q.defer();
        googleApiService.sendRequest({
            'path': '/youtube/v3/videos',
            'params': {
                'part': 'contentDetails',
                'id': videoId
            }
        }).then(function (response) {
            currentVideoLength = response.items[0].contentDetails.duration;
            $scope.$apply();
            deferred.resolve();
        }, function (reason) {
            console.log('Error: ' + reason.error.message);
            $scope.$apply();
            deferred.reject();
        });
        return deferred.promise;
    };

    $scope.loadNewVideo = function (videoId) {
        player.loadVideoById(videoId, 5, "large");
    };

    function connect(roomName) {
        stompClientService.connect(roomName, function (message) {
            message = JSON.parse(message.body);
            console.log('greeting.body is: ' + message);

            if (Math.abs(message.seek - playerService.getCurrentTime) > 4) {
                playerService.seekTo(playerService.getCurrentTime());
                stompClient.send("/app/room/" + room + "/seek", {}, JSON.stringify({
                    'milliseconds': seek
                }));
            }

            if (message.playback === 'PLAY') {
                console.log("Playback: play has been receied");
                //$scope.loadYTVideo(videoId);
                playerService.playVideo();
            }

            if (message.playlist === 'NEXT') {
                $http.get('http://localhost:8080/room/' + roomName + '/current')
                    .then(function (playlist) {
                        console.log(playlist);
                        playerService.cueVideoById(playlist.data.id);

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

                //$rootScope.$broadcast()
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
    }

    $scope.play = function () {
        stompClientService.sendPlay();
    };

    $scope.pause = function () {
        stompClientService.sendPause();
    };

    $scope.addMedia = function (videoId) {
        var length;
        $scope.videoRequest(videoId).then(function () {
            length = durationService.convert(currentVideoLength);
            console.log('Length inside addMedia() is ' + length + ' and currentVideoLength is ' + currentVideoLength);
            stompClientService.addToQueue(videoId, length);
        }, function (reason) {
            console.log(reason);
        });
    };

    connect($stateParams.roomName);
});