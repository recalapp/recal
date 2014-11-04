define(["require", "exports"], function(require, exports) {
    'use strict';

    var CalendarCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        function CalendarCtrl($scope, localStorageService, testSharingService) {
            var _this = this;
            this.$scope = $scope;
            this.localStorageService = localStorageService;
            this.testSharingService = testSharingService;
            this.$scope.vm = this;
            this.initConfig();

            //this.initEventSources();
            this.$scope.previewEvents = [];
            this.$scope.eventSources = [$scope.previewEvents];

            this.$scope.$watch(function () {
                return _this.testSharingService.getPreviewEvents();
            }, function (newEvents, oldEvents) {
                return _this.updatePreviewCourses(newEvents, oldEvents);
            }, true);
        }
        CalendarCtrl.prototype.updatePreviewCourses = function (newEvents, oldEvents) {
            if (newEvents === oldEvents || (oldEvents[0] && newEvents[0] && newEvents[0].title == oldEvents[0].title))
                return;

            console.log("newEvents title: " + newEvents[0].title);
            this.emptyPreviewEvents();
            for (var i = 0; i < newEvents.length; i++) {
                this.$scope.previewEvents.push(newEvents[i]);
            }

            this.$scope.myCalendar.fullCalendar('refetchEvents');
        };

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
        CalendarCtrl.defaultUiConfig = {
            height: 1000,
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
            //slotDuration: '02:00',
            allDaySlot: false,
            minTime: '08:00',
            maxTime: '23:00'
        };

        CalendarCtrl.$inject = [
            '$scope',
            'localStorageService',
            'TestSharingService'
        ];
        return CalendarCtrl;
    })();

    
    return CalendarCtrl;
});
