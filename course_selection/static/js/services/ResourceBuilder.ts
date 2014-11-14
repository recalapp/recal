/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ICourseResource = require('../interfaces/ICourseResource');
import CourseResource = require('../services/CourseResource');
import TestSharingService = require('./TestSharingService');
import ColorResource = require('./ColorResource');

class ResourceBuilder {
    static $inject = [
        '$resource',
        'CourseResource'
    ];
    
    constructor(private $resource: ng.resource.IResourceService) {}

    // TODO: figure out how to use typescript to properly do this
    public getCourseResource(): ICourseResource {
        return <any>this.$resource('/course_selection/api/v1/course/:id', {id: '@id'}, {
            query: {method: 'GET', isArray: false}
        });
    }

    public getTestSharingService() {
        return new TestSharingService(this.getCourseResource());
    }

    public getColorResource() {
        return new ColorResource(this.$resource);
    }
}

export = ResourceBuilder;
