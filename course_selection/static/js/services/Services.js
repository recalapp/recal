/// <amd-dependency path="angular"/>
define(["require", "exports", './ResourceBuilder', "angular"], function(require, exports, ResourceBuilder) {
    var niceServices = angular.module('niceServices', []);

    //niceServices.addService('CourseResource', CourseResource);
    niceServices.factory('ResourceBuilder', ['$resource', 'localStorageService', function ($resource, localStorageService) {
            return new ResourceBuilder($resource, localStorageService);
        }]);

    niceServices.factory('CourseResource', ["ResourceBuilder", function (builder) {
            return builder.getCourseResource();
        }]);
    niceServices.factory('TestSharingService', ["ResourceBuilder", function (builder) {
            return builder.getTestSharingService();
        }]);
    niceServices.factory('ColorResource', ["ResourceBuilder", function (builder) {
            return builder.getColorResource();
        }]);

    
    return niceServices;
});
