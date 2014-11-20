define(["require", "exports", '../models/CourseManager'], function(require, exports, CourseManager) {
    'use strict';

    var TabCtrl = (function () {
        function TabCtrl($scope, courseResource, localStorageService) {
            this.$scope = $scope;
            this.courseResource = courseResource;
            this.localStorageService = localStorageService;
            this.$scope.vm = this;
            this.schedules = [];
            this.$scope.schedules = this.schedules;
        }
        TabCtrl.prototype.setAllInactive = function () {
            angular.forEach(this.schedules, function (schedule) {
                schedule.active = false;
            });
        };

        TabCtrl.prototype.addNewSchedule = function () {
            var id = this.schedules.length + 1;
            var cm = new CourseManager(this.courseResource, this.localStorageService, 1154);
            this.schedules.push({
                id: id,
                name: "Schedule " + id,
                active: true,
                courseManager: cm
            });
        };

        TabCtrl.prototype.addSchedule = function () {
            this.setAllInactive();
            this.addNewSchedule();
        };
        TabCtrl.$inject = [
            '$scope',
            'CourseResource',
            'localStorageService'
        ];
        return TabCtrl;
    })();

    
    return TabCtrl;
});
