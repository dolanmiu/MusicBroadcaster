/**
 * Created by Kelv on 09/02/2015.
 */
/*globals gapi, angular, window */
angular.module('app').service('googleApiService', function ($http, $rootScope, $q) {
    'use strict';
    var apiKey = 'AIzaSyD1wYe4Yd6_UnTSsnGJLpYc02afaE9ebwU',
        deferred = $q.defer(),
        self = this;

    this.handleClientLoad = function () {
        gapi.client.setApiKey(apiKey);
        gapi.auth.init(function () {
            window.setTimeout(self.loadApiClientInterfaces, 1);
        });
    };

    this.loadApiClientInterfaces = function () {
        gapi.client.load('youtube', 'v3', function () {
            //var request = gapi.client.youtube.search.list({
            //    part: 'snippet',
            //    channelId: 'UCqhNRDQE_fqBDBwsvmT8cTg',
            //    order: 'date',
            //    type: 'video'
            //});
            //
            //request.execute(function (data) {
            //    deferred.resolve(data);
            //});

            console.log('API client interfaces have been loaded');


        });
        //return deferred.promise();
    };

});