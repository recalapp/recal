define(["require", "exports", '../models/SectionEventSource'], function(require, exports, SectionEventSource) {
    'use strict';

    var CalendarCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        function CalendarCtrl($scope, testSharingService, colorResource) {
            var _this = this;
            this.$scope = $scope;
            this.testSharingService = testSharingService;
            this.colorResource = colorResource;
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
                $scope.previewEventSource
            ];

            this.$scope.$watch(function () {
                return _this.$scope.data.previewCourse;
            }, function (newCourse, oldCourse) {
                return _this.updatePreviewCourse(newCourse, oldCourse);
            }, true);

            // collection watch
            this.$scope.$watchCollection(function () {
                return _this.$scope.data.enrolledCourses;
            }, function (newCourses, oldCourses) {
                return _this.updateEnrolledCourses(newCourses, oldCourses);
            });

            // equality watch
            this.$scope.$watch(function () {
                return _this.$scope.data.enrolledSections;
            }, function (newSections, oldSections) {
                return _this.updateEnrolledSections(newSections, oldSections);
            }, true);
        }
        CalendarCtrl.prototype.initConfig = function () {
            this.$scope.uiConfig = CalendarCtrl.defaultUiConfig;
        };

        CalendarCtrl.prototype.courseIdxInList = function (course, list) {
            for (var i = 0; i < list.length; i++) {
                if (course.id == list[i].id) {
                    return i;
                }
            }

            return CalendarCtrl.NOT_FOUND;
        };

        CalendarCtrl.prototype.courseIsInList = function (course, list) {
            return this.courseIdxInList(course, list) != CalendarCtrl.NOT_FOUND;
        };

        CalendarCtrl.prototype.clearPreviewCourse = function () {
            this.clearPreviewEvents();
        };

        // TODO: refactor this;
        // a preview course should be no different from a normal course
        // the only difference is the color
        // set the preview course to course
        CalendarCtrl.prototype.setPreviewCourse = function (course) {
            this.clearPreviewEvents();
            var newEvents = this.getEventsForCourse(course);
            for (var i = 0; i < newEvents.length; i++) {
                this.$scope.previewEventSource.events.push(newEvents[i]);
            }
        };

        CalendarCtrl.prototype.updatePreviewCourse = function (newCourse, oldCourse) {
            if (newCourse === oldCourse || (newCourse !== null && oldCourse !== null && newCourse.id === oldCourse.id))
                return;

            if (newCourse == null) {
                return this.clearPreviewCourse();
            } else {
                return this.setPreviewCourse(newCourse);
            }
        };

        CalendarCtrl.prototype.addAllSectionEventSources = function (course, colors) {
            for (var i = 0; i < course.section_types.length; i++) {
                this.addAllSectionEventSourcesByType(course.id, course.section_types[i]);
            }
        };

        CalendarCtrl.prototype.removeAllSectionEventSources = function (course) {
            for (var i = this.$scope.eventSources.length - 1; i >= 0; i--) {
                var curr = this.$scope.eventSources[i];
                if (curr.course_id == course.id) {
                    this.$scope.eventSources.splice(i, 1);
                }
            }
        };

        CalendarCtrl.prototype.getRemovedCourse = function (newCourses, oldCourses) {
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
        };

        CalendarCtrl.prototype.updateEnrolledCourses = function (newCourses, oldCourses) {
            if (newCourses === oldCourses)
                return;

            // course added
            if (newCourses.length == oldCourses.length + 1) {
                var colors = this.colorResource.nextColor();
                var course = newCourses[newCourses.length - 1];
                this.addAllSectionEventSources(course, colors);
            } else if (newCourses.length == oldCourses.length - 1) {
                var removedCourse = this.getRemovedCourse(newCourses, oldCourses);
                return this.removeAllSectionEventSources(removedCourse);
            }
        };

        CalendarCtrl.prototype.clearPreviewEvents = function () {
            this.$scope.previewEventSource.events.length = 0;
        };

        CalendarCtrl.prototype.getEventsForCourse = function (course, color) {
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
                        });
                    }
                }
            }

            return events;
        };

        // TODO: refactor this
        CalendarCtrl.prototype.updateEnrolledSections = function (newSections, oldSections) {
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

                        console.log('section type: ' + section_type + ' has changed in course ' + course_id);

                        // TODO: what if old[section_type] == null?
                        // SHOULD REMOVE ALL
                        this.removeEventSourceByType(course_id, section_type);

                        // we want to render all events associated with this section_type
                        if (curr[section_type] == null) {
                            this.addAllSectionEventSourcesByType(course_id, section_type);
                        } else {
                            this.addEventSourceById(course_id, curr[section_type], CalendarCtrl.StatusEnum.SELECTED);
                        }
                    }
                }
            }
        };

        /**
        * Add an eventSource for all events in the section with
        * id = section_id,
        * course_id = course_id
        */
        CalendarCtrl.prototype.addEventSourceById = function (course_id, section_id, status) {
            var course = this.testSharingService.getCourseById(course_id);
            var section = course.getSectionById(section_id);
            var sectionEvents = this.getSectionEvents(section, course);
            this.$scope.eventSources.push({
                events: sectionEvents,
                course_id: course_id,
                section_id: section_id,
                section_type: section.section_type
            });
        };

        /**
        * removes the eventSource with
        * section_id = section_id
        * course_id = course_id
        */
        CalendarCtrl.prototype.removeEventSourceByType = function (course_id, section_type) {
            var sections = this.testSharingService.getCourseById(course_id).sections;

            for (var i = this.$scope.eventSources.length - 1; i >= 1; i--) {
                if (this.$scope.eventSources[i].course_id == course_id && this.$scope.eventSources[i].section_type == section_type) {
                    this.$scope.eventSources.splice(i, 1);
                }
            }
        };

        /**
        * add event sources for each section with section_type = section_type,
        * course_id = course_id
        */
        CalendarCtrl.prototype.addAllSectionEventSourcesByType = function (course_id, section_type) {
            var sections = this.testSharingService.getCourseById(course_id).sections;
            for (var i = 0; i < sections.length; i++) {
                var curr = sections[i];
                if (curr.section_type == section_type)
                    this.addEventSourceById(course_id, curr.id, CalendarCtrl.StatusEnum.PREVIEWED);
            }
        };

        /**
        * create events for each meeting in a given section
        */
        CalendarCtrl.prototype.getSectionEvents = function (section, course) {
            var inputTimeFormat = "hh:mm a";
            var outputTimeFormat = "HH:mm:ss";
            var events = [];
            for (var j = 0; j < section.meetings.length; j++) {
                var meeting = section.meetings[j];
                var days = meeting.days.split(' ');

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
                        location: meeting.location
                    });
                }
            }

            return events;
        };

        /**
        * gets the date of the day in the current week
        */
        CalendarCtrl.prototype.getAgendaDate = function (day) {
            var todayOffset = moment().isoWeekday();
            var dayOffset = SectionEventSource.DAYS[day];
            var diff = +(dayOffset - todayOffset);
            var date = moment().add('days', diff).format('YYYY-MM-DD');
            return date;
        };
        CalendarCtrl.NOT_FOUND = -1;
        CalendarCtrl.StatusEnum = {
            PREVIEWED: 0,
            HIGHLIGHTED: 1,
            SELECTED: 2
        };

        CalendarCtrl.defaultUiConfig = {
            height: 1200,
            contentHeight: 'auto',
            editable: false,
            header: {
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

        CalendarCtrl.$inject = [
            '$scope',
            'TestSharingService',
            'ColorResource'
        ];
        return CalendarCtrl;
    })();

    
    return CalendarCtrl;
});
