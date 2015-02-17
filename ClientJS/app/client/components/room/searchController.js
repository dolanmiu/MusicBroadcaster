/**
 * Created by Kelv on 09/02/2015.
 */
/*globals angular, console, document, done */

angular.module('app').controller('searchController', function (stompClientService, playerService, $scope, googleApiService, $http, $q) {
    'use strict';
    var currentVideoLength,
        player,
        roomName,
        self = this;

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
        console.log('API key set');
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
            //console.log($scope.searchResults);
            $scope.$apply();
        }, function (reason) {
            console.log('Error: ' + reason.result.error.message);
            $scope.$apply();
        });

    };

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
                //console.log(response.result);
                currentVideoLength = response.result.items[0].contentDetails.duration;
                //console.log("video req shows video length to be" + $scope.currentVideoLength);
                //$scope.addMedia(videoId);
                $scope.apply;
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

// DOLAN'S CODE
// ================================================================================================

    var stompClient = null,
        room = "fuckyou";

    $scope.createRoom = function () {
        var name = 'http://localhost:8080/room/create?name=' + $scope.roomName;
        console.log('createRoom() is running' + name);
        $http.get(name).then(function (response) {
            console.log(response.data);
        });
    };

    $scope.connect = function (roomName) {
        console.log(roomName);

        stompClientService.connect(roomName, function (greeting) {
            greeting = JSON.parse(greeting.body);
            console.log('greeting.body is: ' + greeting);

            if (greeting.playback === 'PLAY') {
                console.log("Playback: play has been received");
                //$scope.loadYTVideo(videoId);
                setTimeout(function () {
                    //player.playVideo();
                    playerService.playVideo();
                }, 1000);
            }

            if (greeting.playlist === 'NEXT') {
                $http.get('http://localhost:8080/room/' + roomName + '/current')
                    .then(function (playlist) {
                        console.log(playlist);
                        playerService.cueVideoById(playlist.data.id);
                    });
            }

            if (greeting.media === 'ADDED') {

                console.log('Media has been added');
                $http.get('http://localhost:8080/room/' + roomName + '/current')
                    .then(function (queue) {
                        console.log('Queue data from GET is: ' + JSON.stringify(queue));
                        if (playerService.isPlayerLoaded() !== false) {
                            playerService.loadPlayer().then(function () {
                                playerService.cueVideoById(queue.data.id);
                                // playerService.seekTo(queue.data.currentSeek);
                                stompClientService.sendPlay();
                            });
                            //queue.data[0].id
                        }
                    });
            }
            if (greeting.playback === 'PAUSE') {
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

    function seek() {
        var seek = document.getElementById('seekValue').value;
        stompClient.send("/app/room/" + room + "/seek", {}, JSON.stringify({
            'milliseconds': seek
        }));
    }

    $scope.addMedia = function (videoId) {
        var length;
        $scope.videoRequest(videoId)
            .then(function () {
                length = $scope.durationToMilliseconds(currentVideoLength);
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
});