/**
 * Created by Kelv on 13/02/2015.
 */
/*globals angular, YT, console, event, document */
angular.module('app').service('playerService', function ($q, $window) {
    'use strict';
    var player,
        self = this;


    this.isPlayerLoaded = function () {
        return player;
    };

    this.loadPlayer = function () {
        var tag = document.createElement('script'),
            targetTag = document.getElementById('hello'),
            deferred = $q.defer();
        console.log('targetTag is ' + targetTag);
        tag.src = "https://www.youtube.com/iframe_api";
        targetTag.parentNode.insertBefore(tag, targetTag);

        $window.onYouTubeIframeAPIReady = function () {

            self.player = new YT.Player('player', {
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
                        deferred.resolve('resolved');
                    },
                    'onStateChange': onPlayerStateChange
                }
            });
        };
        return deferred.promise;
    };

    this.cueVideoById = function (videoId) {
        self.player.cueVideoById(videoId);
    };

    this.playVideo = function () {
        self.player.playVideo();
    };

    this.pauseVideo = function () {
        self.player.pauseVideo();
    };


    function onPlayerStateChange() {
        console.log("State is changed.... State is now: " + event.data);

        if (event.data === YT.PlayerState.PLAYING && !done) {
            setTimeout(stopVideo, 6000);
            done = true;
        }
        //if (event.data === -1) {
        //    $scope.play();
        //}

        //if (event.data === 2) {
        //    webSocketService.sendPause();
        //    console.log('State changed to 2, ws pause sent');
        //}

        if (event.data === YT.PlayerState.PLAYING) {
            console.log('State change to PLAYING');
        }
    }
});