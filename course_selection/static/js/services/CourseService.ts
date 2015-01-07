/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ICourse = require('../interfaces/ICourse');
import ICourseResource = require('../interfaces/ICourseResource');
import Service = require('./Service');

'use strict';

class CourseService {

    public static $inject = [
        '$q',
        'localStorageService',
        'CourseResource'
    ];

    constructor(
            private $q,
            private localStorageService,
            private courseResource) {
    }

    // cache into local storage service
    // wrap around with a promise
    public getBySemester(termCode: string) {
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

            return this.$q.all(proms).then((arrayOfArraysOfCourses) => {
                var courseArray = arrayOfArraysOfCourses.reduce(
                        (accum, curr, index, array) => {
                            return accum.concat(curr);
                        });
                this.localStorageService.set('courses-' + termCode, courseArray);
                return courseArray;
            });
        }
    }
}

export = CourseService;
