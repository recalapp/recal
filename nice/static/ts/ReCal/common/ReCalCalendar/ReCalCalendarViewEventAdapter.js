define(["require", "exports", '../../../library/Calendar/CalendarViewEvent'], function(require, exports, CalendarViewEvent) {
    var ReCalCalendarViewEventAdapter = (function () {
        function ReCalCalendarViewEventAdapter(eventsModel) {
            this._calendarViewEvent = null;
            this._calendarViewEvent = new CalendarViewEvent();
            this.calendarViewEvent.uniqueId = eventsModel.eventId;
            this.calendarViewEvent.title = eventsModel.title;
            this.calendarViewEvent.start = eventsModel.startDate;
            this.calendarViewEvent.end = eventsModel.endDate;
            this.calendarViewEvent.sectionColor = SECTION_COLOR_MAP[eventsModel.sectionId]['color'];
            this.calendarViewEvent.title = eventsModel.title;
            this.calendarViewEvent.title = eventsModel.title;
        }
        Object.defineProperty(ReCalCalendarViewEventAdapter.prototype, "calendarViewEvent", {
            get: function () {
                return this._calendarViewEvent;
            },
            enumerable: true,
            configurable: true
        });
        return ReCalCalendarViewEventAdapter;
    })();

    
    return ReCalCalendarViewEventAdapter;
});
//# sourceMappingURL=ReCalCalendarViewEventAdapter.js.map
