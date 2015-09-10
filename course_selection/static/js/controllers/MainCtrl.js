/// <reference path='../../ts/typings/tsd.d.ts' />
'use strict';
define(["require", "exports"], function (require, exports) {
    var MainCtrl = (function () {
        function MainCtrl($scope, $mdSidenav, $log) {
            this.$scope = $scope;
            this.$mdSidenav = $mdSidenav;
            this.$log = $log;
        }
        MainCtrl.prototype.toggleSidebar = function (navID) {
            this.$mdSidenav(navID)
                .toggle()
                .then(function () {
                this.$log.debug("toggle " + navID + " is done");
            });
        };
        MainCtrl.$inject = [
            '$scope',
            '$mdSidenav',
            '$log'
        ];
        return MainCtrl;
    })();
    return MainCtrl;
});
