define(["require", "exports"], function(require, exports) {
    'use strict';

    var CalendarCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        function CalendarCtrl($scope, localStorageService, testSharingService) {
            var _this = this;
            this.$scope = $scope;
            this.localStorageService = localStorageService;
            this.testSharingService = testSharingService;
            this.$scope.vm = this;
            this.initConfig();

            //this.initEventSources();
            this.$scope.data = testSharingService.getData();
            this.$scope.previewEvents = [];
            this.$scope.enrolledEvents = [];
            this.$scope.eventSources = [$scope.previewEvents, $scope.enrolledEvents];

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
        CalendarCtrl.prototype.updatePreviewCourse = function (newCourse, oldCourse) {
            if (newCourse === oldCourse || newCourse.id === oldCourse.id)
                return;

            var newEvents = this.getEventTimesAndLocations(newCourse);
            this.emptyPreviewEvents();
            for (var i = 0; i < newEvents.length; i++) {
                this.$scope.previewEvents.push(newEvents[i]);
            }

            this.$scope.myCalendar.fullCalendar('refetchEvents');
        };

        // TODO: optimize for better performance
        CalendarCtrl.prototype.updateEnrolledCourses = function (newCourses, oldCourses) {
            if (newCourses === oldCourses)
                return;

            this.emptyEnrolledEvents();
            for (var i = 0; i < newCourses.length; i++) {
                var newEvents = this.getEventTimesAndLocations(newCourses[i]);
                for (var j = 0; j < newEvents.length; j++) {
                    this.$scope.enrolledEvents.push(newEvents[j]);
                }
            }

            //this.$scope.myCalendar.fullCalendar('addEventSource', this.$scope.enrolledEvents);
            this.$scope.myCalendar.fullCalendar('refetchEvents');
        };

        CalendarCtrl.prototype.emptyPreviewEvents = function () {
            this.$scope.previewEvents.length = 0;
        };

        CalendarCtrl.prototype.emptyEnrolledEvents = function () {
            this.$scope.enrolledEvents.length = 0;
        };

        CalendarCtrl.prototype.initConfig = function () {
            this.$scope.uiConfig = CalendarCtrl.defaultUiConfig;
        };

        CalendarCtrl.prototype.getEventTimesAndLocations = function (course) {
            var inputTimeFormat = "hh:mm a";
            var outputTimeFormat = "HH:mm:ss";
            var eventTimesAndLocations = [];

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
            //slotDuration: '02:00',
            allDaySlot: false,
            minTime: '08:00',
            maxTime: '23:00'
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
            'localStorageService',
            'TestSharingService'
        ];
        return CalendarCtrl;
    })();

    
    return CalendarCtrl;
});
