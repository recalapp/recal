/// <reference path='../../ts/typings/tsd.d.ts' />

import ICourseResource = require('../interfaces/ICourseResource');

class ResourceBuilder {
    static $inject = [
        '$resource',
        'localStorageService'
    ];

    public static V1_URL: string = "/course_selection/api/v1/";

    public static BASE_URL = ResourceBuilder.V1_URL;

    constructor(private $resource: angular.resource.IResourceService, private localStorageService) {}

    // TODO: figure out how to use typescript to properly do this
    public getCourseResource() {
        return this.$resource(ResourceBuilder.BASE_URL + 'course/',
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
                });
    }

    public getColorResource() {
        return this.$resource(ResourceBuilder.BASE_URL + 'color_palette/',
                {},
                {
                    query: {
                        method: 'GET',
                        isArray: true,
                        transformResponse: this.transformTastypieResponse
                    }
                });
    }

    public getScheduleResource() {
        return this.$resource(ResourceBuilder.BASE_URL + 'schedule/:id',
                {id: '@id'},
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
                        method: 'PUT',
                        params: {
                        }
                    }
                });
    }

    public getUserResource() {
        return this.$resource(ResourceBuilder.BASE_URL + 'user/:id',
                {},
                {
                    getByNetId: {
                        method: 'GET',
                        isArray: false,
                        transformResponse: this.getFirstObject
                    }
                });
    }

    public getFriendResource() {
        return this.$resource(ResourceBuilder.BASE_URL + 'friend/:id',
        {},
        {
            query: {
                method: 'GET',
                isArray: true,
                transformResponse: this.transformTastypieResponse
            }
        });
    }

    public getSemesterResource() {
        return this.$resource(ResourceBuilder.BASE_URL + 'semester/',
                {},
                {
                    getByTermCode: {
                        method: 'GET',
                        isArray: false,
                        transformResponse: this.getFirstObject
                    },
                    query: {
                        method: 'GET',
                        isArray: true,
                        transformResponse: this.transformTastypieResponse
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

    private getFirstObject(data, header) {
        var parsed = JSON.parse(data);
        return parsed.objects[0];
    }
}

export = ResourceBuilder;
