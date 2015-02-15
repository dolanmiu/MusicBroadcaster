/**
 * Created by Kelv on 15/02/2015.
 */
/*globals angular, console */
angular.module('app').service('restService', function ($http, $q) {
    'use strict';

    this.createRoom = function (roomName) {
        var name = 'http://localhost:8080/room/create?name=' + roomName,
            deferred = $q.defer();

        console.log('createRoom() is running' + name);
        $http.get(name).then(function (response) {
            console.log(response);
            deferred.resolve('Room ' + roomName + ' has been created');
        }, function (reason) {
            deferred.reject('Room failed to initialise because: ' + reason);
        });
        return deferred.promise;
    };
});