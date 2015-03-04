/**
 * Created by Kelv on 13/02/2015.
 */
/*globals angular, YT, console, event, document */
angular.module('app').service('playerService', function (durationService, $q, $window, stompClientService) {
    'use strict';
    var player,
        self = this;

    function onPlayerStateChange(event) {
        console.log("State is changed.... State is now: " + event.data);

        if (event.data === 1) {
            stompClientService.sendPlay();
        }

        if (event.data === 2) {
            stompClientService.sendPause();
            console.log('State changed to 2, ws pause sent');
        }
    }

    this.setPlayer = function (playerInstance) {
        player = playerInstance;
    };

    this.getCurrentTime = function () {
        return Math.round(player.getCurrentTime() * 1000);
    };

    this.cueVideoById = function (videoId, startTime, res) {
        //player.cueVideoById(videoId);

        player.cueVideoById(videoId, startTime, res);
    };

    this.playVideo = function () {
        player.playVideo();
    };

    this.pauseVideo = function () {
        player.pauseVideo();
    };

    this.stopVideo = function () {
        player.stopVideo();
    };

    this.seekTo = function (milliseconds) {
        player.seekTo(milliseconds, false);
    };
});