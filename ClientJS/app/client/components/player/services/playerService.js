/**
 * Created by Kelv on 13/02/2015.
 */
/*globals angular, YT, console, event, document */
angular.module('app').service('playerService', function (durationService, $q, $window, stompClientService) {
    'use strict';
    var player,
        self = this;

    this.setPlayer = function (playerInstance) {
        player = playerInstance;
    };

    this.getCurrentTime = function () {
        return Math.round(player.getCurrentTime() * 1000);
    };

    this.cueVideoById = function (videoId, startTime, res) {
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
        var seconds = milliseconds / 1000;
        player.seekTo(seconds, true);
    };
    
    //this.getCurrent
});