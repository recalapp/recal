import TestSharingService = require('../services/TestSharingService');
import ICourse = require('../interfaces/ICourse');

'use strict';

class CalendarCtrl {
    private static defaultUiConfig = {
        height: 1000,
        editable: false,
        header:{
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

    public static $inject = [
        '$scope',
        'localStorageService',
        'TestSharingService'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(
            private $scope,
            private localStorageService,
            private testSharingService) 
    {
        this.$scope.vm = this;
        this.initConfig();
        //this.initEventSources();
        this.$scope.previewEvents = [];
        this.$scope.eventSources = [$scope.previewEvents];

        this.$scope.$watch(
                () => { 
                    return this.testSharingService.getPreviewEvents(); 
                },
                (newData, oldData) => { 
                    return this.updatePreviewCourses(newData, oldData); 
                },
                true);
    }

    public updatePreviewCourses(newData, oldData) {
        if (newData === oldData // initialization
                || newData.courseId === oldData.courseId)
                
               // (oldEvents[0] && // preview events don't have meetings
               //     newEvents[0] && // new events don't have meetings
               //     newEvents[0].title == oldEvents[0].title))
            return;

        var newEvents = newData.eventTimesAndLocations;
        this.emptyPreviewEvents();
        for (var i = 0; i < newEvents.length; i++) {
            this.$scope.previewEvents.push(newEvents[i]);
        }

        this.$scope.myCalendar.fullCalendar('refetchEvents');
    }

    private emptyPreviewEvents() {
        this.$scope.previewEvents.length = 0;
    }

    private initConfig() {
        this.$scope.uiConfig = CalendarCtrl.defaultUiConfig;
    }

    private removeEvent(index: number) {
    }

    private initEventSources() {
        this.$scope.previewEvents = [
        {
            title: "test1",
            start: "2014-11-03T12:30:00",
            end: "2014-11-03T13:30:00"
        }
        ];

        this.$scope.eventSources = [this.$scope.previewEvents];
    }

    public addEvent() {
        this.$scope.previewEvents.push(
                [{
                    title: "test1",
                    start: "2014-11-04T12:30:00",
                    end: "2014-11-04T13:30:00"
                }]
                );
    }
}

export = CalendarCtrl;
