define(["require", "exports"], function(require, exports) {
    'use strict';

    var CalendarCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        function CalendarCtrl($scope, localStorageService) {
            this.$scope = $scope;
            this.localStorageService = localStorageService;
            this.$scope.vm = this;
            this.initConfig();
            this.initEventSources();
            this.$scope.events = localStorageService.get('events');
        }
        CalendarCtrl.prototype.initConfig = function () {
            this.$scope.uiConfig = CalendarCtrl.defaultUiConfig;
        };

        CalendarCtrl.prototype.initEventSources = function () {
            this.$scope.events = [
                {
                    title: "test1",
                    start: "2014-10-31T12:30:00",
                    end: "2014-10-31T13:30:00"
                }
            ];

            this.$scope.eventSources = [this.$scope.events];
        };
        CalendarCtrl.defaultUiConfig = {
            height: 800,
            editable: false,
            header: {
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

        CalendarCtrl.$inject = [
            '$scope',
            'localStorageService'
        ];
        return CalendarCtrl;
    })();

    
    return CalendarCtrl;
});
