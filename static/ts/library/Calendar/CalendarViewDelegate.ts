import Calendar = require('./Calendar');

import ICalendarViewEvent = Calendar.ICalendarViewEvent;

interface CalendarViewDelegate
{
    /**
      * Callback for when an event is selected
      */
    didSelectEvent(calendarViewEvent: ICalendarViewEvent): void;

    /**
      * Callback for when an event is deselected
      */
    didDeselectEvent(calendarViewEvent: ICalendarViewEvent): void;
}
export = CalendarViewDelegate;
