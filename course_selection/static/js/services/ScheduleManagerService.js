/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports", '../models/CourseManager'], function(require, exports, CourseManager) {
    'use strict';

    var ScheduleManagerService = (function () {
        function ScheduleManagerService($rootScope, courseService, localStorageService, colorResource) {
            this.$rootScope = $rootScope;
            this.courseService = courseService;
            this.localStorageService = localStorageService;
            this.colorResource = colorResource;
        }
        ScheduleManagerService.prototype.newScheduleManager = function (schedule) {
            return new CourseManager(this.$rootScope, this.courseService, this.localStorageService, this.colorResource, schedule);
        };
        ScheduleManagerService.$inject = [
            '$rootScope',
            'CourseService',
            'localStorageService',
            'ColorResource'
        ];
        return ScheduleManagerService;
    })();

    
    return ScheduleManagerService;
});
