define(["require", "exports", '../models/CourseManager', '../models/ColorManager'], function(require, exports, CourseManager, ColorManager) {
    'use strict';

    var ScheduleCtrl = (function () {
        function ScheduleCtrl($scope, colorResource, courseResource, localStorageService) {
            this.$scope = $scope;
            this.colorResource = colorResource;
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
            var colorManager = new ColorManager(this.colorResource);
            var courseManager = new CourseManager(this.courseResource, this.localStorageService, colorManager, this.semester.term_code);
            this.schedules.push({
                id: id,
                name: "Schedule " + id,
                active: true,
                courseManager: courseManager,
                colorManager: colorManager
            });
        };

        ScheduleCtrl.prototype.removeSchedule = function (index) {
            this.schedules.splice(index, 1);
        };

        ScheduleCtrl.prototype.addSchedule = function () {
            this.setAllInactive();
            this.addNewSchedule();
        };
        ScheduleCtrl.$inject = [
            '$scope',
            'ColorResource',
            'CourseResource',
            'localStorageService'
        ];
        return ScheduleCtrl;
    })();

    
    return ScheduleCtrl;
});
