/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
import CourseResource = require('../services/CourseResource');
import CourseManager = require('../models/CourseManager');
import ColorManager = require('../models/ColorManager');

'use strict';

class ScheduleCtrl {
    public static $inject =[
        '$scope',
        '$resource',
        'CourseResource',
        'localStorageService'
        ];

    private schedules;
    private semester;

    constructor(private $scope,
            private $resource,
            private courseResource,
            private localStorageService) {
        this.$scope.vm = this;
        this.schedules = [];
        this.$scope.schedules = this.schedules;
        this.semester = this.$scope.$parent.semester;
        this.$scope.canAddNewSchedules = this.semester.current;
    }

    public setAllInactive() {
        angular.forEach(this.schedules, (schedule) => {
            schedule.active = false;
        });
    }
 
    public addNewSchedule() {
        var id = this.schedules.length + 1;
        var courseManager = new CourseManager(
                this.courseResource, 
                this.localStorageService, 
                this.semester.term_code);
        var colorManager = new ColorManager(this.$resource);
        this.schedules.push({
            id: id,
            name: "Schedule " + id,
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
