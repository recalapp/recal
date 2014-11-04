/// <amd-dependency path="angular"/>
define(["require", "exports", './ResourceBuilder', "angular"], function(require, exports, ResourceBuilder) {
    var niceServices = angular.module('niceServices', []);

    //niceServices.addService('CourseResource', CourseResource);
    niceServices.factory('ResourceBuilder', ['$resource', function ($resource) {
            return new ResourceBuilder($resource);
        }]);

    niceServices.factory('CourseResource', ["ResourceBuilder", function (builder) {
            return builder.getCourseResource();
        }]);
    niceServices.factory('TestSharingService', ["ResourceBuilder", function (builder) {
            return builder.getTestSharingService();
        }]);

    
    return niceServices;
});
