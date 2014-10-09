/// <reference path="../../../typings/tsd.d.ts" />

/// <amd-dependency path="fullcalendar" />

import CalendarViewDataSource = require('../../../library/Calendar/CalendarViewDataSource');
import CalendarViewDelegate = require('../../../library/Calendar/CalendarViewDelegate');
import CalendarView = require("../../../library/Calendar/CalendarView");

class NiceCalendarView extends CalendarView
{
    private _niceOptions: FullCalendar.Options = {
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

    public refresh(): void
    {
        // must use a try because fullCalendar doesn't handle when the view is not yet on screen
        try {
            this._$el.fullCalendar(this._niceOptions);
        }
        catch(error){
        }
    }
}
