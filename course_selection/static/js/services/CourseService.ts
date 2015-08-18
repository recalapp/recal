/// <reference path='../../ts/typings/tsd.d.ts' />

import ICourse = require('../interfaces/ICourse');
import ICourseResource = require('../interfaces/ICourseResource');
import Service = require('./Service');

'use strict';

class CourseService {

    private static API_URL = "/course_selection/api/static/courses/";

    public static $inject = [
        '$q',
        '$http',
        'localStorageService'
    ];

    constructor(
        private $q,
        private $http,
        private localStorageService) {
        }

        // cache into local storage service
        // wrap around with a promise
        public getBySemester(termCode: string) {
            // var temp = this.localStorageService.get('courses-' + termCode);
            // if (temp != null && Array.isArray(temp)) {
            //     return this.$q.when(temp);
            // } else {
            return this.$http.get(CourseService.API_URL + termCode).then((response) => {
                // disabling local storage for now, since it basically acts as a
                // cache with indefinite timeout
                // this.localStorageService.set('courses-' + termCode, response.data);
                return response.data;
            });
        // }
        }
}

export = CourseService;
