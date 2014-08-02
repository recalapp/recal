/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../CoreUI/View', "fullcalendar"], function(require, exports, $, View) {
    var CalendarView = (function (_super) {
        __extends(CalendarView, _super);
        function CalendarView($element) {
            var _this = this;
            _super.call(this, $element);
            this._dataSource = null;
            this._delegate = null;
            this._eventSource = {};
            this._defaultOptions = {
                defaultView: "agendaWeek",
                slotMinutes: 30,
                firstHour: 8,
                minTime: 8,
                maxTime: 23,
                eventDurationEditable: false,
                eventStartEditable: false,
                eventBackgroundColor: "#74a2ca",
                eventBorderColor: "#428bca",
                allDayDefault: false,
                ignoreTimezone: true,
                allDaySlot: false,
                slotEventOverlap: true
            };
            this._eventSource['events'] = function () {
                _this.retrieveCalendarEvents();
            };
            this._defaultOptions['eventSources'] = [this._eventSource];
            this._$el.fullCalendar(this._defaultOptions);
        }
        Object.defineProperty(CalendarView.prototype, "dataSource", {
            get: function () {
                return this._dataSource;
            },
            set: function (value) {
                if (value != this._dataSource) {
                    this._dataSource = value;
                    this.refresh();
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CalendarView.prototype, "delegate", {
            get: function () {
                return this._delegate;
            },
            set: function (value) {
                this._delegate = value;
            },
            enumerable: true,
            configurable: true
        });

        CalendarView.prototype.retrieveCalendarEvents = function () {
            var _this = this;
            if (this.dataSource === null || this.dataSource === undefined) {
                return [];
            }
            var calendarEventArray = this.dataSource.calendarViewEvents();
            var results = [];
            $.each(calendarEventArray, function (index, calendarEvent) {
                results.push({
                    uniqueId: calendarEvent.uniqueId,
                    title: calendarEvent.title,
                    start: calendarEvent.start.format(),
                    end: calendarEvent.end.format(),
                    highlighted: _this.dataSource.eventIsHighlighted(calendarEvent),
                    sectionColor: calendarEvent.sectionColor,
                    textColor: calendarEvent.textColor,
                    backgroundColor: calendarEvent.backgroundColor,
                    borderColor: calendarEvent.borderColor
                });
            });
            return results;
        };

        CalendarView.prototype.refresh = function () {
            this._$el.fullCalendar('refetchEvents');
        };
        return CalendarView;
    })(View);
    
    return CalendarView;
});
