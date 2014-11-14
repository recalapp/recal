/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
import TestSharingService = require('../services/TestSharingService');
import IColorPalette = require('../interfaces/IColorPalette');
import ColorResource = require('../services/ColorResource');
import ICourse = require('../interfaces/ICourse');
import ISection = require('../interfaces/ISection');
import SectionEventSource = require('../models/SectionEventSource');

'use strict';

class CalendarCtrl {
    private static NOT_FOUND: number = -1;
    private static StatusEnum = {
        PREVIEWED: 0,
        HIGHLIGHTED: 1,
        SELECTED: 2
    };

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
        slotEventOverlap: false,
        // eventRender: (event, element) => {
        //     element.find('.fc-title').after("<br/>" + event.location);
        // }
    };

    
 
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

        // collection watch
        this.$scope.$watchCollection(
                () => { 
                    return this.$scope.data.enrolledCourses;
                },
                (newCourses, oldCourses) => { 
                    return this.updateEnrolledCourses(newCourses, oldCourses); 
                });

        // equality watch
        this.$scope.$watch(
                () => {
                    return this.$scope.data.enrolledSections;
                },
                (newSections, oldSections) => {
                    return this.updateEnrolledSections(newSections, oldSections);
                },
                true);
    }

    private initConfig() {
        this.$scope.uiConfig = CalendarCtrl.defaultUiConfig;
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

    // TODO: refactor this;
    // a preview course should be no different from a normal course
    // the only difference is the color
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

    private addAllSectionEventSources(course: ICourse, colors?: IColorPalette): void {
        for (var i = 0; i < course.section_types.length; i++) {
            this.addAllSectionEventSourcesByType(course.id, course.section_types[i]);
        }
    }

    private removeAllSectionEventSources(course: ICourse): void {
        for (var i = this.$scope.eventSources.length - 1; i >= 0; i--) {
            var curr = this.$scope.eventSources[i];
            if (curr.course_id == course.id) {
                this.$scope.eventSources.splice(i, 1);
            }
        }
    }

    private getRemovedCourse(newCourses: ICourse[], oldCourses: ICourse[]): ICourse {
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

        return oldCourses[removedIdx];
    }

    public updateEnrolledCourses(newCourses, oldCourses) {
        if (newCourses === oldCourses)
            return;

        // course added
        if (newCourses.length == oldCourses.length + 1) {
            var colors = this.colorResource.nextColor();
            var course = newCourses[newCourses.length - 1];
            this.addAllSectionEventSources(course, colors);
        } 
        // course removed
        else if (newCourses.length == oldCourses.length - 1) {
            var removedCourse = this.getRemovedCourse(newCourses, oldCourses);
            return this.removeAllSectionEventSources(removedCourse);
        }
    }

    private clearPreviewEvents() {
        this.$scope.previewEventSource.events.length = 0;
    }

    private getEventsForCourse(course: ICourse, color?: IColorPalette) {
        if (!course) {
            return [];
        }

        var inputTimeFormat = "hh:mm a";
        var outputTimeFormat = "HH:mm:ss";
        var events = [];

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
                        title: course.primary_listing + " " + section.name,
                        start: start,
                        end: end,
                        location: meeting.location,
                        section_id: section.id
                        // color: color ? color.light : null,
                        // textColor: color ? color.dark : null
                    });
                }
            }
        }

        return events;
    }

    // TODO: refactor this
    public updateEnrolledSections(newSections, oldSections): void {
        if (newSections == oldSections) {
            return;
        }

        // return directly if a course has been added or removed
        if (Object.keys(newSections).length != Object.keys(oldSections).length) {
            return;
        }

        for (var course_id in newSections) {
            // hack to compare jsons, replies on the fact that the order of
            // fields stay the same
            if (JSON.stringify(newSections[course_id]) != JSON.stringify(oldSections[course_id])) {
                var old = oldSections[course_id];
                var curr = newSections[course_id];
                for (var section_type in curr) {
                    if (curr[section_type] == old[section_type]) {
                        continue;
                    }

                    console.log('section type: ' + section_type + ' has changed in course '
                            + course_id);

                    // TODO: what if old[section_type] == null?
                    // SHOULD REMOVE ALL
                    this.removeEventSourceByType(course_id, section_type);
                    // we want to render all events associated with this section_type
                    if (curr[section_type] == null) {
                        this.addAllSectionEventSourcesByType(course_id, section_type);
                    }
                    // we want to the events associated with the old section_id,
                    // and add the new ones
                    else {
                        this.addEventSourceById(course_id, curr[section_type], CalendarCtrl.StatusEnum.SELECTED);
                    }
                }
            }
        }
    }

    /**
     * Add an eventSource for all events in the section with
     * id = section_id,
     * course_id = course_id
     */
    private addEventSourceById(course_id: number, section_id: number, status: number): void {
        var course = this.testSharingService.getCourseById(course_id);
        var section = course.getSectionById(section_id);
        var sectionEvents = this.getSectionEvents(section, course);
        this.$scope.eventSources.push({
            events: sectionEvents,
            course_id: course_id,
            section_id: section_id,
            section_type: section.section_type
        });
    }

    /**
     * removes the eventSource with
     * section_id = section_id
     * course_id = course_id
     */
    private removeEventSourceByType(course_id: number, section_type: string): void {
        var sections = this.testSharingService.getCourseById(course_id).sections;
        // i = 1 --> skip previewEventSource
        for (var i = this.$scope.eventSources.length - 1; i >= 1; i--) {
            if (this.$scope.eventSources[i].course_id == course_id
                    && this.$scope.eventSources[i].section_type == section_type) {
                this.$scope.eventSources.splice(i, 1);
            }
        }
    }

    /**
     * add event sources for each section with section_type = section_type,
     * course_id = course_id
     */
    private addAllSectionEventSourcesByType(course_id: number, section_type: string): void {
        var sections = this.testSharingService.getCourseById(course_id).sections;
        for (var i = 0; i < sections.length; i++) {
            var curr = sections[i];
            if (curr.section_type == section_type)
                this.addEventSourceById(course_id, curr.id, CalendarCtrl.StatusEnum.PREVIEWED);
        }
    }

    /**
     * create events for each meeting in a given section
     */
    private getSectionEvents(section: ISection, course: ICourse): Array<any> {
        var inputTimeFormat = "hh:mm a";
        var outputTimeFormat = "HH:mm:ss";
        var events = [];
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
                    title: course.primary_listing + " " + section.name,
                    start: start,
                    end: end,
                    location: meeting.location,
                });
            }
        }

        return events;
    }

    /**
     * gets the date of the day in the current week
     */
    private getAgendaDate(day: string): string {
        var todayOffset = moment().isoWeekday();
        var dayOffset = SectionEventSource.DAYS[day];
        var diff: number = +(dayOffset - todayOffset);
        var date = moment().add('days', diff).format('YYYY-MM-DD');
        return date;
    }
    
}

export = CalendarCtrl;
