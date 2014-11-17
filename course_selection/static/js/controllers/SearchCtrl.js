define(["require", "exports"], function(require, exports) {
    'use strict';

    var SearchCtrl = (function () {
        function SearchCtrl($scope, courseResource, localStorageService, testSharingService) {
            this.$scope = $scope;
            this.courseResource = courseResource;
            this.localStorageService = localStorageService;
            this.testSharingService = testSharingService;
            this.$scope.vm = this;
            this.$scope.data = testSharingService.getData();
        }
        SearchCtrl.prototype.onMouseOver = function (course) {
            if (this.testSharingService.isCourseEnrolled(course)) {
                this.testSharingService.clearPreviewCourse();
            } else {
                this.testSharingService.setPreviewCourse(course);
            }
        };

        SearchCtrl.prototype.onMouseLeave = function (course) {
            this.testSharingService.clearPreviewCourse();
        };

        SearchCtrl.prototype.onClick = function (course) {
            if (this.testSharingService.isCourseEnrolled(course)) {
                this.testSharingService.unenrollCourse(course);
            } else {
                this.testSharingService.enrollCourse(course);
            }
        };
        SearchCtrl.$inject = [
            '$scope',
            'CourseResource',
            'localStorageService',
            'TestSharingService'
        ];

        SearchCtrl.NOT_FOUND = -1;
        return SearchCtrl;
    })();

    
    return SearchCtrl;
});
//# sourceMappingURL=SearchCtrl.js.map
