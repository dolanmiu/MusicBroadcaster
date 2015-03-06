/*globals angular */
angular.module('app').service('userService', function ($http, $q) {
    'use strict';
     
    function generateGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
    
    this.id = generateGuid();
});