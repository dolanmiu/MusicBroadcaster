/**
 * Created by Kelv on 09/02/2015.
 */
angular.module('app').controller('roomController', function ($scope, googleApiService) {

    $scope.channel = {};
    $scope.searchValue=1;
    $scope.onClientLoad = function () {
        console.log("hello");
        googleApiService.handleClientLoad().then(function (data) {
            $scope.channel = data;
        }, function (error) {
            console.log('Failed: ' + error);
        })
    }

    //$scope.watch('$viewContentLoaded',function(){
    //    googleApiService.handleClientLoad().then(function(data){
    //        console.log(data);
    //    });
    //});

    $scope.setApiKey = function () {
        googleApiService.handleClientLoad();
    };

    $scope.submitSearch = function () {
        var search = $scope.searchValue;

        var restRequest = gapi.client.request({
            'path': '/youtube/v3/search',
            'params': {
                'part': 'snippet',
                'q': search,
                'order':'relevance',
               'type':'video'

            }
        });

        restRequest.then(function (response) {
            console.log(response.result);
        }, function (reason) {
            console.log('Error: ' + reason.result.error.message);
        });

    }


});