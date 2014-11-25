define(["require", "exports", '../models/CourseManager'], function(require, exports, CourseManager) {
    'use strict';

    var ScheduleCtrl = (function () {
        function ScheduleCtrl($scope, courseResource, localStorageService) {
            this.$scope = $scope;
            this.courseResource = courseResource;
            this.localStorageService = localStorageService;
            this.$scope.vm = this;
            this.schedules = [];
            this.$scope.schedules = this.schedules;
            this.semester = this.$scope.$parent.semester;
            this.$scope.canAddNewSchedules = this.semester.current;
        }
        ScheduleCtrl.prototype.setAllInactive = function () {
            angular.forEach(this.schedules, function (schedule) {
                schedule.active = false;
            });
        };

        ScheduleCtrl.prototype.addNewSchedule = function () {
            var id = this.schedules.length + 1;
            var cm = new CourseManager(this.courseResource, this.localStorageService, this.semester.term_code);
            this.schedules.push({
                id: id,
                name: "Schedule " + id,
                active: true,
                courseManager: cm
            });
        };

        ScheduleCtrl.prototype.addSchedule = function () {
            this.setAllInactive();
            this.addNewSchedule();
        };
        ScheduleCtrl.$inject = [
            '$scope',
            'CourseResource',
            'localStorageService'
        ];
        return ScheduleCtrl;
    })();

    
    return ScheduleCtrl;
});
