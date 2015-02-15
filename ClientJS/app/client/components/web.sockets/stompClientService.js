/**
 * Created by Kelv on 15/02/2015.
 */
/*globals console, Stomp, SockJS, angular */
angular.module('app').service('stompClientService', function (playerService, $http) {
    'use strict';
    var stompClient = null,
        player = null,
        roomName,
        self = this;
    this.connect = function (roomNameParam) {
        var socket = new SockJS('http://localhost:8080/channels');

        self.stompClient = Stomp.over(socket);
        self.stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            self.stompClient.subscribe('/room/' + roomNameParam, function (greeting) {
                self.roomName = roomNameParam;
                greeting = JSON.parse(greeting.body);
                console.log('greeting.body is: ' + greeting);

                if (greeting.playback === 'PLAY') {
                    console.log("Playback: play has been received");
                    //$scope.loadYTVideo(videoId);
                    setTimeout(function () {
                        player.playVideo();
                    }, 1000);
                }

                if (greeting.playlist === 'NEXT') {
                    $http.get('http://localhost:8080/room/' + self.roomName + '/current')
                        .then(function (playlist) {
                            console.log(playlist);
                            player.cueVideoById(playlist.data.id);
                        });
                }

                if (greeting.media === 'ADDED') {

                    console.log('Media has been added');
                    $http.get('http://localhost:8080/room/' + self.roomName + '/current')
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

    this.addToQueue = function (videoId, length) {
        self.stompClient.send("/app/room/" + self.roomName + "/add", {}, JSON.stringify({
            'id': videoId,
            'length': length
        }));
    };
});