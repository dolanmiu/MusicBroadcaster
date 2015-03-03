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
        return durationService.convert(self.player.getCurrentTime());
    };

    this.cueVideoById = function (videoId) {
        //var deferred = $q.defer();
        //player.cueVideoById(videoId)
        //    .then(function (success) {
        //        deferred.resolve();
        //    }, function (fail) {
        //        deferred.reject();
        //    });
        //return deferred.promise;

        player.cueVideoById(videoId);
    };

    this.playVideo = function () {
        player.playVideo();
    };

    this.pauseVideo = function () {
        player.pauseVideo();
    };
    
    this.stopVideo = function () {
        player.stopVideo();
    }

    this.seekTo = function (milliseconds) {
        player.seekTo(milliseconds, false);
    };
});