import ICalendarViewEvent = require('./ICalendarViewEvent');

interface CalendarViewDataSource
{
    /**
      * The array of calendar view events
      */
    calendarViewEvents(): ICalendarViewEvent[];
    
    /**
      * The height for calendar view. e.g. "250px"
      */
    heightForCalendarView(): string;

    /**
      * Returns true if the event should be highlighted
      */
    eventIsHighlighted(calendarViewEvent: ICalendarViewEvent): boolean;
}
export = CalendarViewDataSource;
