define(["require", "exports"], function(require, exports) {
    'use strict';

    var CalendarCtrl = (function () {
        function CalendarCtrl($scope, localStorageService) {
            var _this = this;
            this.$scope = $scope;
            this.localStorageService = localStorageService;
            this.$scope.vm = this;
            this.initConfig();

            this.$scope.previewEvents = [];
            this.$scope.eventSources = [$scope.previewEvents];

            this.$scope.$watch(function () {
                return localStorageService.get('events');
            }, function (newEvents, oldEvents) {
                if (newEvents[0].title != oldEvents[0].title) {
                    console.log("oldEvents title: " + oldEvents[0].title);
                    console.log("newEvents title: " + newEvents[0].title);
                    _this.emptyPreviewEvents();
                    for (var i = 0; i < newEvents.length; i++) {
                        _this.$scope.previewEvents.push(newEvents[i]);
                    }

                    _this.$scope.myCalendar.fullCalendar('refetchEvents');
                }
            }, true);
        }
        CalendarCtrl.prototype.emptyPreviewEvents = function () {
            this.$scope.previewEvents.length = 0;
        };

        CalendarCtrl.prototype.initConfig = function () {
            this.$scope.uiConfig = CalendarCtrl.defaultUiConfig;
        };

        CalendarCtrl.prototype.removeEvent = function (index) {
        };

        CalendarCtrl.prototype.initEventSources = function () {
            this.$scope.previewEvents = [
                {
                    title: "test1",
                    start: "2014-11-03T12:30:00",
                    end: "2014-11-03T13:30:00"
                }
            ];

            this.$scope.eventSources = [this.$scope.previewEvents];
        };

        CalendarCtrl.prototype.addEvent = function () {
            this.$scope.previewEvents.push([{
                    title: "test1",
                    start: "2014-11-04T12:30:00",
                    end: "2014-11-04T13:30:00"
                }]);
        };

        CalendarCtrl.prototype.debugEventSources = function () {
            for (var i = 0; i < this.$scope.eventSources[0].length; i++) {
                console.log(i + ": " + this.$scope.eventSources[0][i]);
            }
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
            '$scope',
            'localStorageService'
        ];
        return CalendarCtrl;
    })();

    
    return CalendarCtrl;
});
//# sourceMappingURL=CalendarCtrl.js.map
