/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ICourseResource = require('../interfaces/ICourseResource');
import ColorResource = require('./ColorResource');

class ResourceBuilder {
    static $inject = [
        '$resource',
        'localStorageService'
    ];
    
    constructor(private $resource: ng.resource.IResourceService, private localStorageService) {}

    // TODO: figure out how to use typescript to properly do this
    public getCourseResource(): ICourseResource {
        return <any>this.$resource('/course_selection/api/v1/course/', 
                {}, 
                { 
                    query: {
                        method: 'GET', 
                        isArray: false
                    } 
                }
                );
    }

    public getScheduleResource() {
        return this.$resource('/course_selection/api/v1/schedule/',
                {},
                {
                    query: {
                        method: 'GET',
                        isArray: false
                    }
                });
    }

    public getColorResource() {
        return new ColorResource(this.$resource);
    }
}

export = ResourceBuilder;
