define(["require", "exports", '../models/CourseManager', '../models/ColorManager', './RemoveScheduleModalCtrl', './NewScheduleModalCtrl'], function(require, exports, CourseManager, ColorManager, RemoveScheduleModalCtrl, NewScheduleModalCtrl) {
    'use strict';

    var ScheduleCtrl = (function () {
        function ScheduleCtrl($rootScope, $scope, $modal, colorResource, courseResource, scheduleResource, localStorageService) {
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.$modal = $modal;
            this.colorResource = colorResource;
            this.courseResource = courseResource;
            this.scheduleResource = scheduleResource;
            this.localStorageService = localStorageService;
            this.$scope.vm = this;
            this.semester = this.$scope.$parent.semester;
            this.$scope.canAddNewSchedules = this.semester.current;

            this.schedules = [];

            // this.restoreUserSchedules();
            this.$scope.schedules = this.schedules;

            this.$scope.selectedSchedule = -1;
        }
        ScheduleCtrl.prototype.restoreUserSchedules = function () {
            var _this = this;
            var prevSchedules = this.localStorageService.get('schedules-' + this.semester.term_code);
            if (prevSchedules != null) {
                this.schedules = prevSchedules.map(function (schedule) {
                    var colorManager = new ColorManager(_this.colorResource);
                    var courseManager = new CourseManager(_this.$rootScope, _this.courseResource, _this.scheduleResource, _this.localStorageService, colorManager, _this.semester.term_code);
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

        ScheduleCtrl.prototype.confirmRemoveSchedule = function (index) {
            var _this = this;
            var message = "You want to delete the schedule: " + this.schedules[index].name;

            var modalInstance = this.$modal.open({
                templateUrl: '/static/templates/removeScheduleModal.html',
                controller: RemoveScheduleModalCtrl,
                windowClass: 'center-modal',
                backdropClass: 'modal-backdrop',
                resolve: {
                    message: function () {
                        return message;
                    }
                }
            });

            modalInstance.result.then(function () {
                _this.removeSchedule(index);
            });
        };

        ScheduleCtrl.prototype.askForNewScheduleName = function (prevIdx) {
            var _this = this;
            // the modal is "dismissable" if we have an open schedule
            // already, which means prevIdx != undefined
            var canDismiss = prevIdx != -1;
            var modalInstance = this.$modal.open({
                templateUrl: '/static/templates/newScheduleModal.html',
                controller: NewScheduleModalCtrl,
                keyboard: canDismiss,
                resolve: {
                    canDismiss: function () {
                        return canDismiss;
                    },
                    semester: function () {
                        return _this.semester.title;
                    }
                },
                backdropClass: 'modal-backdrop',
                windowClass: 'center-modal'
            });

            modalInstance.result.then(function (name) {
                _this.addNewSchedule(name);
            }, function () {
                _this.schedules[prevIdx].active = true;
            });
        };

        ScheduleCtrl.prototype.test = function (index) {
            this.$scope.selectedSchedule = index;
        };

        ScheduleCtrl.prototype.addNewSchedule = function (scheduleName) {
            var id = this.schedules.length;
            var colorManager = new ColorManager(this.colorResource);
            var courseManager = new CourseManager(this.$rootScope, this.courseResource, this.scheduleResource, this.localStorageService, colorManager, this.semester.term_code);
            this.schedules.push({
                id: id,
                name: scheduleName ? scheduleName : "Schedule " + id,
                active: true,
                courseManager: courseManager,
                colorManager: colorManager
            });

            this.$scope.selectedSchedule = id;
        };

        ScheduleCtrl.prototype.removeSchedule = function (index) {
            this.schedules.splice(index, 1);
        };

        ScheduleCtrl.prototype.addSchedule = function () {
            this.setAllInactive();
            this.addNewSchedule();
        };
        ScheduleCtrl.$inject = [
            '$rootScope',
            '$scope',
            '$modal',
            'ColorResource',
            'CourseResource',
            'ScheduleResource',
            'localStorageService'
        ];
        return ScheduleCtrl;
    })();

    
    return ScheduleCtrl;
});
