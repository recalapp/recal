import CalendarViewDataSource = require('./CalendarViewDataSource');
import CalendarViewDelegate = require('./CalendarViewDelegate');
import CoreUI = require('../CoreUI/CoreUI');
import DateTime = require('../DateTime/DateTime');

import IView = CoreUI.IView;
import IViewController = CoreUI.IViewController;

export interface ICalendarView extends IView
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

export interface ICalendarViewController extends IViewController, CalendarViewDataSource, CalendarViewDelegate
{
    view: ICalendarView;
}

export interface ICalendarViewEvent
{
    uniqueId: string;
    title: string;
    start: DateTime;
    end: DateTime;

    // selection state
    selected: boolean;
    // physical appearance
    highlighted: boolean;
                 
    sectionColor: string;
    textColor: string;
    backgroundColor: string;
    borderColor: string;
}
