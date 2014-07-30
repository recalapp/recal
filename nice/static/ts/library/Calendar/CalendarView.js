/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../CoreUI/View', "fullcalendar"], function(require, exports, View) {
    var CalendarView = (function (_super) {
        __extends(CalendarView, _super);
        function CalendarView() {
            _super.apply(this, arguments);
            this._dataSource = null;
            this._delegate = null;
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

        CalendarView.prototype.refresh = function () {
        };
        CalendarView._eventSource = {
            events: []
        };
        CalendarView._defaultOptions = {
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
            eventSources: [CalendarView._eventSource],
            ignoreTimezone: true,
            allDaySlot: false,
            slotEventOverlap: true
        };
        return CalendarView;
    })(View);
    
    return CalendarView;
});
