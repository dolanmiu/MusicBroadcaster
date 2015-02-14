/**
 * Created by Kelv on 13/02/2015.
 */
angular.module('app').service('playerService', function ($q, $window) {
    'use strict';
    this.loadPlayer = function () {
        var tag = document.createElement('script'),
            targetTag = document.getElementById('hello'),
            deferred = $q.defer();
        tag.src = "https://www.youtube.com/iframe_api";
        targetTag.parentNode.insertBefore(tag, targetTag);

        $window.onYouTubeIframeAPIReady = function () {
            var player = new YT.Player('player', {
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
                        deferred.resolve(player);
                    },
                    'onStateChange': onPlayerStateChange
                }
            });
        };
        return deferred.promise;
    };

    function onPlayerStateChange(event) {
        console.log("State is changed.... State is now: " + event.data);

        if (event.data === YT.PlayerState.PLAYING && !done) {
            setTimeout(stopVideo, 6000);
            done = true;
        }
        //if (event.data === -1) {
        //    $scope.play();
        //}

        if (event.data === YT.PlayerState.PLAYING) {
            console.log('State change to PLAYING');
        }
    }
});