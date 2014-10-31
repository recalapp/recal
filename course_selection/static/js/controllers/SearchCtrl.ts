/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ISection = require('../interfaces/ISection');
import ICourseSearchScope = require('../interfaces/ICourseSearchScope');
import CourseResource = require('../services/CourseResource');

'use strict';

class SearchCtrl {
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope',
        'CourseResource',
        'localStorageService'
    ];

    private static DAYS = {
        'M' : 0,
        'Tu': 1,
        'W' : 2,
        "Th": 3,
        'F' : 4
    }

    constructor(
            private $scope: ICourseSearchScope,
            private courseResource,
            private localStorageService
            ) {
        this.$scope.vm = this;
        this.loadCourses();

        // watching for events/changes in scope, which are caused by view/user input
        // if you subscribe to scope or event with lifetime longer than this controller, make sure you unsubscribe.
        // $scope.$watch('todos', () => this.onTodos(), true);
        // $scope.$watch('location.path()', path => this.onPath(path))

        // if ($location.path() === '') $location.path('/');
        // $scope.location = $location;
    }

    private loadCourses() {
        this.courseResource.query({}, (data) => this.onLoaded(data));
    }

    private onLoaded(data) {
        this.$scope.courses = data['objects'];
    }
    
    public onMouseOver(course) {
        var eventTimesAndLocations = this.getEventTimesAndLocations(course);
        this.localStorageService.set('events', eventTimesAndLocations);
    }

    private getEventTimesAndLocations(course) {
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
    }

    private getAgendaDate(day: string): string {
        var todayOffset = moment().isoWeekday();
        var dayOffset = SearchCtrl.DAYS[day];
        var diff: number = +(dayOffset - todayOffset);
        var date = moment().subtract('days', diff).format('YYYY-MM-DD');
        return date;
    }
}

export = SearchCtrl;
