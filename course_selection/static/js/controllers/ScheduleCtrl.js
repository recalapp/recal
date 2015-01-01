define(["require", "exports", '../models/CourseManager', '../models/ColorManager', './RemoveScheduleModalCtrl', './NewScheduleModalCtrl'], function(require, exports, CourseManager, ColorManager, RemoveScheduleModalCtrl, NewScheduleModalCtrl) {
    'use strict';

    var ScheduleCtrl = (function () {
        function ScheduleCtrl($rootScope, $scope, $modal, colorResource, courseService, localStorageService) {
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.$modal = $modal;
            this.colorResource = colorResource;
            this.courseService = courseService;
            this.localStorageService = localStorageService;
            this.$scope.vm = this;
            this.semester = this.$scope.$parent.semester;
            this.$scope.canAddNewSchedules = this.semester.current;

            this.schedules = [];
            this.restoreUserSchedules();
            this.$scope.schedules = this.schedules;

            this.$scope.selectedSchedule = -1;
        }
        ScheduleCtrl.prototype.restoreEnrollments = function (enrollments) {
            for (var i = 0; i < enrollments.length; i++) {
                this.restoreEnrollment(enrollments[i]);
            }
        };

        ScheduleCtrl.prototype.restoreEnrollment = function (enrollment) {
        };

        // focus on restoring enrollments
        // enrollments info is stored in courseManager
        // course manager is created here
        // we want to restore them here. is that right?
        // could we pass the enrollments to courseManager?
        // yeah
        ScheduleCtrl.prototype.restoreUserSchedules = function () {
            var _this = this;
            var gettingPrevSchedules = this.$scope.$parent.userData.schedules.$promise;
            gettingPrevSchedules.then(function (schedules) {
                for (var i = 0; i < schedules.length; i++) {
                    var schedule = schedules[i];
                    if (schedule.semester.term_code == _this.semester.term_code) {
                        // TODO: recover available colors
                        // enroll in all courses in enrollments
                        var availableColors = schedule.available_colors;
                        var colorManager = new ColorManager(_this.colorResource);
                        var courseManager = new CourseManager(_this.$rootScope, _this.courseService, _this.localStorageService, colorManager, _this.semester.term_code);

                        // TODO: restore enrollments in course manager
                        // TODO: remove color manager from schedules;
                        // it's unnecessary
                        var enrollments = JSON.parse(schedule.enrollments);
                        _this.restoreEnrollments(enrollments);
                        var newSchedule = {
                            id: schedule.id,
                            title: schedule.title,
                            active: true,
                            courseManager: courseManager,
                            colorManager: colorManager
                        };

                        _this.setAllInactive();
                        _this.schedules.push(newSchedule);
                    }
                }
            });
            // if (prevSchedules != null) {
            //     this.schedules = prevSchedules.map((schedule) => {
            //         var colorManager = new ColorManager(this.colorResource);
            //         var courseManager = new CourseManager(
            //                 this.$rootScope,
            //                 this.courseService,
            //                 this.localStorageService,
            //                 colorManager,
            //                 this.semester.term_code);
            //         return {
            //             id: schedule.id,
            //             name: schedule.name,
            //             active: schedule.active,
            //             courseManager: courseManager,
            //             colorManager: colorManager
            //         };
            //     });
            // }
        };

        ScheduleCtrl.prototype.setAllInactive = function () {
            angular.forEach(this.schedules, function (schedule) {
                schedule.active = false;
            });
        };

        ScheduleCtrl.prototype.confirmRemoveSchedule = function (index) {
            var _this = this;
            var message = "You want to delete the schedule: " + this.schedules[index].title;

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
                _this.createSchedule(name);
            }, function () {
                _this.schedules[prevIdx].active = true;
            });
        };

        ScheduleCtrl.prototype.createSchedule = function (scheduleName) {
            var id = this.schedules.length;
            var colorManager = new ColorManager(this.colorResource);
            var courseManager = new CourseManager(this.$rootScope, this.courseService, this.localStorageService, colorManager, this.semester.term_code);
            this.schedules.push({
                id: id,
                title: scheduleName ? scheduleName : "Schedule " + id,
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
            this.createSchedule();
        };
        ScheduleCtrl.$inject = [
            '$rootScope',
            '$scope',
            '$modal',
            'ColorResource',
            'CourseService',
            'localStorageService'
        ];
        return ScheduleCtrl;
    })();

    
    return ScheduleCtrl;
});
