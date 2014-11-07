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
            this.$scope.data = testSharingService.getData();
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
            var idx = this.courseIdxInList(course, this.$scope.data.enrolledCourses);
            if (idx == SearchCtrl.NOT_FOUND) {
                //this.testSharingService.setPreviewCourse(course);
                this.$scope.data.previewCourse = course;
            }
        };

        // TODO: what if course.id != previewCourse.id? will it ever be out of sync?
        SearchCtrl.prototype.onMouseLeave = function (course) {
            this.$scope.data.previewCourse = null;
        };

        // TODO: what if user removes serach string => no more search results?
        // currently results in preview course being sticky
        SearchCtrl.prototype.onClick = function (course) {
            var courses = this.$scope.data.enrolledCourses;

            // if course is in courses, remove it
            // else add it
            var idx = this.courseIdxInList(course, courses);
            if (idx == SearchCtrl.NOT_FOUND) {
                courses.push(course);
            } else {
                courses.splice(idx, 1);
            }

            this.$scope.data.enrolledCourses = courses;
            //this.testSharingService.setEnrolledCourses(courses);
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

        SearchCtrl.prototype.getAllCourseListings = function (course) {
            if (!course) {
                console.log("getAllCourseListings's input is " + course);
                return '';
            }

            var listings = [];
            for (var i = 0; i < course.course_listings.length; i++) {
                var curr = course.course_listings[i];
                if (curr.is_primary) {
                    listings.unshift(curr.dept + curr.number);
                } else {
                    listings.push(curr.dept + curr.number);
                }
            }

            return listings.join('/');
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
