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

            this.$scope.events = [];

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
