/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports"], function(require, exports) {
    'use strict';

    var CourseService = (function () {
        function CourseService(courseResource) {
            this.courseResource = courseResource;
        }
        CourseService.prototype.getBySemester = function (semesterTermCode) {
            return this.courseResource.getBySemester({ semester__term_code: semesterTermCode });
        };

        CourseService.prototype.transformTastypieResponse = function (data, header) {
            var parsed = JSON.parse(data);

            // data could be an array with metadata
            if (parsed.meta && parsed.objects) {
                return parsed.objects;
            } else {
                return parsed;
            }
        };
        CourseService.$inject = ['CourseResource'];
        return CourseService;
    })();

    
    return CourseService;
});
