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

    private setPreviewCourse(course: ICourse): void {
        this.$scope.data.previewCourse = course;
    }

    private clearPreviewCourse(): void {
        this.setPreviewCourse(null);
    }

    private isCourseEnrolled(course: ICourse): boolean {
        var idx = this.courseIdxInList(course, this.$scope.data.enrolledCourses);
        return idx != SearchCtrl.NOT_FOUND;
    }

    // if user is not enrolled in course yet, add course events to previewEvents
    // else, don't do anything
    public onMouseOver(course) {
        if (!this.isCourseEnrolled(course)) {
            this.setPreviewCourse(course);
        }
    }

    // TODO: what if course.id != previewCourse.id? will it ever be out of sync?
    public onMouseLeave(course) {
        this.clearPreviewCourse();
    }

    private unenrollCourse(course: ICourse): void {
        var enrolledCourses = this.$scope.data.enrolledCourses;
        var idx = this.courseIdxInList(course, enrolledCourses);
        enrolledCourses.splice(idx, 1);
    }

    private enrollCourse(course: ICourse): void {
        this.$scope.data.enrolledCourses.push(course);
    }

    // TODO: what if user removes serach string => no more search results?
    // currently results in preview course being sticky
    public onClick(course) {
        if (this.isCourseEnrolled(course)) {
            this.unenrollCourse(course);
        } else {
            this.enrollCourse(course);
        }
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

    private getAllCourseListings(course: ICourse): string {
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

        return listings.join(' / ');
    }
}

export = SearchCtrl;
