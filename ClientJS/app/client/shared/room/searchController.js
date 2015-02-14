/**
 * Created by Kelv on 09/02/2015.
 */
/*globals angular, console, document, done */

angular.module('app').controller('searchController', function (playerService, $scope, googleApiService, $http, $q, webSocketService) {
    'use strict';
    var currentVideoLength,
        player;

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
            console.log($scope.searchResults);
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
                console.log(response.result);
                currentVideoLength = response.result.items[0].contentDetails.duration;
                console.log("video req shows video length to be" + $scope.currentVideoLength);
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
        console('createRoom() is running');
        $http.get(name).then(function (response) {
            console.log(response);
        });
    };

//function setConnected(connected) {
//    document.getElementById('connect').disabled = connected;
//    document.getElementById('disconnect').disabled = !connected;
//    document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
//    document.getElementById('response').innerHTML = '';
//}

    $scope.connect = function (roomName) {
        var socket = new SockJS('http://localhost:8080/channels');
        $scope.stompClient = Stomp.over(socket);
        $scope.stompClient.connect({}, function (frame) {
            //setConnected(true);
            //console.log($scope.roomName);
            console.log('Connected: ' + frame);
            $scope.stompClient.subscribe('/room/' + $scope.roomName, function (greeting) {
                // showGreeting(JSON.parse(greeting.body).content);
                //console.log('greeting.body is: ' + greeting.body);

                greeting = JSON.parse(greeting.body);
                console.log('greeting.body.media is: ' + greeting);
                if (greeting.playback === 'PLAY') {
                    console.log("Playback: play has been received");
                    //$scope.loadYTVideo(videoId);
                    player.playVideo();
                }

                if (greeting.playlist === 'NEXT') {
                    $http.get('http://localhost:8080/room/' + $scope.roomName + '/current')
                        .then(function (playlist) {
                            console.log(playlist);
                            player.cueVideoById(playlist.data.id);
                        });

                }

                if (greeting.media === 'ADDED') {
                    var deferred = $q.defer();
                    console.log('Media has been added');
                    $http.get('http://localhost:8080/room/' + $scope.roomName + '/current')
                        .then(function (queue) {
                            console.log('Queue data from GET is: ' + JSON.stringify(queue));
                            if (player === undefined) {
                                playerService.loadPlayer().then(function (newPlayer) {
                                    // $scope.addMedia(queue.data[0].id);
                                    player = newPlayer;
                                    player.cueVideoById(queue.data.id);
                                });
                                //queue.data[0].id
                            }
                        });
                }

                if (greeting.playback === 'PAUSE') {
                    console.log('Media has been paused');
                    player.pauseVideo();
                }

                console.log("received broadcasted data");
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
//
//function showGreeting(message) {
//    var response = document.getElementById('response');
//    var p = document.createElement('p');
//    p.style.wordWrap = 'break-word';
//    p.appendChild(document.createTextNode(message));
//    response.appendChild(p);
//}

    $scope.play = function () {
        $scope.stompClient.send("/app/room/" + $scope.roomName + "/play", {});
        player.playVideo();
    };

    $scope.pause = function () {
        $scope.stompClient.send("/app/room/" + $scope.roomName + "/pause", {});
        player.pauseVideo();
    };

    function seek() {
        var seek = document.getElementById('see kValue').value;
        stompClient.send("/app/room/" + room + "/seek", {}, JSON.stringify({
            'milliseconds': seek
        }));
    }

    $scope.addMedia = function (videoId) {
        var id = videoId;
        //console.log(videoId + " " + $scope.currentVideoLength);
        var length;

        $scope.videoRequest(videoId)
            .then(function () {

                length = $scope.durationToMilliseconds(currentVideoLength);
                console.log('Length inside addMedia() is ' + length + ' and currentVideoLength is ' + currentVideoLength);
                sendMediaToServer(id, length);
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
        console.log(totalMilliSeconds);
        return totalMilliSeconds;
    };
})
;