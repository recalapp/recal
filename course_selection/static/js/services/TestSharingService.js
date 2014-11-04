define(["require", "exports"], function(require, exports) {
    var TestSharingService = (function () {
        function TestSharingService() {
            this.previewEvents = [];
            this.previewCourse = {};
            this.enrolledCourses = [];
        }
        TestSharingService.prototype.setPreviewEvents = function (input) {
            this.previewEvents = input;
        };

        TestSharingService.prototype.getPreviewEvents = function () {
            return this.previewEvents;
        };

        TestSharingService.prototype.setPreviewCourse = function (course) {
            this.previewCourse = course;
        };

        TestSharingService.prototype.getPreviewCourse = function () {
            return this.previewCourse;
        };

        TestSharingService.prototype.setEnrolledCourses = function (courses) {
            this.enrolledCourses = courses;
        };

        TestSharingService.prototype.getEnrolledCourses = function () {
            return this.enrolledCourses;
        };
        return TestSharingService;
    })();

    
    return TestSharingService;
});
