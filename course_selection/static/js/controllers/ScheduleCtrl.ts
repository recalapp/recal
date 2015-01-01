/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
import CourseManager = require('../models/CourseManager');
import ColorManager = require('../models/ColorManager');
import RemoveScheduleModalCtrl = require('./RemoveScheduleModalCtrl');
import NewScheduleModalCtrl = require('./NewScheduleModalCtrl');

'use strict';

class ScheduleCtrl {
    public static $inject =[
        '$rootScope',
        '$scope',
        '$modal',
        'ColorResource',
        'CourseService',
        'localStorageService'
        ];

    private schedules;
    private semester;

    constructor(
            private $rootScope,
            private $scope,
            private $modal,
            private colorResource,
            private courseService,
            private localStorageService) {
        this.semester = this.$scope.$parent.semester;
        this.$scope.canAddNewSchedules = this.semester.current;

        this.schedules = [];
        this.restoreUserSchedules();
        this.$scope.schedules = this.schedules;

        this.$scope.selectedSchedule = -1;
    }

    // focus on restoring enrollments
    // enrollments info is stored in courseManager
    // course manager is created here
    // we want to restore them here. is that right?
    // could we pass the enrollments to courseManager?
    // yeah
    private restoreUserSchedules() {
        var gettingPrevSchedules = this.$scope.$parent.userData.schedules.$promise;
        gettingPrevSchedules.then((schedules) => {
            for (var i = 0; i < schedules.length; i++) {
                var schedule = schedules[i];
                if (schedule.semester.term_code == this.semester.term_code) {
                    // recover available colors and enrollments
                    var enrollments = JSON.parse(schedule.enrollments);
                    var availableColors = JSON.parse(schedule.available_colors);
                    var colorManager = new ColorManager(this.colorResource, availableColors, enrollments);
                    var courseManager = new CourseManager(
                            this.$rootScope,
                            this.courseService, 
                            this.localStorageService, 
                            colorManager,
                            this.semester.term_code,
                            enrollments);

                    // TODO: remove color manager from schedules;
                    // it's unnecessary--the info is in course manager already
                    var newSchedule = {
                        id: schedule.id,
                        title: schedule.title,
                        active: true,
                        courseManager: courseManager,
                        colorManager: colorManager
                    };

                    this.setAllInactive();
                    this.schedules.push(newSchedule);
                }
            }
        });
    }

    public setAllInactive() {
        angular.forEach(this.schedules, (schedule) => {
            schedule.active = false;
        });
    }

    public confirmRemoveSchedule(index: number) {
        var modalInstance = this.$modal.open({
            templateUrl: '/static/templates/removeScheduleModal.html',
            controller: RemoveScheduleModalCtrl,
            windowClass: 'center-modal',
            backdropClass: 'modal-backdrop',
            resolve: {
                title: () => {
                    return this.schedules[index].title;
                }
            }
        });

        modalInstance.result.then(() => {
            this.removeSchedule(index);
        });
    }

    public askForNewScheduleName(prevIdx: number) {
        // the modal is "dismissable" if we have an open schedule
        // already, which means prevIdx != undefined
        var canDismiss = prevIdx != -1;
        var modalInstance = this.$modal.open({
            templateUrl: '/static/templates/newScheduleModal.html',
            controller: NewScheduleModalCtrl,
            keyboard: canDismiss,
            resolve: {
                canDismiss: () => {
                    return canDismiss;
                },
                semester: () => {
                    return this.semester.title;
                }
            },
            backdropClass: 'modal-backdrop',
            windowClass: 'center-modal'
        });

        modalInstance.result.then((name) => {
            this.createSchedule(name);
        }, () => {
            this.schedules[prevIdx].active = true;
        });
    }

    public createSchedule(scheduleName?: string) {
        var id = this.schedules.length;
        var colorManager = new ColorManager(this.colorResource);
        var courseManager = new CourseManager(
                this.$rootScope,
                this.courseService, 
                this.localStorageService, 
                colorManager,
                this.semester.term_code);
        this.schedules.push({
            id: id,
            title: scheduleName ? scheduleName : "Schedule " + id,
            active: true,
            courseManager: courseManager,
            colorManager: colorManager
        });

        this.$scope.selectedSchedule = id;
    }

    public removeSchedule(index: number) {
        this.schedules.splice(index, 1);
    }
 
    public addSchedule() {
        this.setAllInactive();
        this.createSchedule();
    }    
}

export = ScheduleCtrl;
