/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ICourse = require('../interfaces/ICourse');
import ICourseResource = require('../interfaces/ICourseResource');

'use strict';

class CourseResource {

    static $inject = ['$resource']

    constructor(private $resource: ng.resource.IResourceService) {
    }

    public query() {
        return this.$resource('testurl');
    }

    public get() {
        return this.$resource('testurl', {method:'GET', params:{phoneId:'phones'}, isArray:false});
    }

    public put(courses: ICourse[]) {
        null;
    }
}

export = CourseResource;
