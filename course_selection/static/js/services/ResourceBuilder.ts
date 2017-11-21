/// <reference path='../../ts/typings/tsd.d.ts' />

import ICourseResource = require('../interfaces/ICourseResource');
import IFriendRequest = require('../interfaces/IFriendRequest');
import IFriendRequestResource = require('../interfaces/IFriendRequestResource');

function getContentLength(httpConfig) {
    // Hack to explicitly set Content-Length header, because Safari doesn't do
    // it for us.
    var data = httpConfig.data;
    var length = 0;
    if (typeof data === 'string' || data instanceof String) {
        length = data.length;
        }
    else {
        length = JSON.stringify(data).length;
        }
    return length;
    }

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
        return this.$resource(ResourceBuilder.BASE_URL + 'schedule/:id/',
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
                        // Send as a POST request, but act like a PUT request.
                        // Fixes a Safari bug that would not set the
                        // Content-Length header for PUT requests.
                        // See: https://github.com/recalapp/recal/issues/326.
                        // See: http://django-tastypie.readthedocs.io/en/latest/resources.html#using-put-delete-patch-in-unsupported-places.
                        method: 'POST',
                        headers: {
                            'Content-Length': getContentLength,
                            'X-HTTP-Method-Override': 'PUT',
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

    // TODO: rename the api
    public getFriendRequestResource(): angular.resource.IResourceClass<IFriendRequestResource> {
        return <any>this.$resource(ResourceBuilder.BASE_URL + 'friend_request/:id',
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
