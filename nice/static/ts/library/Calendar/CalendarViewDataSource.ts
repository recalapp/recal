import ICalendarViewEvent = require('./ICalendarViewEvent');

interface CalendarViewDataSource
{
    getCalendarViewEvents(): ICalendarViewEvent[];
}
export = CalendarViewDataSource;
