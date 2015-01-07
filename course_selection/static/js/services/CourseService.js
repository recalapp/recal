/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports"], function(require, exports) {
    'use strict';

    var CourseService = (function () {
        function CourseService($q, localStorageService, courseResource) {
            this.$q = $q;
            this.localStorageService = localStorageService;
            this.courseResource = courseResource;
        }
        // cache into local storage service
        // wrap around with a promise
        CourseService.prototype.getBySemester = function (termCode) {
            var _this = this;
            var temp = this.localStorageService.get('courses-' + termCode);
            if (temp != null && Array.isArray(temp)) {
                return this.$q.when(temp);
            } else {
                // TODO: here we are assuming that there are less than 2000 courses
                var proms = [];
                for (var i = 0; i < 10; i++) {
                    proms.push(this.courseResource.getBySemester({
                        semester__term_code: termCode,
                        offset: i * 200,
                        limit: 200
                    }).$promise);
                }

                return this.$q.all(proms).then(function (arrayOfArraysOfCourses) {
                    var courseArray = arrayOfArraysOfCourses.reduce(function (accum, curr, index, array) {
                        return accum.concat(curr);
                    });
                    _this.localStorageService.set('courses-' + termCode, courseArray);
                    return courseArray;
                });
            }
        };
        CourseService.$inject = [
            '$q',
            'localStorageService',
            'CourseResource'
        ];
        return CourseService;
    })();

    
    return CourseService;
});
