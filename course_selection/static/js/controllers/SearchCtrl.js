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
            this.loadCourses();
        }
        SearchCtrl.prototype.loadCourses = function () {
            var _this = this;
            this.courseResource.query({}, function (data) {
                return _this.onLoaded(data);
            });
        };

        SearchCtrl.prototype.onLoaded = function (data) {
            this.$scope.courses = data['objects'];
        };

        // if user is not enrolled in course yet, add course events to previewEvents
        // else, TODO: don't do anything
        SearchCtrl.prototype.onMouseOver = function (course) {
            var idx = this.courseIdxInList(course, this.testSharingService.getEnrolledCourses());
            if (idx == SearchCtrl.NOT_FOUND) {
                this.testSharingService.setPreviewCourse(course);
            }
        };

        SearchCtrl.prototype.onClick = function (course) {
            var courses = this.testSharingService.getEnrolledCourses();

            // if course is in courses, remove it
            // else add it
            var idx = this.courseIdxInList(course, courses);
            if (idx == SearchCtrl.NOT_FOUND) {
                courses.push(course);
            } else {
                courses.splice(idx, 1);
            }

            this.testSharingService.setEnrolledCourses(courses);
        };

        SearchCtrl.prototype.courseIdxInList = function (course, list) {
            for (var i = 0; i < list.length; i++) {
                if (course.id == list[i].id) {
                    return i;
                }
            }

            return SearchCtrl.NOT_FOUND;
        };

        SearchCtrl.prototype.getPrimaryCourseListing = function (course) {
            for (var i = 0; i < course.course_listings.length; i++) {
                var curr = course.course_listings[i];
                if (curr.is_primary) {
                    return curr.dept + curr.number;
                }
            }

            return "";
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
