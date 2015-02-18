angular.module('app').config(function ($stateProvider, $urlRouterProvider) {
    'use strict';
    $stateProvider
        .state('root.home', {
            url: '/home',
            views: {
                'main@root': {
                    templateUrl: 'client/components/home/partial.home.html'
                },
                'top@root.home': {
                    templateUrl: 'client/components/home/partial.top.html'
                },
                'about@root.home': {
                    templateUrl: 'client/components/home/partial.about.html'
                },
                'bug@root.home': {
                    templateUrl: 'client/components/home/partial.bug.html'
                },
                'createroom@root.home': {
                    templateUrl: 'client/components/home/partial.createroom.html'
                }
            }
        })
        .state('root.home.main', {
            onEnter: function ($document, $location, $anchorScroll, anchorSmoothScroll) {
                if (document.readyState === "complete") {
                    $document.scrollTop(0, 500);
                }
            }
        })
        .state('root.home.about', {
            url: "/about",
            onEnter: function ($document, $location, $anchorScroll, anchorSmoothScroll) {
                if (document.readyState === "complete") {
                    var top = 400;
                    var duration = 500;
                    var offset = 30;
                    var someElement = angular.element(document.getElementById('about'));
                    $document.scrollToElement(someElement, offset, duration);
                } else {
                    $location.hash('about');
                    $anchorScroll();
                }
            }
        })
        .state('root.home.report', {
            url: "/report",
            onEnter: function ($document, $location, $anchorScroll, anchorSmoothScroll) {
                if (document.readyState === "complete") {
                    var top = 400;
                    var duration = 500;
                    var offset = 30;
                    var someElement = angular.element(document.getElementById('contact'));
                    $document.scrollToElement(someElement, offset, duration);
                } else {
                    $location.hash('contact');
                    $anchorScroll();
                }
            }
        });
});