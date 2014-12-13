'use strict';
define(["require", "exports"], function(require, exports) {
    var MainCtrl = (function () {
        function MainCtrl($scope, scheduleResource, courseResource, userResource) {
            this.$scope = $scope;
            this.scheduleResource = scheduleResource;
            this.courseResource = courseResource;
            this.userResource = userResource;
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
            this.data.user = this.userResource.getByNetId({ netid: this.username });
            this.data.schedules = this.scheduleResource.getByUser({ user__netid: this.username });
        };
        MainCtrl.$inject = [
            '$scope',
            'ScheduleResource',
            'CourseResource',
            'UserResource'
        ];
        return MainCtrl;
    })();

    
    return MainCtrl;
});
