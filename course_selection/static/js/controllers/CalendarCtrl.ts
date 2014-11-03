import niceServices = require('../services/CourseResource');

'use strict';

class CalendarCtrl {
    private static defaultUiConfig = {
        height: 800,
        editable: false,
        header:{
            left: '',
            center: '',
            right: ''
        },
        defaultView: "agendaWeek",
        weekends: false,
        columnFormat: {
            week: 'dddd M/D'
        },
        allDaySlot: false,
        minTime: '08:00',
        maxTime: '23:00'
    };

    public static $inject = [
        '$scope',
        'localStorageService'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(
            private $scope,
            private localStorageService) 
    {
        this.$scope.vm = this;
        this.initConfig();
        //this.initEventSources();
        this.$scope.previewEvents = [];
        this.$scope.eventSources = [$scope.previewEvents];

        this.$scope.$watch(() => {
            return localStorageService.get('events');
        },
        (newEvents, oldEvents) => {
            if (newEvents[0].title != oldEvents[0].title) {
                console.log("oldEvents title: " + oldEvents[0].title);
                console.log("newEvents title: " + newEvents[0].title);
                this.emptyPreviewEvents();
                for (var i = 0; i < newEvents.length; i++) {
                    this.$scope.previewEvents.push(newEvents[i]);
                }

                this.$scope.myCalendar.fullCalendar('refetchEvents');
                //this.debugEventSources();
            }
        }, true);
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

    public debugEventSources() {
        for (var i = 0; i < this.$scope.eventSources[0].length; i++) {
            console.log(i + ": " + this.$scope.eventSources[0][i]);
        }
    }
}

export = CalendarCtrl;
