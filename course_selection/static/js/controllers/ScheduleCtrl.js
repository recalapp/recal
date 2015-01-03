define(["require", "exports", '../models/CourseManager', '../models/ColorManager', './RemoveScheduleModalCtrl', './NewScheduleModalCtrl'], function(require, exports, CourseManager, ColorManager, RemoveScheduleModalCtrl, NewScheduleModalCtrl) {
    'use strict';

    var ScheduleCtrl = (function () {
        function ScheduleCtrl($rootScope, $scope, $modal, colorResource, courseService, localStorageService, userService, scheduleResource) {
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.$modal = $modal;
            this.colorResource = colorResource;
            this.courseService = courseService;
            this.localStorageService = localStorageService;
            this.userService = userService;
            this.scheduleResource = scheduleResource;
            this.semester = this.$scope.$parent.semester;
            this.$scope.canAddNewSchedules = this.semester.current;

            this.schedules = [];
            this._restoreUserSchedules();
            this.$scope.schedules = this.schedules;
            this.$scope.selectedSchedule = -1;
        }
        ScheduleCtrl.prototype._restoreUserSchedules = function () {
            var _this = this;
            var gettingPrevSchedules = this.userService.schedules.$promise;
            gettingPrevSchedules.then(function (schedules) {
                for (var i = 0; i < schedules.length; i++) {
                    var schedule = schedules[i];
                    if (schedule.semester.term_code == _this.semester.term_code) {
                        // recover available colors and enrollments
                        var enrollments = JSON.parse(schedule.enrollments);
                        var availableColors = JSON.parse(schedule.available_colors);
                        var colorManager = new ColorManager(_this.colorResource, availableColors, enrollments);
                        var courseManager = new CourseManager(_this.$rootScope, _this.courseService, _this.localStorageService, colorManager, schedule);

                        // TODO: remove color manager from schedules;
                        // it's unnecessary--the info is in course manager already
                        var newSchedule = {
                            id: schedule.id,
                            title: schedule.title,
                            active: true,
                            courseManager: courseManager,
                            colorManager: colorManager
                        };

                        _this._setAllInactive();
                        _this.schedules.push(newSchedule);
                    }
                }
            });
        };

        ScheduleCtrl.prototype._setAllInactive = function () {
            angular.forEach(this.schedules, function (schedule) {
                schedule.active = false;
            });
        };

        ScheduleCtrl.prototype.confirmRemoveSchedule = function (index) {
            var _this = this;
            var modalInstance = this.$modal.open({
                templateUrl: '/static/templates/removeScheduleModal.html',
                controller: RemoveScheduleModalCtrl,
                windowClass: 'center-modal',
                backdropClass: 'modal-backdrop',
                resolve: {
                    title: function () {
                        return _this.schedules[index].title;
                    }
                }
            });

            modalInstance.result.then(function () {
                _this._removeSchedule(index);
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
                _this._createSchedule(name);
            }, function () {
                _this.schedules[prevIdx].active = true;
            });
        };

        ScheduleCtrl.prototype._createSchedule = function (scheduleName) {
            var id = this.schedules.length;
            var colorManager = new ColorManager(this.colorResource);
            var courseManager = new CourseManager(this.$rootScope, this.courseService, this.localStorageService, colorManager, new this.scheduleResource());
            this.schedules.push({
                id: id,
                title: scheduleName ? scheduleName : "Schedule " + id,
                active: true,
                courseManager: courseManager,
                colorManager: colorManager
            });

            this.$scope.selectedSchedule = id;
        };

        ScheduleCtrl.prototype._removeSchedule = function (index) {
            this.schedules.splice(index, 1);
        };

        ScheduleCtrl.prototype.addSchedule = function () {
            this._setAllInactive();
            this._createSchedule();
        };
        ScheduleCtrl.$inject = [
            '$rootScope',
            '$scope',
            '$modal',
            'ColorResource',
            'CourseService',
            'localStorageService',
            'UserService',
            'ScheduleResource'
        ];
        return ScheduleCtrl;
    })();

    
    return ScheduleCtrl;
});
