/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ISection = require('../interfaces/ISection');
import ICourseSearchScope = require('../interfaces/ICourseSearchScope');
import ICourse = require('../interfaces/ICourse');
import Course = require('../models/Course');
import ICourseManager = require('../interfaces/ICourseManager');

'use strict';

class SearchCtrl {
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope',
        '$sce',
    ];

    private static NOT_FOUND: number = -1;

    private courseManager: ICourseManager;

    constructor(
            private $scope: ICourseSearchScope,
            private $sce
            ) {
        this.$scope.vm = this;
        this.courseManager = (<any>this.$scope.$parent).schedule.courseManager;
        this.$scope.data = this.courseManager.getData();
    }

    public queryOnChange() {
        this.courseManager.clearPreviewCourse();
    }

    // if user is not enrolled in course yet, add course events to previewEvents
    // else, don't do anything
    public onMouseOver(course) {
        if (this.courseManager.isCourseEnrolled(course)) {
            this.courseManager.clearPreviewCourse();
        } else {
            this.courseManager.setPreviewCourse(course);
        }
    }

    // clear preview course on mouse leave
    public onMouseLeave(course) {
        this.courseManager.clearPreviewCourse();
    }

    public enrolledOnMouseOver(course) {
    }

    // toggle enrollment of course
    public toggleEnrollment(course) {
        if (this.courseManager.isCourseEnrolled(course)) {
            this.courseManager.unenrollCourse(course);
        } else {
            this.courseManager.enrollCourse(course);
        }
    }

    public getStyles(course): any {
        return angular.extend({}, this.getBorderStyle(course),
                this.getBackgroundAndTextStyle(course));
    }

    public getBorderStyle(course): any {
        return {
            'border-color': course.colors.dark
        };
    }

    public getBackgroundAndTextStyle(course): any 
    {
        return {
            'background-color': course.colors.light,
            'color': course.colors.dark
        };
    }

    public isConfirmed(course: ICourse) {
        return this.courseManager.isCourseAllSectionsEnrolled(course);
    }

    // TODO: this function no longer works due to course.colors never being null
    public getLinkColor(course) {
        if (course.colors) {
            return course.colors.dark;
        } else {
            return 'blue';
        }
    }
}

export = SearchCtrl;
