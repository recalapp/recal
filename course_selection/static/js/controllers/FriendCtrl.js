define(["require", "exports"], function (require, exports) {
    'use strict';
    var FriendCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        function FriendCtrl($scope) {
            var _this = this;
            this.$scope = $scope;
            this.$scope.data = {
                friends: [10, 20, 30]
            };
            this.$scope.loading = true;
            setTimeout(function () {
                _this.$scope.loading = false;
            }, 1000);
        }
        FriendCtrl.$inject = [
            '$scope'
        ];
        return FriendCtrl;
    })();
    return FriendCtrl;
});
//# sourceMappingURL=FriendCtrl.js.map