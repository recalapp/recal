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
            this.clearPreviewEvents();
        };

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

        CalendarCtrl.prototype.addEnrolledCourseEvents = function (course) {
            var colors = this.colorResource.nextColor();
            var newEvents = this.getEventsForCourse(course);
            this.$scope.eventSources.push({
                course_id: course.id,
                events: newEvents,
                color: this.colorResource.toPreviewColor(colors.light),
                textColor: this.colorResource.toPreviewColor(colors.dark)
            });
        };

        CalendarCtrl.prototype.removeEnrolledCourse = function (removedIdx) {
            this.$scope.eventSources.splice(removedIdx + 1, 1);
        };

        CalendarCtrl.prototype.getRemovedCourseIdx = function (newCourses, oldCourses) {
            var removedIdx = CalendarCtrl.NOT_FOUND;
            for (var i = 0; i < newCourses.length; i++) {
                if (newCourses[i].id !== oldCourses[i].id) {
                    removedIdx = i;
                    break;
                }
            }

            if (removedIdx == CalendarCtrl.NOT_FOUND) {
                removedIdx = newCourses.length;
            }

            return removedIdx;
        };

        CalendarCtrl.prototype.updateEnrolledCourses = function (newCourses, oldCourses) {
            if (newCourses === oldCourses)
                return;

            if (newCourses.length == oldCourses.length + 1) {
                var course = newCourses[newCourses.length - 1];
                this.addEnrolledCourseEvents(course);
            } else if (newCourses.length == oldCourses.length - 1) {
                var removedIdx = this.getRemovedCourseIdx(newCourses, oldCourses);
                return this.removeEnrolledCourse(removedIdx);
            }
        };

        CalendarCtrl.prototype.clearPreviewEvents = function () {
            this.$scope.previewEventSource.events.length = 0;
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
            var dayOffset = CalendarCtrl.DAYS[day];
            var diff = +(dayOffset - todayOffset);
            var date = moment().add('days', diff).format('YYYY-MM-DD');
            return date;
        };
        CalendarCtrl.NOT_FOUND = -1;

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
            allDaySlot: false,
            minTime: '08:00',
            maxTime: '23:00',
            timeFormat: '',
            slotEventOverlap: false
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
