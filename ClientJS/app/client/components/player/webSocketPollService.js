/**
 * Created by Kelv on 27/02/2015.
 */
/*globals angular, console */
angular.module('app').service('webSocketPollService', function () {
    'use strict';
    var commandQueue = [];

    this.addPlay = function () {
        //commandQue
        console.log('hi');
    };

    this.addCommand = function (command) {
        switch (command) {
            case 'play':
                commandQueue.push('PLAY');
                break;
            case 'pause':
                commandQueue.push('PAUSE');
                break;
            case 'next':
                commandQueue.push('NEXT');
                break;


        }
    };


    this.addPause = function () {
    };

    this.addNext = function () {
    };

    this.getCommand = function () {
    };

});