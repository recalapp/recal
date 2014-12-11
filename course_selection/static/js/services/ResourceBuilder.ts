/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ICourseResource = require('../interfaces/ICourseResource');
import UserService = require('./UserService');

// TODO: move each to a separate file
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
                    },
                    getBySemester: {
                        method: 'GET',
                        isArray: true,
                        cache: true,
                        transformResponse: this.transformTastypieResponse
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
                    },
                    getByUser: {
                        method: 'GET',
                        isArray: true,
                        transformResponse: this.transformTastypieResponse
                    },

                    update: {
                        method: 'POST',
                        params: {
                        }
                    }
                });
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

    public getUserService() {
        return new UserService(this.$resource);
    }
}

export = ResourceBuilder;
