/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
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
        // if user is not enrolled in course yet, add course events to previewEvents
        // else, don't do anything
        SearchCtrl.prototype.onMouseOver = function (course) {
            if (this.testSharingService.isCourseEnrolled(course)) {
                this.testSharingService.clearPreviewCourse();
            } else {
                this.testSharingService.setPreviewCourse(course);
            }
        };

        // TODO: what if course.id != previewCourse.id? will it ever be out of sync?
        SearchCtrl.prototype.onMouseLeave = function (course) {
            this.testSharingService.clearPreviewCourse();
        };

        // TODO: what if user removes serach string => no more search results?
        // currently results in preview course being sticky
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
