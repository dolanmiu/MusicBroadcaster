/**
 * Created by Kelv on 15/02/2015.
 */
/*globals angular, console */
angular.module('app').service('restService', function ($http, $q) {
    'use strict';

    this.createRoom = function (roomName) {
        var url = 'http://localhost:8080/room/create?name=' + roomName,
            deferred = $q.defer();

        console.log('createRoom() is running' + url);
        $http.get(url).then(function (response) {
            console.log(response);
            deferred.resolve(url);
        }, function (reason) {
            deferred.reject('Room failed to initialise because: ' + reason);
        });
        return deferred.promise;
    };
});