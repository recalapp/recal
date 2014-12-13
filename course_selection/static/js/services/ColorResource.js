define(["require", "exports"], function(require, exports) {
    'use strict';

    var CourseResource = (function () {
        function CourseResource($resource) {
            this.$resource = $resource;
            this.resource = $resource(CourseResource.BASE_URL, {}, {
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
        }
        CourseResource.prototype.query = function () {
            return this.resource.query();
        };

        CourseResource.prototype.getBySemester = function (semesterTermCode) {
            return this.resource.getBySemester({ semester__term_code: semesterTermCode });
        };

        CourseResource.prototype.transformTastypieResponse = function (data, header) {
            var parsed = JSON.parse(data);

            if (parsed.meta && parsed.objects) {
                return parsed.objects;
            } else {
                return parsed;
            }
        };
        CourseResource.$inject = ['$resource'];
        CourseResource.BASE_URL = "/course_selection/api/v1/course/";
        return CourseResource;
    })();

    
    return CourseResource;
});
//# sourceMappingURL=ColorResource.js.map
