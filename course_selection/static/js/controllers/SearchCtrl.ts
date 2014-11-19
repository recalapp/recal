/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ISection = require('../interfaces/ISection');
import ICourseSearchScope = require('../interfaces/ICourseSearchScope');
import CourseResource = require('../services/CourseResource');
import TestSharingService = require('../services/TestSharingService');
import ICourse = require('../interfaces/ICourse');
import Course = require('../models/Course');

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
        'localStorageService',
        'TestSharingService',
    ];

    private static NOT_FOUND: number = -1;

    constructor(
            private $scope: ICourseSearchScope,
            private $sce,
            private courseResource,
            private localStorageService,
            private testSharingService
            ) {
        this.$scope.vm = this;
        this.$scope.data = testSharingService.getData();
    }

    // if user is not enrolled in course yet, add course events to previewEvents
    // else, don't do anything
    public onMouseOver(course) {
        if (this.testSharingService.isCourseEnrolled(course)) {
            this.testSharingService.clearPreviewCourse();
        } else {
            this.testSharingService.setPreviewCourse(course);
        }
    }

    // TODO: what if course.id != previewCourse.id? will it ever be out of sync?
    public onMouseLeave(course) {
        this.testSharingService.clearPreviewCourse();
    }

    // TODO: what if user removes serach string => no more search results?
    // currently results in preview course being sticky
    public onClick(course) {
        if (this.testSharingService.isCourseEnrolled(course)) {
            this.testSharingService.unenrollCourse(course);
        } else {
            this.testSharingService.enrollCourse(course);
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
