/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports"], function(require, exports) {
    'use strict';

    var CourseResource = (function () {
        function CourseResource($resource) {
            this.$resource = $resource;
        }
        CourseResource.prototype.query = function () {
            return this.$resource('testurl');
        };

        CourseResource.prototype.get = function () {
            return this.$resource('testurl', { method: 'GET', params: { phoneId: 'phones' }, isArray: false });
        };

        CourseResource.prototype.put = function (courses) {
            null;
        };
        CourseResource.$inject = ['$resource'];
        return CourseResource;
    })();

    
    return CourseResource;
});
