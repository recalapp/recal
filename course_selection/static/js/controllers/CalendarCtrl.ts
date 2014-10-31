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
        this.initEventSources();
        this.$scope.events = localStorageService.get('events');
    }

    private initConfig() {
        this.$scope.uiConfig = CalendarCtrl.defaultUiConfig;
    }

    private initEventSources() {
        this.$scope.events = [
        {
            title: "test1",
            start: "2014-10-31T12:30:00",
            end: "2014-10-31T13:30:00"
        }
        ];

        this.$scope.eventSources = [this.$scope.events];
    }
}

export = CalendarCtrl;
