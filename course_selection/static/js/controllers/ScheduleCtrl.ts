/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
import CourseManager = require('../models/CourseManager');
import ColorManager = require('../models/ColorManager');
import RemoveScheduleModalCtrl = require('./RemoveScheduleModalCtrl');
import NewScheduleModalCtrl = require('./NewScheduleModalCtrl');

'use strict';

class ScheduleCtrl {
    public static $inject =[
        '$scope',
        '$modal',
        'ColorResource',
        'CourseResource',
        'localStorageService'
        ];

    private schedules;
    private semester;

    constructor(private $scope,
            private $modal,
            private colorResource,
            private courseResource,
            private localStorageService) {
        this.$scope.vm = this;
        this.semester = this.$scope.$parent.semester;
        this.$scope.canAddNewSchedules = this.semester.current;

        this.schedules = [];
        // this.restoreUserSchedules();
        this.$scope.schedules = this.schedules;
    }

    private restoreUserSchedules() {
        var prevSchedules = this.localStorageService.get('schedules-' + this.semester.term_code);
        if (prevSchedules != null) {
            this.schedules = prevSchedules.map((schedule) => {
                var colorManager = new ColorManager(this.colorResource);
                var courseManager = new CourseManager(
                        this.courseResource, 
                        this.localStorageService, 
                        colorManager,
                        this.semester.term_code);
                return {
                    id: schedule.id,
                    name: schedule.name,
                    active: schedule.active,
                    courseManager: courseManager,
                    colorManager: colorManager
                };
            });
        }
    }

    public setAllInactive() {
        angular.forEach(this.schedules, (schedule) => {
            schedule.active = false;
        });
    }

    public confirmRemoveSchedule(index: number) {
        var message: string = "You want to delete the schedule: " + this.schedules[index].name;

        var modalInstance = this.$modal.open({
            templateUrl: '/static/templates/removeScheduleModal.html',
            controller: RemoveScheduleModalCtrl,
            windowClass: 'center-modal',
            resolve: {
                message: () => {
                    return message;
                }
            }
        });

        modalInstance.result.then(() => {
            this.removeSchedule(index);
        });
    }

    public askForNewScheduleName(prevIdx: number) {
        var modalInstance = this.$modal.open({
            templateUrl: '/static/templates/newScheduleModal.html',
            controller: NewScheduleModalCtrl,
            windowClass: 'center-modal'
        });

        modalInstance.result.then((name) => {
            this.addNewSchedule(name);
        }, () => {
            this.schedules[prevIdx].active = true;
        });
    }
 
    public addNewSchedule(scheduleName?: string) {
        var id = this.schedules.length + 1;
        var colorManager = new ColorManager(this.colorResource);
        var courseManager = new CourseManager(
                this.courseResource, 
                this.localStorageService, 
                colorManager,
                this.semester.term_code);
        this.schedules.push({
            id: id,
            name: scheduleName ? scheduleName : "Schedule " + id,
            active: true,
            courseManager: courseManager,
            colorManager: colorManager
        });

    }

    public removeSchedule(index: number) {
        this.schedules.splice(index, 1);
    }
 
    public addSchedule() {
        this.setAllInactive();
        this.addNewSchedule();
    }    
}

export = ScheduleCtrl;
