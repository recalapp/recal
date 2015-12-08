/// <reference path='../../ts/typings/tsd.d.ts' />

import ICourse = require('../interfaces/ICourse');
import ICourseResource = require('../interfaces/ICourseResource');
import Service = require('./Service');

'use strict';

class CourseService {

    private static API_URL = "/course_selection/api/static/courses/";

    public static $inject = [
        '$q',
        '$http'
    ];

    constructor(private $q, private $http) {
    }

    public getBySemester(termCode: string) {
        return this.$http.get(CourseService.API_URL + termCode, {
            cache: true
        }).then((response) => {
            return response.data;
        });
    }
}

export = CourseService;
