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
        'TestSharingService'
    ];

    private static DAYS = {
        'M' : 1,
        'T': 2,
        'W' : 3,
        'Th': 4,
        'F' : 5
    }

    constructor(
            private $scope: ICourseSearchScope,
            private courseResource,
            private localStorageService,
            private testSharingService
            ) {
        this.$scope.vm = this;
        this.loadCourses();
    }

    private loadCourses() {
        this.courseResource.query({}, (data) => this.onLoaded(data));
    }

    private onLoaded(data) {
        this.$scope.courses = data['objects'];
    }
    
    public onMouseOver(course) {
        var eventTimesAndLocations = this.getEventTimesAndLocations(course);
        this.testSharingService.setPreviewEvents(eventTimesAndLocations);
    }

    private getEventTimesAndLocations(course) {
        var inputTimeFormat = "hh:mm a";
        var outputTimeFormat = "HH:mm:ss";
        var eventTimesAndLocations = [];

        var primaryListing = this.getPrimaryCourseListing(course);
        for (var i = 0; i < course.sections.length; i++) {
            var section = course.sections[i];
            for (var j = 0; j < section.meetings.length; j++) {
                var meeting = section.meetings[j];
                var days = meeting.days.split(' ');
                // ignore last element of the result of split, which is 
                // empty string due to the format of the input
                for (var k = 0; k < days.length - 1; k++) {
                    var day = days[k];
                    var date = this.getAgendaDate(day);
                    var startTime = moment(meeting.start_time, inputTimeFormat).format(outputTimeFormat);
                    var endTime = moment(meeting.end_time, inputTimeFormat).format(outputTimeFormat);
                    var start = date + 'T' + startTime;
                    var end = date + 'T' + endTime;
                    eventTimesAndLocations.push({
                        title: primaryListing + " " + section.name,
                        start: start,
                        end: end,
                        location: meeting.location
                    });
                }
            }
        }

        return eventTimesAndLocations;
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

    private getAgendaDate(day: string): string {
        var todayOffset = moment().isoWeekday();

        // set todayOffset to 0 if today is a Sunday
        // TODO: set the start of a week to Sunday in FullCalendar
        // to get rid of this line
        if (todayOffset == 7) {
            todayOffset = 0;
        }
        var dayOffset = SearchCtrl.DAYS[day];
        var diff: number = +(dayOffset - todayOffset);
        var date = moment().add('days', diff).format('YYYY-MM-DD');
        return date;
    }
}

export = SearchCtrl;
