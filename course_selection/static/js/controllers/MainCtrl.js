/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
'use strict';
define(["require", "exports"], function(require, exports) {
    var MainCtrl = (function () {
        function MainCtrl($scope) {
            this.$scope = $scope;
            this.$scope.vm = this;
        }
        MainCtrl.$inject = [
            '$scope'
        ];
        return MainCtrl;
    })();

    
    return MainCtrl;
});
