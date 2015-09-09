/// <reference path='../../ts/typings/tsd.d.ts' />
'use strict';
define(["require", "exports"], function (require, exports) {
    var MainCtrl = (function () {
        function MainCtrl($scope) {
            this.$scope = $scope;
            console.log("Test");
            this.$scope.additionalSchedule = null;
        }
        MainCtrl.$inject = [
            '$scope'
        ];
        return MainCtrl;
    })();
    return MainCtrl;
});
