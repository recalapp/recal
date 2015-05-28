/// <reference path='../../ts/typings/tsd.d.ts' />

import ScheduleManager = require('../models/ScheduleManager');

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
        return new ScheduleManager(
                this.$rootScope,
                this.courseService,
                this.localStorageService,
                this.colorResource,
                schedule
                );
    }
}

export = ScheduleManagerService;
