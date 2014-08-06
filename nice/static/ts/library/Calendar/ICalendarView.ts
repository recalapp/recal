import CalendarViewDataSource = require('./CalendarViewDataSource');
import CalendarViewDelegate = require('./CalendarViewDelegate');
import ICalendarViewEvent = require('./ICalendarViewEvent');
import IView = require('../CoreUI/IView');

interface ICalendarView extends IView
{
    dataSource: CalendarViewDataSource;
    delegate: CalendarViewDelegate;

    refresh(): void;
    render(): void;
    selectCalendarEventsWithId(uniqueId: string): void;
    deselectCalendarEventsWithId(uniqueId: string): void;

    getCalendarViewEventWithId(uniqueId: string): ICalendarViewEvent;
    updateCalendarViewEvent(calendarViewEvent: ICalendarViewEvent): void;
    selectedCalendarViewEvents(): ICalendarViewEvent[];
}
export = ICalendarView;
