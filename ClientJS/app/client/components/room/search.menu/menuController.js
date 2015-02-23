/*globals angular */
angular.module('app').controller("menuController", function ($scope, $rootScope) {
    'use strict';


    var body = document.body,
        mask = document.createElement("div"),
        togglePushLeft = document.querySelector(".toggle-push-left"),
        resultContainer = document.querySelector(".song-result-parent-container"),
        activeNav;
    mask.className = "mask";

    /* push menu left */
    togglePushLeft.addEventListener("click", function () {
        classie.add(body, "pml-open");
        document.body.appendChild(mask);
        activeNav = "pml-open";
    });

    /* hide active menu if mask is clicked */
    mask.addEventListener("click", function () {
        closeMenu();
    });

    /* hide active menu if close menu button is clicked */
    [].slice.call(document.querySelectorAll(".close-menu")).forEach(function (el, i) {
        el.addEventListener("click", function () {
            closeMenu();
        });
    });

    function closeMenu() {
        classie.remove(body, activeNav);
        activeNav = "";
        document.body.removeChild(mask);
    }

});