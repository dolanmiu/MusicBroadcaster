/**
 * Created by Kelv on 09/02/2015.
 */
/*globals angular, console, document, done */

angular.module('app').controller('searchController', function ($scope, googleApiService, $window, $http, $q) {
    'use strict';
    var self = this,
        currentVideoLength,
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


    $scope.checkResults = function () {
        console.log(self.searchResults);
    };

    $scope.$on("$destroy", function () {
        player = undefined;
    });

    $scope.loadYTVideo = function (videoId) {
        if (player === undefined) {
            var tag = document.createElement('script'),
                targetTag = document.getElementById('hello');

            tag.src = "https://www.youtube.com/iframe_api";
            targetTag.parentNode.insertBefore(tag, targetTag);

            $window.onYouTubeIframeAPIReady = function () {
                player = new YT.Player('player', {
                    height: '390',
                    width: '640',
                    playerVars: {
                        controls: '1',
                        rel: '0'
                    },
                    videoId: videoId,
                    events: {
                        'onReady': function (event) {
                            event.target.playVideo();
                        },
                        'onStateChange': function (event) {
                            if (event.data === YT.PlayerState.PLAYING && !done) {
                                setTimeout(stopVideo, 6000);
                                done = true;
                            }
                        }
                    }
                });
            };
        } else {
            //player.loadVideoById(videoId, 5, "large");
            $scope.loadNewVideo(videoId);
        }
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
        return deferred.promise();
    };

    $scope.loadNewVideo = function (videoId) {
        $scope.videoRequest(videoId);
        //$scope.addMedia(videoId);
        player.loadVideoById(videoId, 5, "large");
    };

    // DOLAN'S CODE
    // ================================================================================================

    var stompClient = null;
    var room = "fuckyou";

    $scope.createRoom = function () {
        var name = 'http://localhost:8080/room/create?name=' + $scope.roomName;

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
        var seek = document.getElementById('seekValue').value;
        stompClient.send("/app/room/" + room + "/seek", {}, JSON.stringify({
            'milliseconds': seek
        }));
    }

    $scope.addMedia = function (videoId) {
        var id = videoId;
        console.log(videoId + " " + $scope.currentVideoLength);
        var length;

        $scope.videoRequest(videoId)
            .then(function () {
                length = $scope.durationToMilliseconds($scope.currentVideoLength);
            }, function (reason) {
                console.log(reason);
            });


        //console.log(length);
        ////var length = $scope.currentVideoLength * 1000;
        //console.log(length);
        $scope.stompClient.send("/app/room/" + room + "/add", {}, JSON.stringify({
            'id': id,
            'length': length
        }));
    };

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
});