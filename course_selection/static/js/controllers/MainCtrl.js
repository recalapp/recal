'use strict';
define(["require", "exports"], function(require, exports) {
    var MainCtrl = (function () {
        function MainCtrl($scope, $resource, courseResource, userService) {
            this.$scope = $scope;
            this.$resource = $resource;
            this.courseResource = courseResource;
            this.userService = userService;
            this.init();
        }
        MainCtrl.prototype.init = function () {
            this.username = username;
            this.data = {
                user: null,
                schedules: null
            };

            this.loadUserData();
        };

        MainCtrl.prototype.loadUserData = function () {
            this.data.user = this.userService.getUser(this.username);
            var scheduleResource = this.$resource('/course_selection/api/v1/schedule/:id', {}, {});
            scheduleResource.get({ user__netid: this.username }).$promise.then(function (schedules) {
                console.log(JSON.stringify(schedules.objects));
            });
        };
        MainCtrl.$inject = [
            '$scope',
            '$resource',
            'CourseResource',
            'UserService'
        ];
        return MainCtrl;
    })();

    
    return MainCtrl;
});
