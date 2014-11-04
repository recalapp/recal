/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ISection = require('../interfaces/ISection');
import ICourseSearchScope = require('../interfaces/ICourseSearchScope');
import CourseResource = require('../services/CourseResource');
import TestSharingService = require('../services/TestSharingService');
import ICourse = require('../interfaces/ICourse');

'use strict';

class SearchCtrl {
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope',
        'CourseResource',
        'localStorageService',
        'TestSharingService',
    ];

    private static NOT_FOUND: number = -1;

    constructor(
            private $scope: ICourseSearchScope,
            private courseResource,
            private localStorageService,
            private testSharingService
            ) {
        this.$scope.vm = this;
        this.loadCourses();
        this.$scope.data = testSharingService.getData();
    }

    private loadCourses() {
        this.courseResource.query({}, (data) => this.onLoaded(data));
    }

    private onLoaded(data) {
        this.$scope.courses = data['objects'];
    }

    // if user is not enrolled in course yet, add course events to previewEvents
    // else, TODO: don't do anything
    public onMouseOver(course) {
        var idx = this.courseIdxInList(course, this.$scope.data.enrolledCourses);
        if (idx == SearchCtrl.NOT_FOUND) {
            //this.testSharingService.setPreviewCourse(course);
            this.$scope.data.previewCourse = course;
        }
    }

    public onClick(course) {
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
    }

    private courseIdxInList(course, list) {
        for (var i = 0; i < list.length; i++) {
            if (course.id == list[i].id) {
                return i;
            }
        }

        return SearchCtrl.NOT_FOUND;
    }

    private getPrimaryCourseListing(course: ICourse): string {
        for (var i = 0; i < course.course_listings.length; i++) {
            var curr = course.course_listings[i];
            if (curr.is_primary) {
                return curr.dept + curr.number;
            }
        }

        return "";
    }
}

export = SearchCtrl;
