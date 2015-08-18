/// <reference path='../../ts/typings/tsd.d.ts' />
define(["require", "exports"], function (require, exports) {
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
            // var temp = this.localStorageService.get('courses-' + termCode);
            // if (temp != null && Array.isArray(temp)) {
            //     return this.$q.when(temp);
            // } else {
            return this.$http.get(CourseService.API_URL + termCode).then(function (response) {
                // disabling local storage for now, since it basically acts as a
                // cache with indefinite timeout
                // this.localStorageService.set('courses-' + termCode, response.data);
                return response.data;
            });
            // }
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
//# sourceMappingURL=CourseService.js.map