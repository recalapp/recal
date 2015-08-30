/// <reference path='../../ts/typings/tsd.d.ts' />
define(["require", "exports"], function (require, exports) {
    'use strict';
    var CourseService = (function () {
        function CourseService($q, $http, localStorageService) {
            this.$q = $q;
            this.$http = $http;
            this.localStorageService = localStorageService;
        }
        CourseService.prototype.getBySemester = function (termCode) {
            return this.$http.get(CourseService.API_URL + termCode).then(function (response) {
                return response.data;
            });
        };
        CourseService.API_URL = "/course_selection/api/static/courses/";
        CourseService.$inject = [
            '$q',
            '$http',
            'localStorageService'
        ];
        return CourseService;
    })();
    return CourseService;
});
