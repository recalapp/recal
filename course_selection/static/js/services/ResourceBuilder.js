define(["require", "exports", './TestSharingService', './ColorResource'], function(require, exports, TestSharingService, ColorResource) {
    var ResourceBuilder = (function () {
        function ResourceBuilder($resource, localStorageService) {
            this.$resource = $resource;
            this.localStorageService = localStorageService;
        }
        ResourceBuilder.prototype.getCourseResource = function () {
            return this.$resource('/course_selection/api/v1/course/', {}, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            });
        };

        ResourceBuilder.prototype.getTestSharingService = function () {
            return new TestSharingService(this.getCourseResource(), this.localStorageService);
        };

        ResourceBuilder.prototype.getColorResource = function () {
            return new ColorResource(this.$resource);
        };
        ResourceBuilder.$inject = [
            '$resource',
            'localStorageService'
        ];
        return ResourceBuilder;
    })();

    
    return ResourceBuilder;
});
//# sourceMappingURL=ResourceBuilder.js.map
