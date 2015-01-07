/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import CourseManager = require('../models/CourseManager');

'use strict';

class ScheduleManagerService {
    public static $inject = [
        '$rootScope',
        'CourseService',
        'localStorageService',
        'ColorResource'
        ];

    constructor(
            private $rootScope,
            private courseService,
            private localStorageService,
            private colorResource
            ) {}

    public newScheduleManager(schedule: any) {
        return new CourseManager(
                this.$rootScope,
                this.courseService,
                this.localStorageService,
                this.colorResource,
                schedule
                );
    }
}

export = ScheduleManagerService;
