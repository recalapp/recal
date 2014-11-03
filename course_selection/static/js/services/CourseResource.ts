/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ICourse = require('../interfaces/ICourse');
import ICourseResource = require('../interfaces/ICourseResource');
import Service = require('./Service');

'use strict';

class CourseResource extends Service {

    static $inject = ['$resource']

    constructor(private $resource: ng.resource.IResourceService) {
        super();
    }

    public query() {
    }

    public get() {
    }

    public put(courses: ICourse[]) {
    }
}

export = CourseResource;
