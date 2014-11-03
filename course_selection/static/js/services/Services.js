define(["require", "exports", './ResourceBuilder', "angular"], function(require, exports, ResourceBuilder) {
    var niceServices = angular.module('niceServices', []);

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
//# sourceMappingURL=Services.js.map
