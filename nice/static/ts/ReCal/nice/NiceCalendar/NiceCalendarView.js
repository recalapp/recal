/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../../../library/Calendar/CalendarView", "fullcalendar"], function(require, exports, CalendarView) {
    var NiceCalendarView = (function (_super) {
        __extends(NiceCalendarView, _super);
        function NiceCalendarView() {
            _super.apply(this, arguments);
            this._niceOptions = {
                defaultView: "agendaWeek",
                slotMinutes: 30,
                firstHour: 8,
                minTime: '08:00:00',
                maxTime: '23:00:00',
                eventDurationEditable: false,
                eventStartEditable: false,
                //eventBackgroundColor: "#74a2ca",
                //eventBorderColor: "#428bca",
                allDayDefault: false,
                ignoreTimezone: true,
                allDaySlot: false,
                slotEventOverlap: true,
                weekends: false
            };
        }
        NiceCalendarView.prototype.refresh = function () {
            try  {
                this._$el.fullCalendar(this._niceOptions);
            } catch (error) {
            }
        };
        return NiceCalendarView;
    })(CalendarView);
});
