define(["require", "exports"], function(require, exports) {
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

            //this.initEventSources();
            this.$scope.data = testSharingService.getData();
            this.$scope.previewEventSource = {
                events: [],
                color: null,
                textColor: null
            };

            // this.$scope.enrolledEventSource = {
            //     events: [],
            // };
            this.$scope.eventSources = [
                $scope.previewEventSource
            ];

            this.$scope.$watch(function () {
                return _this.$scope.data.previewCourse;
            }, function (newCourse, oldCourse) {
                return _this.updatePreviewCourse(newCourse, oldCourse);
            }, true);

            this.$scope.$watch(function () {
                return _this.$scope.data.enrolledCourses;
            }, function (newCourses, oldCourses) {
                return _this.updateEnrolledCourses(newCourses, oldCourses);
            }, true);
        }
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
            // let other courses use this color
            if (this.$scope.previewEventSource.colors) {
                this.colorResource.addColor(this.$scope.previewEventSource.colors);
            }

            this.clearPreviewEvents();
        };

        // set the preview course to course
        CalendarCtrl.prototype.setPreviewCourse = function (course) {
            this.clearPreviewEvents();
            var newEvents = this.getEventsForCourse(course);
            for (var i = 0; i < newEvents.length; i++) {
                this.$scope.previewEventSource.events.push(newEvents[i]);
            }

            this.$scope.previewEventSource.colors = this.colorResource.nextColor();
            this.$scope.previewEventSource.color = this.$scope.previewEventSource.colors.unselected;
            this.$scope.previewEventSource.textColor = this.$scope.previewEventSource.colors.selected;
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

        CalendarCtrl.prototype.addEnrolledCourseEvents = function (course) {
            var colors = this.colorResource.nextColor();
            var newEvents = this.getEventsForCourse(course);
            this.$scope.eventSources.push({
                course_id: course.id,
                events: newEvents,
                color: colors.unselected,
                textColor: colors.selected
            });
        };

        // TODO: optimize for better performance
        CalendarCtrl.prototype.updateEnrolledCourses = function (newCourses, oldCourses) {
            if (newCourses === oldCourses)
                return;

            // course added
            if (newCourses.length == oldCourses.length + 1) {
                var course = newCourses[newCourses.length - 1];
                return this.addEnrolledCourseEvents(course);
            } else if (newCourses.length == oldCourses.length - 1) {
                // course removed
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

                this.$scope.eventSources.splice(removedIdx + 1, 1);
                return;
            }
        };

        CalendarCtrl.prototype.clearPreviewEvents = function () {
            this.$scope.previewEventSource.events.length = 0;
            this.$scope.previewEventSource.colors = null;
            this.$scope.previewEventSource.color = null;
            this.$scope.previewEventSource.textColor = null;
        };

        CalendarCtrl.prototype.initConfig = function () {
            this.$scope.uiConfig = CalendarCtrl.defaultUiConfig;
        };

        CalendarCtrl.prototype.getEventsForCourse = function (course, color) {
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
                            color: color ? color.unselected : null,
                            textColor: color ? color.selected : null
                        });
                    }
                }
            }

            return events;
        };

        CalendarCtrl.prototype.getPrimaryCourseListing = function (course) {
            for (var i = 0; i < course.course_listings.length; i++) {
                var curr = course.course_listings[i];
                if (curr.is_primary) {
                    return curr.dept + curr.number;
                }
            }

            return "";
        };

        CalendarCtrl.prototype.getAgendaDate = function (day) {
            var todayOffset = moment().isoWeekday();

            // set todayOffset to 0 if today is a Sunday
            // TODO: set the start of a week to Sunday in FullCalendar
            // to get rid of this line
            // if (todayOffset == 7) {
            //     todayOffset = 0;
            // }
            var dayOffset = CalendarCtrl.DAYS[day];
            var diff = +(dayOffset - todayOffset);
            var date = moment().add('days', diff).format('YYYY-MM-DD');
            return date;
        };

        CalendarCtrl.prototype.initEventSources = function () {
            this.$scope.previewEvents = [
                {
                    title: "test1",
                    start: "2014-11-03T12:30:00",
                    end: "2014-11-03T13:30:00"
                }
            ];

            this.$scope.eventSources = [this.$scope.previewEvents];
        };

        CalendarCtrl.prototype.addEvent = function () {
            this.$scope.previewEvents.push([{
                    title: "test1",
                    start: "2014-11-04T12:30:00",
                    end: "2014-11-04T13:30:00"
                }]);
        };
        CalendarCtrl.NOT_FOUND = -1;

        CalendarCtrl.defaultUiConfig = {
            height: 1000,
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
            timeFormat: ''
        };

        CalendarCtrl.DAYS = {
            'M': 1,
            'T': 2,
            'W': 3,
            'Th': 4,
            'F': 5
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
