/// <reference path='../../ts/typings/tsd.d.ts' />
define(["require", "exports", '../models/ScheduleManager'], function (require, exports, ScheduleManager) {
    'use strict';
    var ScheduleManagerService = (function () {
        function ScheduleManagerService($rootScope, courseService, localStorageService, colorResource) {
            this.$rootScope = $rootScope;
            this.courseService = courseService;
            this.localStorageService = localStorageService;
            this.colorResource = colorResource;
        }
        ScheduleManagerService.prototype.newScheduleManager = function (schedule) {
            return new ScheduleManager(this.$rootScope, this.courseService, this.localStorageService, this.colorResource, schedule);
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
