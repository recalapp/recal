'use strict';
define(["require", "exports"], function(require, exports) {
    var MainCtrl = (function () {
        function MainCtrl($scope, scheduleService, userService) {
            this.$scope = $scope;
            this.scheduleService = scheduleService;
            this.userService = userService;
            this._init();
        }
        MainCtrl.prototype._init = function () {
            this._initData();
        };

        MainCtrl.prototype._initData = function () {
            this.username = username;
            this.data = {
                user: null,
                schedules: null
            };

            this.loadUserData();
            this.$scope.data = this.data;
        };

        MainCtrl.prototype.loadUserData = function () {
            this.data = this.userService.data;
        };
        MainCtrl.$inject = [
            '$scope',
            'ScheduleService',
            'UserService'
        ];
        return MainCtrl;
    })();

    
    return MainCtrl;
});
//# sourceMappingURL=MainCtrl.js.map
