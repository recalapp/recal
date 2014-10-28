define(["require", "exports"], function(require, exports) {
    'use strict';

    var CalendarCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        function CalendarCtrl($scope) {
            this.$scope = $scope;
            this.$scope.vm = this;
            this.initConfig();
            this.initEventSources();
        }
        CalendarCtrl.prototype.initConfig = function () {
            this.$scope.uiConfig = CalendarCtrl.defaultUiConfig;
        };

        CalendarCtrl.prototype.initEventSources = function () {
            var today = new Date();
            var d = today.getDate();
            var m = today.getMonth();
            var y = today.getFullYear();

            this.$scope.events = [
                { title: 'All Day Event', start: new Date(y, m, 1) },
                { title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2) },
                { id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false },
                { id: 999, title: 'Repeating Event', start: new Date(y, m, d + 4, 16, 0), allDay: false },
                { title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false },
                { title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
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
                week: 'dddd'
            },
            allDaySlot: false,
            minTime: '08:00',
            maxTime: '23:00'
        };

        CalendarCtrl.$inject = [
            '$scope'
        ];
        return CalendarCtrl;
    })();

    
    return CalendarCtrl;
});
