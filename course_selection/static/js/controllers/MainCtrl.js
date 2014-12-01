'use strict';
define(["require", "exports"], function(require, exports) {
    var MainCtrl = (function () {
        function MainCtrl($scope, $resource) {
            this.$scope = $scope;
            this.$resource = $resource;
        }
        MainCtrl.prototype.loadUserData = function () {
        };
        MainCtrl.$inject = [
            '$scope',
            '$resource'
        ];
        return MainCtrl;
    })();

    
    return MainCtrl;
});
