/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
import IColorPalette = require('../interfaces/IColorPalette');
import ICourse = require('../interfaces/ICourse');
import ISection = require('../interfaces/ISection');
import CourseEventSources = require('../models/CourseEventSources');
import IEventSources = require('../interfaces/IEventSources');
import CompositeEventSources = require('../models/CompositeEventSources');
import ICourseManager = require('../interfaces/ICourseManager');
import IColorManager = require('../interfaces/IColorManager');

'use strict';

class CalendarCtrl {
    private static NOT_FOUND: number = -1;
    private static StatusEnum = {
        PREVIEWED: 0,
        HIGHLIGHTED: 1,
        SELECTED: 2
    };

    private static defaultUiConfig = {
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
    };

    private compositeEventSources: CompositeEventSources;
    private courseManager: ICourseManager;
    private colorManager: IColorManager;
    public static $inject = [
        '$scope',
    ];

    // dependencies are injected via AngularJS $injector
    constructor(
            private $scope) 
    {
        this.$scope.vm = this;
        this.initConfig();

        this.courseManager = (<any>this.$scope.$parent).schedule.courseManager;
        this.colorManager = (<any>this.$scope.$parent).schedule.colorManager;
        this.$scope.data = this.courseManager.getData();

        this.compositeEventSources = new CompositeEventSources();
        this.$scope.eventSources = this.compositeEventSources.getEventSources();

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
        this.$scope.uiConfig.eventClick = (calEvent, jsEvent, view) => {
            return this.onEventClick(calEvent, jsEvent, view);
        };
    }


    ///////////////////////////////////////////////////////////////////
    // Course Management
    // ////////////////////////////////////////////////////////////////

    private addCourse(course: ICourse, isPreview: boolean) {
        var myColor = isPreview ? this.colorManager.getPreviewColor() : course.colors;
        var courseEventSources = new CourseEventSources(course, myColor, isPreview);
        this.compositeEventSources.addEventSources(courseEventSources);
    }

    // TODO: fix adding colors after re-init in colorManager
    // what if user adds 8 classes, colorManager re-enables all colors
    // then user removes a course. Then we should again only allow that removed
    // color
    private removeCourse(course: ICourse, isPreview: boolean) {
        this.compositeEventSources.removeEventSources(course.id, isPreview);
    }

    private clearPreviewCourse(course: ICourse) {
        this.removeCourse(course, true);
    }
    
    private setPreviewCourse(course: ICourse) {
        this.addCourse(course, true);
    }

    public updatePreviewCourse(newCourse, oldCourse) {
        if (newCourse === oldCourse 
                || (newCourse !== null 
                    && oldCourse !== null 
                    && newCourse.id === oldCourse.id))
            return;

        if (newCourse == null) { 
            this.clearPreviewCourse(oldCourse);
        } else {
            this.setPreviewCourse(newCourse);
        }

        this.$scope.eventSources = this.compositeEventSources.getEventSources();
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
            var course = newCourses[newCourses.length - 1];
            this.addCourse(course, false);
        } 
        // course removed
        // TODO: re-enable this color for use in colorManager
        else if (newCourses.length == oldCourses.length - 1) {
            var removedCourse = this.getRemovedCourse(newCourses, oldCourses);
            this.removeCourse(removedCourse, false);
        }

        this.$scope.eventSources = this.compositeEventSources.getEventSources();
    }

    ///////////////////////////////////////////////////////
    // Sections
    // ////////////////////////////////////////////////////

    private addAllSectionEventSources(course: ICourse, colors?: IColorPalette): void {
        for (var i = 0; i < course.section_types.length; i++) {
            // this.addAllSectionEventSourcesByType(course.id, course.section_types[i]);
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

    // newSections: updated enrollments
    // {
    // course_id: {
    //  section_type: section_id,
    //  section_type: section_id
    // },
    // course_id: {
    // }
    // }
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
                    if (old != null && curr[section_type] == old[section_type]) {
                        continue;
                    }

                    console.log('section type: ' + section_type + ' has changed in course '
                            + course_id);

                    if (curr[section_type] == null) {
                        this.compositeEventSources.previewAllCourseSection(course_id, section_type);
                    }
                    // we want to the events associated with the old section_id,
                    // and add the new ones
                    else {
                        this.compositeEventSources.enrollInCourseSection(course_id, section_type, curr[section_type]);
                    }
                }
            }
        }

        this.$scope.eventSources = this.compositeEventSources.getEventSources();
    }

    public onEventClick(calEvent, jsEvent, view) {
        var section = calEvent.source;
        if (this.courseManager.isSectionEnrolled(section)) {
            this.courseManager.unenrollSection(section);
        } else {
            this.courseManager.enrollSection(section);
        }
    }
}

export = CalendarCtrl;
