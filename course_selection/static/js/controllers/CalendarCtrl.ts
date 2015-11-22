/// <reference path='../../ts/typings/tsd.d.ts' />
import IColorPalette = require('../interfaces/IColorPalette');
import ICourse = require('../interfaces/ICourse');
import ISection = require('../interfaces/ISection');
import Semester = require('../models/Semester');
import CourseEventSources = require('../models/CourseEventSources');
import IEventSources = require('../interfaces/IEventSources');
import CompositeEventSources = require('../models/CompositeEventSources');
import IScheduleManager = require('../interfaces/IScheduleManager');
import Utils = require('../Utils');

'use strict';

class CalendarCtrl {
    private static NOT_FOUND: number = -1;
    private static StatusEnum = {
        PREVIEWED: 0,
        HIGHLIGHTED: 1,
        SELECTED: 2
    };

    private static defaultUiConfig = {
        height: 'auto',
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

    private static defaultTooltipConfig = {
        content: {
            text: "",
        },
        position: {
            target: 'mouse',
            adjust: {
                x: 10
            }
        },
        show: {
            solo: true
        },
        hide: {
            event: 'click mouseleave'
        },
        style: {
            classes: "qtip-bootstrap qtip-recal",
            tip: false
        }
    };

    private compositeEventSources: CompositeEventSources;
    private scheduleManager: IScheduleManager;

    // TODO: hack for watches not updating on first run
    private courseWatchInitRun: boolean;
    private sectionWatchInitRun: boolean;
    private calendarWatchInitRun: boolean;

    public static $inject = [
        '$scope',
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private $scope)
    {
        this.courseWatchInitRun = true;
        this.sectionWatchInitRun = true;
        this.calendarWatchInitRun = true;

        this.scheduleManager = (<any>this.$scope.$parent).schedule.scheduleManager;
        this.$scope.data = this.scheduleManager.getData();

        var semesterID = Utils.idxInList(
            this.$scope.semester, this.$scope.semesters, Semester.comp);
        var semesterDiv =
            $("#semesterContainer .tab-content").eq(0).children().eq(semesterID);
        var calendarID =
            Utils.idxInList(this.$scope.schedule, this.$scope.schedules);

        this.$scope.myCalendar = $(semesterDiv).find(".calendar").eq(calendarID);

        // calendar event sources dat
        this.compositeEventSources = new CompositeEventSources();
        this.$scope.eventSources = this.compositeEventSources.getEventSources();

        // watch for initializing visible schedule
        this.$scope.$watch(
            () => {
                return this.$scope.semester;
            },
            (newValue, oldValue) => {
                if (newValue == oldValue) {
                    return;
                }

                setTimeout(this.$scope.myCalendar.fullCalendar('render'), 2000);
            }, true);
        this.$scope.$watch(
                () => {
                    return this.$scope.selectedSchedule;
                },
                (newValue, oldValue) => {
                    if (newValue == oldValue) {
                        return;
                    }

                    setTimeout(this.$scope.myCalendar.fullCalendar('render'), 2000);
                }, true);

        // only initialize config if this schedule is visible
        this.$scope.$watch(
                () => {
                    return this._isVisible();
                },
                (newValue, oldValue) => {
                    if(newValue) {
                        if (this.calendarWatchInitRun) {
                            this.calendarWatchInitRun = false;
                        } else {
                            this.$scope.myCalendar.fullCalendar('destroy');
                        }

                        this.initConfig();
                    }
                });

        this.$scope.$watch(
                () => {
                    return this.$scope.data.previewCourse;
                },
                (newCourse, oldCourse) => {
                    return this.updatePreviewCourse(newCourse, oldCourse);
                },
                true);

        // use watchCollection to only watch for addition or removal in the array
        this.$scope.$watchCollection(
                () => {
                    return this.$scope.data.enrolledCourses;
                },
                (newCourses, oldCourses) => {
                    return this.updateEnrolledCourses(newCourses, oldCourses);
                });

        // equality watch for every property
        this.$scope.$watch(
                () => {
                    return this.$scope.data.enrolledSections;
                },
                (newSections, oldSections) => {
                    return this.updateEnrolledSections(newSections, oldSections);
                },
                true);

        // watch for calendar to refetch events
        this.$scope.$watch(
                () => {
                    return this.$scope.eventSources;
                },
                (newEventSources, oldEventSources) => {
                    if (this._isVisible()) {
                        this.$scope.myCalendar.fullCalendar('destroy');
                        this.initConfig();
                    }
               },
               true);
    }

    private _isVisible() {
        return this.$scope.myCalendar && this.$scope.myCalendar.is(":visible");
    }

    private initConfig() {
        this.$scope.uiConfig = CalendarCtrl.defaultUiConfig;
        this.$scope.uiConfig.eventClick = (calEvent, jsEvent, view) => {
            this.onEventClick(calEvent, jsEvent, view);
            this.$scope.$apply();
        };

        this.$scope.uiConfig.eventRender = (event, element) => {
            var locationTag = '<div class="fc-location">' + event.location + '</div>';
            element.find(".fc-content").append(locationTag);

            // set tooltip content
            var tooltipConfig = angular.copy(CalendarCtrl.defaultTooltipConfig);
            tooltipConfig.content.text = "enrollments: " + event.enrollment;
            element.qtip(tooltipConfig);
        };

        var options = this.$scope.uiConfig;
        angular.extend(options, {
            eventSources: this.$scope.eventSources
        });

        this.$scope.myCalendar.fullCalendar(options);
    }


    ///////////////////////////////////////////////////////////////////
    // Course Management
    // ////////////////////////////////////////////////////////////////

    private addCourse(course: ICourse, isPreview: boolean) {
        var courseEventSources = new CourseEventSources(course, course.colors, isPreview);
        this.compositeEventSources.addEventSources(courseEventSources);
    }

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
        // TODO: hack for first run not updating properly
        // without this line, if oldCourses start with a previous courses,
        // it will not get updated
        if (this.courseWatchInitRun && newCourses.length > 0) {
            this.courseWatchInitRun = false;
            for (var i = 0; i < newCourses.length; i++) {
                this.addCourse(newCourses[i], false);
            }

            return;
        }

        if (newCourses === oldCourses)
            return;

        // course added
        if (newCourses.length == oldCourses.length + 1) {
            var course = newCourses[newCourses.length - 1];
            this.addCourse(course, false);
        }
        // course removed
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
        // check if this is the first run && newSections is not empty
        if (this.sectionWatchInitRun) {
            if (Object.getOwnPropertyNames(newSections).length == 0) {
                return;
            }

            this.sectionWatchInitRun = false;
            angular.forEach(newSections, (enrollments, courseId) => {
                // enrollments = { section_type: section_id / null }
                angular.forEach(enrollments, (enrolledSectionId, sectionType) => {
                    if (enrolledSectionId == null) {
                        this.compositeEventSources.previewAllCourseSection(courseId, sectionType);
                    }
                    else {
                        this.compositeEventSources.enrollInCourseSection(courseId, sectionType, enrolledSectionId);
                    }
                });
            });

            return;
        }


        if (newSections == oldSections) {
            return;
        }

        // return directly if a course has been removed
        // if added, still need to check if any sections are enrolled
        // due to being the only possible section of that type
        if (Object.keys(newSections).length < Object.keys(oldSections).length) {
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
        if (this.scheduleManager.isSectionEnrolled(section)) {
            this.scheduleManager.unenrollSection(section);
        } else {
            this.scheduleManager.enrollSection(section);
        }
    }
}

export = CalendarCtrl;
