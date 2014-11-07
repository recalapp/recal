define(["require", "exports"], function(require, exports) {
    'use strict';

    var CalendarCtrl = (function () {
        function CalendarCtrl($scope, testSharingService, colorResource) {
            var _this = this;
            this.$scope = $scope;
            this.testSharingService = testSharingService;
            this.colorResource = colorResource;
            this.$scope.vm = this;
            this.initConfig();

            this.$scope.data = testSharingService.getData();
            this.$scope.previewEventSource = {
                events: [],
                color: null,
                textColor: null
            };
            this.$scope.enrolledEvents = [];
            this.$scope.eventSources = [
                $scope.previewEventSource, {
                    events: $scope.enrolledEvents
                }];

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

            this.$scope.$watch(function () {
                return _this.$scope.previewEventSource;
            }, function () {
            });
        }
        CalendarCtrl.prototype.updatePreviewCourse = function (newCourse, oldCourse) {
            if (newCourse === oldCourse || (newCourse !== null && oldCourse !== null && newCourse.id === oldCourse.id))
                return;

            if (newCourse == null) {
                this.colorResource.addColor(this.$scope.previewEventSource.colors);
                this.emptyPreviewEvents();
                this.$scope.myCalendar.fullCalendar('refetchEvents');
                return;
            }

            var newEvents = this.getEventsForCourse(newCourse);
            this.emptyPreviewEvents();
            for (var i = 0; i < newEvents.length; i++) {
                this.$scope.previewEventSource.events.push(newEvents[i]);
            }

            this.$scope.previewEventSource.colors = this.colorResource.nextColor();
            this.$scope.previewEventSource.color = this.$scope.previewEventSource.colors.unselected;
            this.$scope.previewEventSource.textColor = this.$scope.previewEventSource.colors.selected;
            this.$scope.myCalendar.fullCalendar('refetchEvents');
        };

        CalendarCtrl.prototype.updateEnrolledCourses = function (newCourses, oldCourses) {
            if (newCourses === oldCourses)
                return;

            this.emptyEnrolledEvents();
            for (var i = 0; i < newCourses.length; i++) {
                var newEvents = this.getEventsForCourse(newCourses[i]);
                for (var j = 0; j < newEvents.length; j++) {
                    this.$scope.enrolledEvents.push(newEvents[j]);
                }
            }

            this.$scope.myCalendar.fullCalendar('refetchEvents');
        };

        CalendarCtrl.prototype.emptyPreviewEvents = function () {
            this.$scope.previewEventSource.events.length = 0;
            this.$scope.previewEventSource.colors = null;
            this.$scope.previewEventSource.color = null;
            this.$scope.previewEventSource.textColor = null;
        };

        CalendarCtrl.prototype.emptyEnrolledEvents = function () {
            this.$scope.enrolledEvents.length = 0;
        };

        CalendarCtrl.prototype.initConfig = function () {
            this.$scope.uiConfig = CalendarCtrl.defaultUiConfig;
        };

        CalendarCtrl.prototype.getEventsForCourse = function (course) {
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
                            location: meeting.location
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

            if (todayOffset == 7) {
                todayOffset = 0;
            }
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
            columnFormat: {
                week: 'dddd'
            },
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
//# sourceMappingURL=CalendarCtrl.js.map
