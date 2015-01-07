define(["require", "exports"], function(require, exports) {
    'use strict';

    var CourseService = (function () {
        function CourseService($q, localStorageService, courseResource) {
            this.$q = $q;
            this.localStorageService = localStorageService;
            this.courseResource = courseResource;
        }
        CourseService.prototype.getBySemester = function (termCode) {
            var _this = this;
            var temp = this.localStorageService.get('courses-' + termCode);
            if (temp != null && Array.isArray(temp)) {
                return this.$q.when(temp);
            } else {
                var proms = [];
                for (var i = 0; i < 10; i++) {
                    proms.push(this.courseResource.getBySemester({
                        semester__term_code: termCode,
                        offset: i * 200,
                        limit: 200
                    }).$promise);
                }

                return this.$q.all(proms).then(function (arrayOfArraysOfCourses) {
                    var courseArray = arrayOfArraysOfCourses.reduce(function (accum, curr, index, array) {
                        return accum.concat(curr);
                    });
                    _this.localStorageService.set('courses-' + termCode, courseArray);
                    return courseArray;
                });
            }
        };
        CourseService.$inject = [
            '$q',
            'localStorageService',
            'CourseResource'
        ];
        return CourseService;
    })();

    
    return CourseService;
});
//# sourceMappingURL=CourseService.js.map
