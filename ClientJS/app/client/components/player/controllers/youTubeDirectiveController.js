/**
 * Created by Kelv on 02/03/2015.
 */
/*globals console */
angular.module('app').controller('youTubeDirectiveController', function ($scope, durationService, $q, stompClientService) {
    'use strict';
    var player;

    $scope.onPlayerStateChange = function (event) {
        console.log("State is changed.... State is now: " + event.data);

        if (event.data === 1) {
            stompClientService.sendPlay();
        }

        if (event.data === 2) {
            stompClientService.sendPause();
            console.log('State changed to 2, ws pause sent');
        }
    };

    $scope.getCurrentTime = function () {
        return durationService.convert(player.getCurrentTime());
    };


    $scope.cueVideoById = function (videoId) {
        var deferred = $q.defer();
        player.cueVideoById(videoId)
            .then(function (success) {
                deferred.resolve();
            }, function (fail) {
                deferred.reject();
            });
    };

    $scope.playVideo = function () {
        player.playVideo();
    };

    $scope.pauseVideo = function () {
        player.pauseVideo();
    };

    $scope.seekTo = function (milliseconds) {
        player.seekTo(milliseconds, false);
    };
});