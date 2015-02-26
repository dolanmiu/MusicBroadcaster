/**
 * Created by Kelv on 15/02/2015.
 */
/*globals console, Stomp, SockJS, angular, setTimeout */
angular.module('app').service('stompClientService', function ($q) {
    'use strict';
    var stompClient,
        player = null,
        roomName = null,
        self = this;

    this.connect = function (roomNameParam, connectionCallback) {
        var socket = new SockJS('http://localhost:8080/channels'),
            deferred = $q.defer();

        self.stompClient = Stomp.over(socket);

        self.stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            self.roomName = roomNameParam;
            self.stompClient.subscribe('/room/' + roomNameParam, connectionCallback);
            deferred.resolve();
        });
        return deferred.promise;
    };

    this.addToQueue = function (videoId, length) {
        self.stompClient.send("/app/room/" + self.roomName + "/add", {}, JSON.stringify({
            'id': videoId,
            'length': length
        }));
    };

    this.sendPlay = function () {
        self.stompClient.send('/app/room/' + self.roomName + '/play', {});
    };

    this.sendPause = function () {
        self.stompClient.send('/app/room/' + self.roomName + '/pause', {});
    };

    this.getRoomName = function () {
        return self.roomName;
    };
});