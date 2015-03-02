/**
 * Created by Kelv on 13/02/2015.
 */
/*globals angular, YT, console, event, document */
angular.module('app').service('playerService', function (durationService, $q, $window, stompClientService) {
    'use strict';
    var player,
        self = this;

    this.loadPlayer = function () {
        var tag = document.createElement('script'),
            targetTag = document.getElementById('hello'),
            deferred = $q.defer();
        
        console.log('targetTag is ' + targetTag);
        tag.src = "https://www.youtube.com/iframe_api";
        targetTag.parentNode.insertBefore(tag, targetTag);

        $window.onYouTubeIframeAPIReady = function () {

            player = new YT.Player('player', {
                height: '390',
                width: '640',
                playerVars: {
                    controls: '1',
                    rel: '0',
                    modestbranding: '1',
                    autoplay: '1'
                },
                // videoId: videoId,
                events: {
                    'onReady': function () {
                        console.log('player has been created');
                        deferred.resolve();
                    },
                    'onStateChange': onPlayerStateChange
                }
            });
        };
        return deferred.promise;
    };

    this.getCurrentTime = function () {
        return durationService.convert(self.player.getCurrentTime());
    };


    this.cueVideoById = function (videoId) {
        var deferred = $q.defer();
        player.cueVideoById(videoId)
            .then(function (success) {
                deferred.resolve();
            }, function (fail) {
                deferred.reject();
            });
    };

    this.playVideo = function () {
        player.playVideo();
    };

    this.pauseVideo = function () {
        player.pauseVideo();
    };

    this.seekTo = function (milliseconds) {
        player.seekTo(milliseconds, false);
    };

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
});