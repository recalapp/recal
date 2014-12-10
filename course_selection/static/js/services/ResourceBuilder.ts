/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ICourseResource = require('../interfaces/ICourseResource');
import UserService = require('./UserService');

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
                        isArray: false,
                        transformResponse: (data, header) => {
                            return data.objects;
                        }
                    } 
                }
                );
    }

    public getColorResource() {
        return <any>this.$resource('/course_selection/api/v1/color_palette/',
                {},
                {
                    query: {
                        method: 'GET',
                        isArray: false
                    }
                });
    }

    public getScheduleResource() {
        return this.$resource('/course_selection/api/v1/schedule/:id',
                {},
                {
                    query: {
                        method: 'GET',
                        isArray: false
                    }
                });
    }

    public getUserService() {
        return new UserService(this.$resource);
    }
}

export = ResourceBuilder;
