/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports", './UserService'], function(require, exports, UserService) {
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
                }
            });
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
