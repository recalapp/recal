/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports", './TestSharingService', './ColorResource'], function(require, exports, TestSharingService, ColorResource) {
    var ResourceBuilder = (function () {
        function ResourceBuilder($resource) {
            this.$resource = $resource;
        }
        // TODO: figure out how to use typescript to properly do this
        ResourceBuilder.prototype.getCourseResource = function () {
            return this.$resource('/course_selection/api/v1/course/:id', { id: '@id' }, {
                query: { method: 'GET', isArray: false }
            });
        };

        ResourceBuilder.prototype.getTestSharingService = function () {
            return new TestSharingService(this.getCourseResource());
        };

        ResourceBuilder.prototype.getColorResource = function () {
            return new ColorResource(this.$resource);
        };
        ResourceBuilder.$inject = [
            '$resource',
            'CourseResource'
        ];
        return ResourceBuilder;
    })();

    
    return ResourceBuilder;
});
