import CalendarViewDataSource = require('./CalendarViewDataSource');
import CalendarViewDelegate = require('./CalendarViewDelegate');
import IView = require('../CoreUI/IView');

interface ICalendarView extends IView
{
    dataSource: CalendarViewDataSource;
    delegate: CalendarViewDelegate;

    refresh(): void;
    selectCalendarEventsWithId(uniqueId: string): void;
    deselectCalendarEventsWithId(uniqueId: string): void;
}
export = ICalendarView;
