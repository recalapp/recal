import DateTime = require('../DateTime/DateTime');
import ICalendarViewEvent = require('./ICalendarViewEvent');

interface CalendarViewDataSource
{
    /**
      * Returns true if a cell should be deselected
      * when it is selected and clicked on again.
      */
    shouldToggleSelection(): boolean;
    
    /**
      * The array of calendar view events in range
      */
    calendarViewEventsForRange(start: DateTime, end: DateTime): ICalendarViewEvent[];
    
    /**
      * The height for calendar view in pixels
      */
    heightForCalendarView(): number;
}
export = CalendarViewDataSource;
