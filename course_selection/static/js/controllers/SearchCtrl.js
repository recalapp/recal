/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports"], function(require, exports) {
    'use strict';

    var SearchCtrl = (function () {
        function SearchCtrl($scope, courseResource, localStorageService) {
            this.$scope = $scope;
            this.courseResource = courseResource;
            this.localStorageService = localStorageService;
            this.$scope.vm = this;
            this.loadCourses();
            // watching for events/changes in scope, which are caused by view/user input
            // if you subscribe to scope or event with lifetime longer than this controller, make sure you unsubscribe.
            // $scope.$watch('todos', () => this.onTodos(), true);
            // $scope.$watch('location.path()', path => this.onPath(path))
            // if ($location.path() === '') $location.path('/');
            // $scope.location = $location;
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

        SearchCtrl.prototype.onMouseOver = function (course) {
            var eventTimesAndLocations = this.getEventTimesAndLocations(course);
            this.localStorageService.set('events', eventTimesAndLocations);
        };

        SearchCtrl.prototype.getEventTimesAndLocations = function (course) {
            var eventTimesAndLocations = [];
            for (var i = 0; i < course.sections.length; i++) {
                var section = course.sections[i];
                for (var j = 0; j < section.meetings.length; j++) {
                    var meeting = section.meetings[j];

                    // remove last element of the result of split, which is
                    // empty string due to the format of the input
                    var days = meeting.days.split(' ').splice(-1, 1);
                    for (var k = 0; k < days.length; k++) {
                        var day = days[k];
                        var date = this.getAgendaDate(day);
                        var start = date + ' ' + meeting.start_time;
                        var end = date + ' ' + meeting.end_time;
                        eventTimesAndLocations.push({
                            start: start,
                            end: end,
                            location: meeting.location
                        });
                    }
                }
            }

            return eventTimesAndLocations;
        };

        SearchCtrl.prototype.getAgendaDate = function (day) {
            var todayOffset = moment().isoWeekday();
            var dayOffset = SearchCtrl.DAYS[day];
            var diff = +(dayOffset - todayOffset);
            var date = moment().subtract('days', diff).format('YYYY-MM-DD');
            return date;
        };
        SearchCtrl.$inject = [
            '$scope',
            'CourseResource',
            'localStorageService'
        ];

        SearchCtrl.DAYS = {
            'M': 0,
            'Tu': 1,
            'W': 2,
            "Th": 3,
            'F': 4
        };
        return SearchCtrl;
    })();

    
    return SearchCtrl;
});
