/**
 * Created by Kelv on 09/02/2015.
 */
angular.module('app').service('googleApiService', function ($http, $rootScope, $q) {
    var apiKey = 'AIzaSyD1wYe4Yd6_UnTSsnGJLpYc02afaE9ebwU';

    var deferred = $q.defer();

    this.handleClientLoad = function () {
        gapi.client.setApiKey(apiKey);
        gapi.auth.init(function () {
            window.setTimeout(this.loadApiClientInterfaces, 1);
        });
    };

    this.loadApiClientInterfaces = function(){
        gapi.client.load('youtube','v3',function(){
            request = gapi.client.youtube.search.list({
                part:'snippet',
                channelId: 'UCqhNRDQE_fqBDBwsvmT8cTg',
                order: 'date',
                type: 'video'
            });

            request.execute(function(response){
                deferred.resolve(data);
            });
        });
        return deferred.promise();
    };

});