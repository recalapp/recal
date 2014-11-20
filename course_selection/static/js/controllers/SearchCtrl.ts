/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ISection = require('../interfaces/ISection');
import ICourseSearchScope = require('../interfaces/ICourseSearchScope');
import CourseResource = require('../services/CourseResource');
import ICourse = require('../interfaces/ICourse');
import Course = require('../models/Course');
import CourseManager = require('../models/CourseManager');

'use strict';

class SearchCtrl {
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope',
        '$sce',
        'CourseResource',
    ];

    private static NOT_FOUND: number = -1;

    private courseManager: CourseManager;

    constructor(
            private $scope: ICourseSearchScope,
            private $sce,
            private courseResource
            ) {
        this.$scope.vm = this;
        this.courseManager = (<any>this.$scope.$parent).schedule.courseManager;
        this.$scope.data = this.courseManager.getData();
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

    // TODO: what if course.id != previewCourse.id? will it ever be out of sync?
    public onMouseLeave(course) {
        this.courseManager.clearPreviewCourse();
    }

    // TODO: what if user removes serach string => no more search results?
    // currently results in preview course being sticky
    public onClick(course) {
        if (this.courseManager.isCourseEnrolled(course)) {
            this.courseManager.unenrollCourse(course);
        } else {
            this.courseManager.enrollCourse(course);
        }
    }

    public setColor(course: ICourse): any 
    {
        if (course.colors == null) {
            return {};
        } else {
            return {
                'background-color': course.colors.dark,
                'color': 'white'
            };
        }
    }

    public getEasyPceLink(course: ICourse): string {
        var color = this.setColor(course).color;
        var link = "http://easypce.com/courses/" + course.primary_listing;
        return this.$sce.trustAsHtml(
                "<a target='_blank' href='" + link + "'" 
                + "style='color: " + color + "'" 
                + ">" + course.rating + "</a>");
    }
}

export = SearchCtrl;
