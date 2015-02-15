/**
 * Created by Kelv on 13/02/2015.
 */
angular.module('app').service('webSocketService', function () {
    'use strict';
    this.sendMedia = function (stompClient, roomName, videoId, length) {
        stompClient.send('/app/room/' + roomName + '/add', {}, JSON.stringify({
            'id': videoId,
            'length': length
        }));
    };

    this.sendPlay = function (stompClient, roomName) {
        stompClient.send('/app/room/' + roomName + '/play', {});
    };
});