define(["require", "exports", '../models/CourseManager', '../models/ColorManager'], function(require, exports, CourseManager, ColorManager) {
    'use strict';

    var ScheduleCtrl = (function () {
        function ScheduleCtrl($scope, colorResource, courseResource, localStorageService) {
            this.$scope = $scope;
            this.colorResource = colorResource;
            this.courseResource = courseResource;
            this.localStorageService = localStorageService;
            this.$scope.vm = this;
            this.semester = this.$scope.$parent.semester;
            this.$scope.canAddNewSchedules = this.semester.current;

            this.schedules = [];
            this.restoreUserSchedules();
            this.$scope.schedules = this.schedules;
        }
        ScheduleCtrl.prototype.restoreUserSchedules = function () {
            var _this = this;
            var prevSchedules = this.localStorageService.get('schedules-' + this.semester.term_code);
            if (prevSchedules != null) {
                this.schedules = prevSchedules.map(function (schedule) {
                    var colorManager = new ColorManager(_this.colorResource);
                    var courseManager = new CourseManager(_this.courseResource, _this.localStorageService, colorManager, _this.semester.term_code);
                    return {
                        id: schedule.id,
                        name: schedule.name,
                        active: schedule.active,
                        courseManager: courseManager,
                        colorManager: colorManager
                    };
                });
            }
        };

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
