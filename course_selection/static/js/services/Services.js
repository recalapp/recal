/// <amd-dependency path="angular"/>
define(["require", "exports", './ResourceBuilder', "angular"], function(require, exports, ResourceBuilder) {
    var niceServices = angular.module('niceServices', []);

    //niceServices.addService('CourseResource', CourseResource);
    niceServices.factory('ResourceBuilder', ['$resource', 'localStorageService', function ($resource, localStorageService) {
            return new ResourceBuilder($resource, localStorageService);
        }]);

    niceServices.factory('ScheduleResource', ["ResourceBuilder", function (builder) {
            return builder.getScheduleResource();
        }]);
    niceServices.factory('CourseResource', ["ResourceBuilder", function (builder) {
            return builder.getCourseResource();
        }]);
    niceServices.factory('ColorResource', ["ResourceBuilder", function (builder) {
            return builder.getColorResource();
        }]);

    
    return niceServices;
});
