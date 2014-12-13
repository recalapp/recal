/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ICourse = require('../interfaces/ICourse');
import ICourseResource = require('../interfaces/ICourseResource');
import Service = require('./Service');

'use strict';

class CourseResource implements ICourseResource {

    public static $inject = ['$resource'];
    public static BASE_URL: string = "/course_selection/api/v1/course/";

    private resource;

    constructor(private $resource: ng.resource.IResourceService) {
        this.resource = $resource(CourseResource.BASE_URL, {},
                {
                    query: {
                        method: 'GET', 
                        isArray: false,
                    },
                    getBySemester: {
                        method: 'GET',
                        isArray: true,
                        cache: true,
                        transformResponse: this.transformTastypieResponse
                    }
                });
    }

    public query() {
        return this.resource.query();
    }

    public getBySemester(semesterTermCode: string) {
        return this.resource.getBySemester({semester__term_code: semesterTermCode});
    }

    private transformTastypieResponse(data, header) {
        var parsed = JSON.parse(data);
        // data could be an array with metadata
        if (parsed.meta && parsed.objects) {
            return parsed.objects;
        } else {
            return parsed;
        }
    }
}

export = CourseResource;
