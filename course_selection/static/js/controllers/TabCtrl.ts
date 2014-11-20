/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
import CourseResource = require('../services/CourseResource');
import CourseManager = require('../models/CourseManager');

'use strict';

class TabCtrl {
    public static $inject =[
        '$scope',
        'CourseResource',
        'localStorageService'
        ];

    private schedules;

    constructor(private $scope,
            private courseResource,
            private localStorageService) {
        this.$scope.vm = this;
        this.schedules = [];
        this.$scope.schedules = this.schedules;
    }

    public setAllInactive() {
        angular.forEach(this.schedules, (schedule) => {
            schedule.active = false;
        });
    }
 
    public addNewSchedule() {
        var id = this.schedules.length + 1;
        var cm = new CourseManager(this.courseResource, this.localStorageService, 1154);
        this.schedules.push({
            id: id,
            name: "Schedule " + id,
            active: true,
            courseManager: cm
        });
    }
 
    public addSchedule() {
        this.setAllInactive();
        this.addNewSchedule();
    }    
}

export = TabCtrl;
