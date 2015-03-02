/**
 * Created by Kelv on 09/02/2015.
 */
/*globals angular, console, document, done, gapi */

angular.module('app').controller('roomController', function ($rootScope, durationService, stompClientService, playerService, $scope, googleApiService, $http, $q, $stateParams, angularLoad, subscribeEventService) {
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
            currentVideoLength = response.result.items[0].contentDetails.duration;
            $scope.$apply();
            deferred.resolve();
        }, function (reason) {
            console.log('Error: ' + reason.result.error.message);
            $scope.$apply();
            deferred.reject();
        });
        return deferred.promise;
    };

    $scope.loadNewVideo = function (videoId) {
        player.loadVideoById(videoId, 5, "large");
    };

    $scope.createRoom = function () {
        var name = 'http://localhost:8080/room/create?name=' + $scope.roomName;
        console.log('createRoom() is running' + name);
        $http.get(name).then(function (response) {
            console.log(response.data);
        });
    };

    function connect(roomName) {
        subscribeEventService.connect(roomName);
    }

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
    };


    function seektt() {
        var seek = document.getElementById('seekValue').value;
        stompClientService.send("/app/room/" + roomName + "/seek", {}, JSON.stringify({
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

    $scope.onClientLoad = function () {
        console.log("hello");
        googleApiService.handleClientLoad().then(function (data) {
            $scope.channel = data;
        }, function (error) {
            console.log('Failed: ' + error);
        });
    };

    /*angularLoad.loadScript('https://apis.google.com/js/client.js').then(function () {
        setApiKey();
        playerService.loadPlayer().then(function () {
            console.log('player created');
        });
    }).catch(function () {
        console.log('Error loading the script');
    });

    function setApiKey() {
        googleApiService.handleClientLoad();
        console.log('API key set');
    }*/

    connect($stateParams.roomName);
});