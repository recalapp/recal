/// <reference path='../../ts/typings/tsd.d.ts' />

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
    private static whichSearchEnum = {
        COURSE_SEARCH: 0,
        FRIEND_SEARCH: 1
    };

    private static COURSE_SEARCH_PLACE_HOLDER = "Search Course";
    private static FRIEND_SEARCH_PLACE_HOLDER = "Search Friend";

    private whichSearch: number;
    private placeHolder: string;

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
        this.useCourseSearch();

        this.$scope.$watch(() => {
            return this.$scope.query;
        }, (newVal, oldVal) => {
            this._scheduleManager.clearPreviewCourse();

            this.$scope.filteredCourses = this.$filter("courseSearch")(this.$scope.data.courses, newVal);

            var enrolledLength = this.$scope.data.enrolledCourses.length;
            var searchResultLength = this.$scope.filteredCourses.length;

            this.updateContainerHeight(enrolledLength, searchResultLength);
        });

        this.$scope.$watchCollection(() => {
            return this.$scope.data.enrolledCourses;
        }, (newVal, oldVal) => {
            if (newVal.length == oldVal.length) {
                return;
            }

            this.$scope.filteredCourses = this.$filter("courseSearch")(this.$scope.data.courses, this.$scope.query);
        });
    }

    public useFriendSearch() {
        this.whichSearch = SearchCtrl.whichSearchEnum.FRIEND_SEARCH;
        this.placeHolder = SearchCtrl.FRIEND_SEARCH_PLACE_HOLDER;
    }

    public useCourseSearch() {
        this.whichSearch = SearchCtrl.whichSearchEnum.COURSE_SEARCH;
        this.placeHolder = SearchCtrl.COURSE_SEARCH_PLACE_HOLDER;
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

    // we assume that course-panel-min-height is 5vh
    public updateContainerHeight(numEnrolled: number, numSearchResults) {
        var THRESHOLD = 10;
        var ENROLLED_CONTAINER_HEIGHT = '20vh';
        var SEARCH_CONTAINER_HEIGHT = '45vh';
        var MAX_HEIGHT = '70vh';

        var enrolledPanelsContainer = $(".enrolled-courses-container :visible")[0];
        var searchPanelsContainer = $(".course-panels-container :visible")[0];

        // we clip at least one of the panel containers if we exceed the threshold
        if (numEnrolled + numSearchResults > THRESHOLD)
        {
            if (enrolledPanelsContainer && searchPanelsContainer) {
                enrolledPanelsContainer.style.maxHeight = ENROLLED_CONTAINER_HEIGHT;
                searchPanelsContainer.style.maxHeight = SEARCH_CONTAINER_HEIGHT;
            } else if (enrolledPanelsContainer) {
                enrolledPanelsContainer.style.maxHeight = MAX_HEIGHT;
            } else if (searchPanelsContainer) {
                searchPanelsContainer.style.maxHeight = MAX_HEIGHT;
            }
        } else {
            // reset things
            if (enrolledPanelsContainer) {
                enrolledPanelsContainer.style.maxHeight= MAX_HEIGHT;
            }
            if (searchPanelsContainer) {
                searchPanelsContainer.style.maxHeight= MAX_HEIGHT;
            }
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
