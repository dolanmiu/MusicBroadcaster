/**
 * Created by Kelv on 09/02/2015.
 */
/*globals angular, console, done */

angular.module('app').directive('youtube', function ($window) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            height: "@",
            width: "@",
            videoId: "@"
        },
        template: '<div id="player"></div>',

        link: function (scope, element, attrs) {

            var self = this;

            var tag = document.createElement('script'),
                firstScriptTag = document.getElementById('hello');

            tag.src = "https://www.youtube.com/iframe_api";
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            var player;

            $window.onYouTubeIframeAPIReady = function () {
                player = new YT.Player('player', {
                    height: scope.height,
                    width: scope.width,
                    videoId: scope.videoId,
                    events: {
                        'onReady': function (event) {
                            event.target.playVideo();
                        },
                        'onStateChange': function (event) {
                            if (event.data === YT.PlayerState.PLAYING && !done) {
                                setTimeout(stopVideo, 6000);
                                done = true;
                            }
                        }
                    }
                });
            };

            //this.onPlayerReady = function (event) {
            //    event.target.playVideo();
            //};
            //
            //this.onPlayerStateChange = function (event) {
            //    if (event.data == YT.PlayerState.PLAYING && !done) {
            //        setTimeout(stopVideo, 6000);
            //        done = true;
            //    }
            //};

            //this.stopVideo = function () {
            //    player.stopVideo;
            //}
        }

    };

});