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
            week: 'dddd'
        },
        allDaySlot: false,
        minTime: '08:00',
        maxTime: '23:00'
    };

    public static $inject = [
        '$scope'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private $scope) 
    {
        this.$scope.vm = this;
        this.initConfig();
        this.initEventSources();
    }

    private initConfig() {
        this.$scope.uiConfig = CalendarCtrl.defaultUiConfig;
    }

    private initEventSources() {
        var today = new Date();
        var d = today.getDate();
        var m = today.getMonth();
        var y = today.getFullYear();

        this.$scope.events = [
        ];

        this.$scope.eventSources = [this.$scope.events];
    }
}

export = CalendarCtrl;
