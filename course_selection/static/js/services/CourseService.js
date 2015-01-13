/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports"], function(require, exports) {
    'use strict';

    var CourseService = (function () {
        function CourseService($q, localStorageService, courseResource) {
            this.$q = $q;
            this.localStorageService = localStorageService;
            this.courseResource = courseResource;
        }
        CourseService.prototype._loadCourses = function (termCode, limit, index) {
            return this.courseResource.getBySemester({
                semester__term_code: termCode,
                offset: index * limit,
                limit: limit
            }).$promise;
        };

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

                /*
                var promise = this._loadCourses(termCode, 200, 0).then((data) => {
                this._loadCourses(termCode, 200, 1).then((data2) => {
                this._loadCourses(termCode, 200, 1).then((data3) => {
                this._loadCourses(termCode, 200, 1).then((data4) => {
                return data.concat(data2).concat(data3).concat(data4);
                });
                });
                });
                });
                return promise;
                */
                return this._loadCourses(termCode, 0, 0).then(function (data) {
                    _this.localStorageService.set('courses-' + termCode, data);
                    return data;
                });
                //proms.push(this._loadCourses(termCode, 0, 0));
                //return this.$q.all(proms).then((arrayOfArraysOfCourses) => {
                //    var courseArray = arrayOfArraysOfCourses.reduce(
                //            (accum, curr, index, array) => {
                //                return accum.concat(curr);
                //            });
                //    this.localStorageService.set('courses-' + termCode, courseArray);
                //    return courseArray;
                //});
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
