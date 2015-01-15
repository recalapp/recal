/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports"], function(require, exports) {
    'use strict';

    var CourseService = (function () {
        function CourseService($q, $http, localStorageService) {
            this.$q = $q;
            this.$http = $http;
            this.localStorageService = localStorageService;
        }
        // cache into local storage service
        // wrap around with a promise
        CourseService.prototype.getBySemester = function (termCode) {
            var _this = this;
            var temp = this.localStorageService.get('courses-' + termCode);
            if (temp != null && Array.isArray(temp)) {
                return this.$q.when(temp);
            } else {
                return this.$http.get(CourseService.API_URL + "?semester__term_code=" + termCode).then(function (response) {
                    _this.localStorageService.set('courses-' + termCode, response.data);
                    return response.data;
                });
            }
        };
        CourseService.API_URL = "/course_selection/api/static/courses";

        CourseService.$inject = [
            '$q',
            '$http',
            'localStorageService'
        ];
        return CourseService;
    })();

    
    return CourseService;
});
