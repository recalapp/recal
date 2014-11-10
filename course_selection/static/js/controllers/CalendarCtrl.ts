/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
import TestSharingService = require('../services/TestSharingService');
import IColorPalette = require('../interfaces/IColorPalette');
import ColorResource = require('../services/ColorResource');
import ICourse = require('../interfaces/ICourse');

'use strict';

class CalendarCtrl {
    private static NOT_FOUND: number = -1;

    private static defaultUiConfig = {
        height: 1200,
        contentHeight: 'auto',
        editable: false,
        header:{
            left: '',
            center: '',
            right: ''
        },
        defaultView: "agendaWeek",
        weekends: false,
        firstDay: 1,
        columnFormat: {
            week: 'dddd'
        },
        //slotDuration: '02:00',
        allDaySlot: false,
        minTime: '08:00',
        maxTime: '23:00',
        timeFormat: '',
        slotEventOverlap: false
    };

    private static DAYS = {
        'M' : 1,
        'T': 2,
        'W' : 3,
        'Th': 4,
        'F' : 5
    }
 
    public static $inject = [
        '$scope',
        'TestSharingService',
        'ColorResource'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(
            private $scope,
            private testSharingService,
            private colorResource) 
    {
        this.$scope.vm = this;
        this.initConfig();

        this.$scope.data = testSharingService.getData();

        var previewColor = this.colorResource.getPreviewColor();
        this.$scope.previewEventSource = {
            events: [],
            color: this.colorResource.toPreviewColor(previewColor.light),
            textColor: this.colorResource.toPreviewColor(previewColor.dark)
        };

        this.$scope.eventSources = [
            $scope.previewEventSource, 
        ];

        this.$scope.$watch(
                () => { 
                    return this.$scope.data.previewCourse; 
                },
                (newCourse, oldCourse) => { 
                    return this.updatePreviewCourse(newCourse, oldCourse); 
                },
                true);

        this.$scope.$watch(
                () => { 
                    return this.$scope.data.enrolledCourses
                },
                (newCourses, oldCourses) => { 
                    return this.updateEnrolledCourses(newCourses, oldCourses); 
                },
                true);
    }

    private courseIdxInList(course, list): number {
        for (var i = 0; i < list.length; i++) {
            if (course.id == list[i].id) {
                return i;
            }
        }

        return CalendarCtrl.NOT_FOUND;
    }

    private courseIsInList(course, list): boolean {
        return this.courseIdxInList(course, list) != CalendarCtrl.NOT_FOUND;
    }

    private clearPreviewCourse() {
        this.clearPreviewEvents();
    }

    // set the preview course to course
    private setPreviewCourse(course: ICourse) {
        this.clearPreviewEvents();
        var newEvents = this.getEventsForCourse(course);
        for (var i = 0; i < newEvents.length; i++) {
            this.$scope.previewEventSource.events.push(newEvents[i]);
        }
    }

    public updatePreviewCourse(newCourse, oldCourse) {
        if (newCourse === oldCourse 
                || (newCourse !== null 
                    && oldCourse !== null 
                    && newCourse.id === oldCourse.id))
            return;

        if (newCourse == null) { 
            return this.clearPreviewCourse();
        } else {
            return this.setPreviewCourse(newCourse);
        }
    }

    // TODO: need to remove preview_event_source as we add it
    private addEnrolledCourseEvents(course: ICourse): void {
        var colors = this.colorResource.nextColor();
        var newEvents = this.getEventsForCourse(course);
        this.$scope.eventSources.push({
            course_id: course.id,
            events: newEvents,
            color: this.colorResource.toPreviewColor(colors.light),
            textColor: this.colorResource.toPreviewColor(colors.dark)
        });
    }

    // this relies on the fact that eventSources always start with
    // preview Event Source
    private removeEnrolledCourse(removedIdx: number) {
        this.$scope.eventSources.splice(removedIdx + 1, 1);
    }

    private getRemovedCourseIdx(newCourses: ICourse[], oldCourses: ICourse[]) {
        var removedIdx = CalendarCtrl.NOT_FOUND;
        for (var i = 0; i < newCourses.length; i++) {
            if (newCourses[i].id !== oldCourses[i].id) {
                // they are different, meaning oldCourses[i] got removed
                removedIdx = i;
                break;
            }
        }

        if (removedIdx == CalendarCtrl.NOT_FOUND) {
            removedIdx = newCourses.length;
        }

        return removedIdx;
    }

    public updateEnrolledCourses(newCourses, oldCourses) {
        if (newCourses === oldCourses)
            return;

        // course added
        if (newCourses.length == oldCourses.length + 1) {
            var course = newCourses[newCourses.length - 1];
            this.addEnrolledCourseEvents(course);
        } 
        // course removed
        else if (newCourses.length == oldCourses.length - 1) {
            var removedIdx = this.getRemovedCourseIdx(newCourses, oldCourses);
            return this.removeEnrolledCourse(removedIdx);
        }
    }

    private clearPreviewEvents() {
        this.$scope.previewEventSource.events.length = 0;
    }

    private initConfig() {
        this.$scope.uiConfig = CalendarCtrl.defaultUiConfig;
    }

    private getEventsForCourse(course: ICourse, color?: IColorPalette) {
        if (!course) {
            return [];
        }

        var inputTimeFormat = "hh:mm a";
        var outputTimeFormat = "HH:mm:ss";
        var events = [];

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
                    events.push({
                        title: primaryListing + " " + section.name,
                        start: start,
                        end: end,
                        location: meeting.location,
                        // color: color ? color.light : null,
                        // textColor: color ? color.dark : null
                    });
                }
            }
        }

        return events;
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
        var dayOffset = CalendarCtrl.DAYS[day];
        var diff: number = +(dayOffset - todayOffset);
        var date = moment().add('days', diff).format('YYYY-MM-DD');
        return date;
    }
}

export = CalendarCtrl;
