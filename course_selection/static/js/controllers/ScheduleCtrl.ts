/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
import CourseManager = require('../models/CourseManager');
import ColorManager = require('../models/ColorManager');
import IColorManager = require('../interfaces/IColorManager');
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
        'localStorageService',
        'UserService',
        'ScheduleResource'
        ];

    private schedules;
    private semester;

    constructor(
            private $rootScope,
            private $scope,
            private $modal,
            private colorResource,
            private courseService,
            private localStorageService,
            private userService,
            private scheduleResource) {
        this.semester = this.$scope.$parent.semester;
        this.$scope.canAddNewSchedules = this.semester.current;

        this.schedules = [];
        this._restoreUserSchedules();
        this.$scope.schedules = this.schedules;
        this.$scope.selectedSchedule = -1;
    }

    private _restoreUserSchedules() {
        var gettingPrevSchedules = this.userService.schedules.$promise;
        gettingPrevSchedules.then((schedules) => {
            for (var i = 0; i < schedules.length; i++) {
                var schedule = schedules[i];
                if (schedule.semester.term_code == this.semester.term_code) {
                    // recover available colors and enrollments
                    var enrollments = JSON.parse(schedule.enrollments);
                    var availableColors = JSON.parse(schedule.available_colors);
                    var colorManager: IColorManager = new ColorManager(this.colorResource, availableColors, enrollments);
                    var courseManager = new CourseManager(
                            this.$rootScope,
                            this.courseService, 
                            this.localStorageService, 
                            colorManager,
                            schedule);

                    // TODO: remove color manager from schedules;
                    // it's unnecessary--the info is in course manager already
                    var newSchedule = {
                        id: schedule.id,
                        title: schedule.title,
                        active: true,
                        courseManager: courseManager,
                        colorManager: colorManager
                    };

                    this._setAllInactive();
                    this.schedules.push(newSchedule);
                }
            }
        });
    }

    private _setAllInactive() {
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
            this._removeSchedule(index);
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
                    return this.semester.name;
                }
            },
            backdropClass: 'modal-backdrop',
            windowClass: 'center-modal'
        });

        modalInstance.result.then((name) => {
            this._createSchedule(name);
        }, () => {
            this.schedules[prevIdx].active = true;
        });
    }

    private _createSchedule(scheduleName?: string) {
        var id = this.schedules.length;
        var colorManager = new ColorManager(this.colorResource);
        var newSchedule = new this.scheduleResource();
        newSchedule.semester = this.semester;
        newSchedule.user = this.userService.user;
        newSchedule.enrollments = JSON.stringify([]);
        newSchedule.title = scheduleName ? scheduleName : "Schedule" + id;
        colorManager.availableColors.$promise.then((colors) => {
            newSchedule.available_colors = JSON.stringify(colors);
            newSchedule.$save();
        });

        var courseManager = new CourseManager(
                this.$rootScope,
                this.courseService, 
                this.localStorageService, 
                colorManager,
                newSchedule);
        this.schedules.push({
            id: id,
            title: newSchedule.title,
            active: true,
            courseManager: courseManager,
            colorManager: colorManager
        });

        this.$scope.selectedSchedule = id;
    }

    // TODO: this is a workaround
    // shouldn't have to access the schedule like this
    private _removeSchedule(index: number) {
        this.schedules[index].courseManager.schedule.$remove();
        this.schedules.splice(index, 1);
    }
 
    public addSchedule() {
        this._setAllInactive();
        this._createSchedule();
    }    
}

export = ScheduleCtrl;
