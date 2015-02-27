/**
 * Created by Kelv on 09/02/2015.
 */
/*globals angular, console, document, done, gapi */

angular.module('app').controller('roomController', function ($rootScope, durationService, stompClientService, playerService, $scope, googleApiService, $http, $q, $stateParams, angularLoad) {
    'use strict';
    var currentVideoLength,
        player,
        search,
        searchData,
        roomName;

    $scope.setVideoId = function (videoId) {
        $scope.videoId = videoId;
    };

    $scope.videoRequest = function (videoId) {
        var deferred = $q.defer();

        gapi.client.request({
            'path': '/youtube/v3/videos',
            'params': {
                'part': 'contentDetails',
                'id': videoId
            }
        })
            .then(function (response) {
                currentVideoLength = response.result.items[0].contentDetails.duration;
                $scope.$apply();
                deferred.resolve('Promise resolved');
            }, function (reason) {
                console.log('Error: ' + reason.result.error.message);
                $scope.$apply();
                deferred.reject('Promise rejected');
            });
        return deferred.promise;
    };

    $scope.loadNewVideo = function (videoId) {
        //$scope.videoRequest(videoId);
        //$scope.addMedia(videoId);
        player.loadVideoById(videoId, 5, "large");
    };

    $scope.createRoom = function () {
        var name = 'http://localhost:8080/room/create?name=' + $scope.roomName;
        console.log('createRoom() is running' + name);
        $http.get(name).then(function (response) {
            console.log(response.data);
        });
    };

    $scope.connect = function (roomName) {
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
                console.log("Playback: play has been received");
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
                $http.get('http://localhost:8080/room/' + roomName + '/current')
                    .then(function (queue) {
                        console.log('Queue data from GET is: ' + JSON.stringify(queue));
                        if (playerService.isPlayerLoaded() !== false) {
                            playerService.loadPlayer().then(function () {
                                playerService.cueVideoById(queue.data.id);
                                // playerService.seekTo(queue.data.currentSeek);
                                stompClientService.sendPlay();
                                //$scope.refreshQueue = true;
                            });
                            //queue.data[0].id
                        }
                    });
            }
            if (message.playback === 'PAUSE') {
                console.log('Media has been paused');
                playerService.pauseVideo();
            }
            console.log("received broadcasted data");
        }).then(function () {
            $http.get('http://localhost:8080/room/' + roomName + '/current')
                .then(function (queue) {
                    var happy = JSON.stringify(queue);
                    console.log('Queue data from GET is: ' + happy);
                    if (playerService.isPlayerLoaded() !== false && happy.data !== undefined) {
                        console.log(happy.data);
                        playerService.loadPlayer().then(function () {
                            playerService.cueVideoById(queue.data.id);
                            playerService.seekTo(queue.data.currentSeek / 1000);
                            stompClientService.sendPlay();
                        });
                        //queue.data[0].id
                    }
                }, function (fail) {
                    console.log(fail);
                });

        });
    };

    $scope.checkStomp = function () {
        console.log($scope.stompClient);
    };

    //function disconnect() {
    //    stompClient.disconnect();
    //    setConnected(false);
    //    console.log("Disconnected");
    //}
    //
    //function sendName() {
    //    var name = document.getElementById('name').value;
    //    stompClient.send("/app/room/" + room + "/get", {}, JSON.stringify({
    //        'name': name
    //    }));
    //}


    $scope.play = function () {
        stompClientService.sendPlay();
        //$scope.stompClient.send("/app/room/" + $scope.roomName + "/play", {});
        //player.playVideo();
    };

    $scope.pause = function () {
        stompClientService.sendPause();
        //player.pauseVideo();
    };


    function seektt() {
        var seek = document.getElementById('seekValue').value;
        stompClient.send("/app/room/" + room + "/seek", {}, JSON.stringify({
            'milliseconds': seek
        }));
    }

    $scope.addMedia = function (videoId) {
        var length;
        $scope.videoRequest(videoId)
            .then(function () {
                //length = $scope.durationToMilliseconds(currentVideoLength);
                length = durationService.convert(currentVideoLength);
                console.log('Length inside addMedia() is ' + length + ' and currentVideoLength is ' + currentVideoLength);
                //sendMediaToServer(id, length);
                stompClientService.addToQueue(videoId, length);
            }, function (reason) {
                console.log(reason);
            });
    };

    function sendMediaToServer(id, length) {
        $scope.stompClient.send("/app/room/" + $scope.roomName + "/add", {}, JSON.stringify({
            'id': id,
            'length': length
        }));
    }

    $scope.durationToMilliseconds = function (duration) {
        var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/,
            hours = 0,
            minutes = 0,
            seconds = 0,
            totalMilliSeconds;

        if (reptms.test(duration)) {
            var matches = reptms.exec(duration);
            if (matches[1]) {
                hours = Number(matches[1]);
            }
            if (matches[2]) {
                minutes = Number(matches[2]);
            }
            if (matches[3]) {
                seconds = Number(matches[3]);
            }
            totalMilliSeconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
        }
        return totalMilliSeconds;
    };


    $scope.onClientLoad = function () {
        console.log("hello");
        googleApiService.handleClientLoad().then(function (data) {
            $scope.channel = data;
        }, function (error) {
            console.log('Failed: ' + error);
        });
    };

    angularLoad.loadScript('https://apis.google.com/js/client.js')
        .then(function () {
            setApiKey();
        })
        .catch(function () {
            console.log('Error loading the script');
        });

    function setApiKey() {
        googleApiService.handleClientLoad();
        console.log('API key set');
    }


    $scope.connect($stateParams.roomName);
});