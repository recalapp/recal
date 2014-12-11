/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports", './UserService'], function(require, exports, UserService) {
    // TODO: move each to a separate file
    var ResourceBuilder = (function () {
        function ResourceBuilder($resource, localStorageService) {
            this.$resource = $resource;
            this.localStorageService = localStorageService;
        }
        // TODO: figure out how to use typescript to properly do this
        ResourceBuilder.prototype.getCourseResource = function () {
            return this.$resource('/course_selection/api/v1/course/', {}, {
                query: {
                    method: 'GET',
                    isArray: false
                },
                getBySemester: {
                    method: 'GET',
                    isArray: true,
                    cache: true,
                    transformResponse: this.transformTastypieResponse
                }
            });
        };

        ResourceBuilder.prototype.getColorResource = function () {
            return this.$resource('/course_selection/api/v1/color_palette/', {}, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            });
        };

        ResourceBuilder.prototype.getScheduleResource = function () {
            return this.$resource('/course_selection/api/v1/schedule/:id', {}, {
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
                    params: {}
                }
            });
        };

        ResourceBuilder.prototype.transformTastypieResponse = function (data, header) {
            var parsed = JSON.parse(data);

            // data could be an array with metadata
            if (parsed.meta && parsed.objects) {
                return parsed.objects;
            } else {
                return parsed;
            }
        };

        ResourceBuilder.prototype.getUserService = function () {
            return new UserService(this.$resource);
        };
        ResourceBuilder.$inject = [
            '$resource',
            'localStorageService'
        ];
        return ResourceBuilder;
    })();

    
    return ResourceBuilder;
});
