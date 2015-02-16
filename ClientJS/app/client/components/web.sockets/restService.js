/**
 * Created by Kelv on 15/02/2015.
 */
/*globals angular, console */
angular.module('app').service('restService', function ($http, $q) {
    'use strict';

    this.createRoom = function (roomName) {
        var getRequest = 'http://localhost:8080/room/create?name=' + roomName,
            deferred = $q.defer();

        console.log('createRoom() is running' + getRequest);
        $http.get(getRequest).then(function (response) {
            if (response.data.error !== undefined) {
                deferred.reject(response);
            } else {
                console.log(response);
                var roomUrl = 'http://localhost:8080/room/' + roomName;
                deferred.resolve(roomUrl);
            }
        }, function (reason) {
            deferred.reject(reason);
        });
        return deferred.promise;
    };
});