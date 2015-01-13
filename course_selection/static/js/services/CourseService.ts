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

    private _loadCourses(termCode: string, limit: number, index: number) {
        return this.courseResource.getBySemester({
            semester__term_code: termCode, 
            offset: index * limit,
            limit: limit
        }).$promise;
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

            return this._loadCourses(termCode, 0, 0).then((data) => {
                this.localStorageService.set('courses-' + termCode, data);
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
    }
}

export = CourseService;
