define(["require", "exports"], function(require, exports) {
    var TestSharingService = (function () {
        function TestSharingService() {
            this.previewEvents = [];
            this.enrolledCourses = [];
        }
        TestSharingService.prototype.setPreviewEvents = function (input) {
            this.previewEvents = input;
        };

        TestSharingService.prototype.getPreviewEvents = function () {
            return this.previewEvents;
        };

        TestSharingService.prototype.setEnrolledCourses = function (input) {
            this.enrolledCourses = input;
        };

        TestSharingService.prototype.getEnrolledCourses = function () {
            return this.enrolledCourses;
        };
        return TestSharingService;
    })();

    
    return TestSharingService;
});
