define(["require", "exports"], function(require, exports) {
    'use strict';

    var ColorResource = (function () {
        function ColorResource($resource) {
            this.$resource = $resource;
            this.resource = $resource(ColorResource.BASE_URL, {}, {
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
        ColorResource.prototype.query = function () {
            return this.resource.query();
        };

        ColorResource.prototype.getBySemester = function (semesterTermCode) {
            return this.resource.getBySemester({ semester__term_code: semesterTermCode });
        };

        ColorResource.prototype.transformTastypieResponse = function (data, header) {
            var parsed = JSON.parse(data);

            if (parsed.meta && parsed.objects) {
                return parsed.objects;
            } else {
                return parsed;
            }
        };
        ColorResource.$inject = ['$resource'];
        ColorResource.BASE_URL = "/course_selection/api/v1/course/";

        ColorResource.previewColor = {
            id: -1,
            dark: 'rgb(84, 84, 84)',
            light: 'rgb(210, 210, 210)'
        };
        return ColorResource;
    })();

    
    return ColorResource;
});
//# sourceMappingURL=ColorResource.js.map
