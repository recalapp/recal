/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ISection = require('../interfaces/ISection');
import ICourseSearchScope = require('../interfaces/ICourseSearchScope');
import ICourse = require('../interfaces/ICourse');
import Course = require('../models/Course');
import IScheduleManager = require('../interfaces/IScheduleManager');

'use strict';

class SearchCtrl {
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope',
        '$sce',
        '$filter'
    ];

    private static NOT_FOUND: number = -1;

    private _scheduleManager: IScheduleManager;
    public get scheduleManager() {
        return this._scheduleManager;
    }

    constructor(
            private $scope,
            private $sce,
            private $filter
            ) {
        this.$scope.vm = this;
        this._scheduleManager = (<any>this.$scope.$parent).schedule.scheduleManager;
        this.$scope.data = this._scheduleManager.getData();
        this.$scope.filteredCourses = this.$scope.data.courses;

        this.$scope.$watch(() => {
            return this.$scope.query;
        }, (newVal, oldVal) => {
            this._scheduleManager.clearPreviewCourse();

            this.$scope.filteredCourses = this.$filter("courseSearch")(this.$scope.data.courses, newVal);

            var enrolledLength = this.$scope.data.enrolledCourses.length;
            var searchResultLength = this.$scope.filteredCourses.length;

            this.updateContainerHeight(enrolledLength + searchResultLength);
        });
    }

    // if user is not enrolled in course yet, add course events to previewEvents
    // else, don't do anything
    public onMouseOver(course) {
        if (this._scheduleManager.isCourseEnrolled(course)) {
            this._scheduleManager.clearPreviewCourse();
        } else {
            this._scheduleManager.setPreviewCourse(course);
        }
    }

    // clear preview course on mouse leave
    public onMouseLeave(course) {
        this._scheduleManager.clearPreviewCourse();
    }

    // toggle enrollment of course
    public toggleEnrollment(course) {
        if (this._scheduleManager.isCourseEnrolled(course)) {
            this._scheduleManager.unenrollCourse(course);
        } else {
            this._scheduleManager.enrollCourse(course);
        }
    }

    // TODO: do this the angular way
    // or even better, use css for this
    public updateContainerHeight(numOfDisplayedCourses: number) {
        var THRESHOLD = 12;
        var ENROLLED_CONTAINER_HEIGHT = '20vh';
        var SEARCH_CONTAINER_HEIGHT = '50vh';
        var MAX_HEIGHT = '80vh';

        var enrolledPanelsContainer = $("#enrolledPanelsContainer");
        var searchPanelsContainer = $("#searchPanelsContainer");

        if (numOfDisplayedCourses > THRESHOLD)
        {
            enrolledPanelsContainer.css({'max-height': ENROLLED_CONTAINER_HEIGHT});
            searchPanelsContainer.css({'max-height': SEARCH_CONTAINER_HEIGHT});
        } else {
            enrolledPanelsContainer.css({'max-height': MAX_HEIGHT});
            searchPanelsContainer.css({'max-height': MAX_HEIGHT});
        }
    }

    public getCourseStyles(course): any {
        return angular.extend({}, this.getCourseBorderStyle(course),
                this.getCourseBackgroundAndTextStyle(course));
    }

    public getCourseBorderStyle(course): any {
        return {
            'border-color': course.colors.dark
        };
    }

    public getCourseBackgroundAndTextStyle(course): any
    {
        return {
            'background-color': course.colors.light,
            'color': course.colors.dark
        };
    }

    public isConfirmed(course: ICourse) {
        return this._scheduleManager.isCourseAllSectionsEnrolled(course);
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
