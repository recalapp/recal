/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports"], function(require, exports) {
    'use strict';

    var SearchCtrl = (function () {
        function SearchCtrl($scope, courseResource, localStorageService, testSharingService) {
            this.$scope = $scope;
            this.courseResource = courseResource;
            this.localStorageService = localStorageService;
            this.testSharingService = testSharingService;
            this.$scope.vm = this;
            this.loadCourses();
        }
        SearchCtrl.prototype.loadCourses = function () {
            var _this = this;
            this.courseResource.query({}, function (data) {
                return _this.onLoaded(data);
            });
        };

        SearchCtrl.prototype.onLoaded = function (data) {
            this.$scope.courses = data['objects'];
        };

        // if user is not enrolled in course yet, add course events to previewEvents
        // else, TODO: don't do anything
        SearchCtrl.prototype.onMouseOver = function (course) {
            var eventTimesAndLocations = this.getEventTimesAndLocations(course);
            this.testSharingService.setPreviewEvents(eventTimesAndLocations);
        };

        SearchCtrl.prototype.onClick = function (course) {
            var courses = this.testSharingService.getEnrolledCourses();

            // if course is in courses, remove it
            // else add it
            var idx = this.courseIsInList(course, courses);
            if (idx == SearchCtrl.NOT_FOUND) {
                courses.push(course);
            } else {
                courses.splice(idx, 1);
            }

            this.testSharingService.setEnrolledCourses(courses);
        };

        SearchCtrl.prototype.courseIsInList = function (course, list) {
            for (var i = 0; i < list.length; i++) {
                if (course.id == list[i].id) {
                    return i;
                }
            }

            return SearchCtrl.NOT_FOUND;
        };

        SearchCtrl.prototype.getEventTimesAndLocations = function (course) {
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

            return {
                eventTimesAndLocations: eventTimesAndLocations,
                courseId: course.id
            };
        };

        SearchCtrl.prototype.getPrimaryCourseListing = function (course) {
            for (var i = 0; i < course.course_listings.length; i++) {
                var curr = course.course_listings[i];
                if (curr.is_primary) {
                    return curr.dept + curr.number;
                }
            }

            return "";
        };

        SearchCtrl.prototype.getAgendaDate = function (day) {
            var todayOffset = moment().isoWeekday();

            // set todayOffset to 0 if today is a Sunday
            // TODO: set the start of a week to Sunday in FullCalendar
            // to get rid of this line
            if (todayOffset == 7) {
                todayOffset = 0;
            }
            var dayOffset = SearchCtrl.DAYS[day];
            var diff = +(dayOffset - todayOffset);
            var date = moment().add('days', diff).format('YYYY-MM-DD');
            return date;
        };
        SearchCtrl.$inject = [
            '$scope',
            'CourseResource',
            'localStorageService',
            'TestSharingService'
        ];

        SearchCtrl.DAYS = {
            'M': 1,
            'T': 2,
            'W': 3,
            'Th': 4,
            'F': 5
        };

        SearchCtrl.NOT_FOUND = -1;
        return SearchCtrl;
    })();

    
    return SearchCtrl;
});
