/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ICourseResource = require('../interfaces/ICourseResource');
import TestSharingService = require('./TestSharingService');

class ResourceBuilder {
    static $inject = ['$resource'];
    
    constructor(private $resource: ng.resource.IResourceService) {}

    // TODO: figure out how to use typescript to properly do this
    public getCourseResource(): ICourseResource {
        return <any>this.$resource('/course_selection/api/v1/course/:id', {id: '@id'}, {
            query: {method: 'GET', isArray: false}
        });
    }

    public getTestSharingService() {
        return new TestSharingService();
    }
}

export = ResourceBuilder;
