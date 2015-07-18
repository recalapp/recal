define(["require", "exports"], function(require, exports) {
    'use strict';

    var FriendCtrl = (function () {
        function FriendCtrl($scope) {
            this.$scope = $scope;
            this.scheduleManager = this.$scope.$parent.schedule.scheduleManager;
            this.$scope.data = this.scheduleManager.getData();
        }
        FriendCtrl.COMPONENT_ID = "friend";

        FriendCtrl.$inject = [
            '$scope'
        ];
        return FriendCtrl;
    })();

    
    return FriendCtrl;
});
//# sourceMappingURL=FriendCtrl.js.map
