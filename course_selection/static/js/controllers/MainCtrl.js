'use strict';
define(["require", "exports"], function(require, exports) {
    var MainCtrl = (function () {
        function MainCtrl($scope, scheduleResource, courseResource, userService) {
            this.$scope = $scope;
            this.scheduleResource = scheduleResource;
            this.courseResource = courseResource;
            this.userService = userService;
            this.init();
        }
        MainCtrl.prototype.init = function () {
            this.$scope.vm = this;
            this.username = username;
            this.data = {
                user: null,
                schedules: null
            };

            this.loadUserData();
        };

        MainCtrl.prototype.loadUserData = function () {
            var _this = this;
            this.data.user = this.userService.getUser(this.username);
            this.scheduleResource.getByUser({ user__netid: this.username }).$promise.then(function (schedules) {
                _this.data.schedules = schedules;
                console.log(JSON.stringify(schedules));
            });
        };
        MainCtrl.$inject = [
            '$scope',
            'ScheduleResource',
            'CourseResource',
            'UserService'
        ];
        return MainCtrl;
    })();

    
    return MainCtrl;
});
