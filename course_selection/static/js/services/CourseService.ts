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

    public getBySemester(termCode: string) {
        var temp = this.localStorageService.get('courses-' + termCode);
        if (temp != null && Array.isArray(temp)) {
            return this.$q.when(temp);
        } else {
            return this.courseResource.getBySemester({semester__term_code: termCode})
                .$promise.then((data) => {
                this.localStorageService.set('courses-' + termCode, data);
            });
        }
    }
}

export = CourseService;
