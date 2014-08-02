import CalendarViewDataSource = require('./CalendarViewDataSource');
import CalendarViewDelegate = require('./CalendarViewDelegate');
import ICalendarView = require('./ICalendarView');

interface ICalendarViewController extends CalendarViewDataSource, CalendarViewDelegate
{
    view: ICalendarView;
}

export = ICalendarViewController;
