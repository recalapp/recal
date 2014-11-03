define(["require", "exports", './TestSharingService'], function(require, exports, TestSharingService) {
    var ResourceBuilder = (function () {
        function ResourceBuilder($resource) {
            this.$resource = $resource;
        }
        ResourceBuilder.prototype.getCourseResource = function () {
            return this.$resource('/course_selection/api/v1/course/:id', { id: '@id' }, {
                query: { method: 'GET', isArray: false }
            });
        };

        ResourceBuilder.prototype.getTestSharingService = function () {
            return new TestSharingService();
        };
        ResourceBuilder.$inject = ['$resource'];
        return ResourceBuilder;
    })();

    
    return ResourceBuilder;
});
//# sourceMappingURL=ResourceBuilder.js.map
