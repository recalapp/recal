'use strict';
define(["require", "exports"], function(require, exports) {
    var MainCtrl = (function () {
        function MainCtrl($scope, scheduleService, userService) {
            this.$scope = $scope;
            this.scheduleService = scheduleService;
            this.userService = userService;
            this.init();
        }
        MainCtrl.prototype.init = function () {
            this.$scope.vm = this;
            this.initData();
        };

        MainCtrl.prototype.initData = function () {
            this.username = username;
            this.data = {
                user: null,
                schedules: null
            };

            this.$scope.data = this.data;
            this.loadUserData();
        };

        MainCtrl.prototype.loadUserData = function () {
            this.data.user = this.userService.getByNetId(this.username);
            this.data.schedules = this.scheduleService.getByUser(this.username);
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
