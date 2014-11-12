define(["require", "exports"], function(require, exports) {
    var TestSharingService = (function () {
        function TestSharingService() {
            this.data = {
                foo: 'foo',
                bar: 'bar',
                previewCourse: null,
                enrolledCourses: []
            };
            this.data.previewCourse = null;
            this.data.enrolledCourses = [];
        }
        TestSharingService.prototype.getData = function () {
            return this.data;
        };

        TestSharingService.prototype.setPreviewCourse = function (course) {
            this.data.previewCourse = course;
        };

        TestSharingService.prototype.clearPreviewCourse = function () {
            this.setPreviewCourse(null);
        };

        TestSharingService.prototype.enrollCourse = function (course) {
            this.data.enrolledCourses.push(course);
        };

        TestSharingService.prototype.unenrollCourse = function (course) {
            var enrolledCourses = this.data.enrolledCourses;
            var idx = this.courseIdxInList(course, enrolledCourses);
            enrolledCourses.splice(idx, 1);
        };

        TestSharingService.prototype.courseIdxInList = function (course, list) {
            for (var i = 0; i < list.length; i++) {
                if (course.id == list[i].id) {
                    return i;
                }
            }

            return TestSharingService.NOT_FOUND;
        };

        TestSharingService.prototype.isCourseEnrolled = function (course) {
            var idx = this.courseIdxInList(course, this.data.enrolledCourses);
            return idx != TestSharingService.NOT_FOUND;
        };
        TestSharingService.NOT_FOUND = -1;
        return TestSharingService;
    })();

    
    return TestSharingService;
});
