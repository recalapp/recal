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

    private scheduleManager: ICourseManager;

    constructor(
            private $scope,
            private $sce
            ) {
        this.$scope.vm = this;
        this.scheduleManager = (<any>this.$scope.$parent).schedule.scheduleManager;
        this.$scope.data = this.scheduleManager.getData();
    }

    public queryOnChange() {
        this.scheduleManager.clearPreviewCourse();
    }

    /*
    private _initState() {
        this.$scope.state = "loading";
        this.$scope.$watch(() => {
            return this.$scope.data.courses;
        }, () => {
            if (this.$scope.data.courses.length == 0) {
                this.$scope.state = "loading";
            };
        });
    }
    */

    // if user is not enrolled in course yet, add course events to previewEvents
    // else, don't do anything
    public onMouseOver(course) {
        if (this.scheduleManager.isCourseEnrolled(course)) {
            this.scheduleManager.clearPreviewCourse();
        } else {
            this.scheduleManager.setPreviewCourse(course);
        }
    }

    // clear preview course on mouse leave
    public onMouseLeave(course) {
        this.scheduleManager.clearPreviewCourse();
    }

    public enrolledOnMouseOver(course) {
    }

    // toggle enrollment of course
    public toggleEnrollment(course) {
        if (this.scheduleManager.isCourseEnrolled(course)) {
            this.scheduleManager.unenrollCourse(course);
        } else {
            this.scheduleManager.enrollCourse(course);
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
        return this.scheduleManager.isCourseAllSectionsEnrolled(course);
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
