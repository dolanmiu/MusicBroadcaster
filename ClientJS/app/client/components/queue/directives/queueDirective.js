/*globals angular */
angular.module('app').directive('queue', function ($http, stompClientService) {
    'use strict';
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'client/components/queue/templates/partial.queue.html',
        scope: {control: '='},
        link: function (scope, element, attr) {
            scope.internalControl = scope.control || {};
            scope.internalControl.updateQueue = function () {
                $http.get('http://localhost:8080/room/' + stompClientService.getRoomName() + '/queue')
                    .then(function (queue) {
                        console.log('Queue data from GET is: ' + JSON.stringify(queue));
                        //if (playerService.isPlayerLoaded() !== false) {
                        //    playerService.loadPlayer().then(function () {
                        //        playerService.cueVideoById(queue.data.id);
                        //        // playerService.seekTo(queue.data.currentSeek);
                        //        stompClientService.sendPlay();
                        //    });
                        //    //queue.data[0].id
                        //}

                    });
            };
        }
    };
});
