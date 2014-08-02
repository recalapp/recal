/// <reference path="../../typings/tsd.d.ts" />

/// <amd-dependency path="fullcalendar" />
import $ = require('jquery');

import CalendarViewDataSource = require('./CalendarViewDataSource');
import CalendarViewDelegate = require('./CalendarViewDelegate');
import ICalendarView = require('./ICalendarView');
import ICalendarViewEvent = require('./ICalendarViewEvent');
import View = require('../CoreUI/View');

class CalendarView extends View implements ICalendarView
{
    private _dataSource: CalendarViewDataSource = null;
    private _delegate: CalendarViewDelegate = null;
    private _eventSource = {
    };
    private _defaultOptions = {
        defaultView: "agendaWeek",
        slotMinutes: 30,
        firstHour: 8,
        minTime: 8,
        maxTime: 23,
        eventDurationEditable: false,
        eventStartEditable: false,
        eventBackgroundColor: "#74a2ca",
        eventBorderColor: "#428bca",
        allDayDefault: false,
        ignoreTimezone: true,
        allDaySlot: false,
        slotEventOverlap: true,
    };

    get dataSource(): CalendarViewDataSource
    {
        return this._dataSource;
    }
    set dataSource(value: CalendarViewDataSource)
    {
        if (value != this._dataSource)
        {
            this._dataSource = value;
            this.refresh();
        }
    }

    get delegate(): CalendarViewDelegate
    {
        return this._delegate;
    }
    set delegate(value: CalendarViewDelegate)
    {
        this._delegate = value;
    }

    constructor($element: JQuery)
    {
        super($element);
        this._eventSource['events'] = ()=>
        {
            this.retrieveCalendarEvents();
        }
        this._defaultOptions['eventSources'] = [this._eventSource];
        this._$el.fullCalendar(this._defaultOptions);
    }

    private retrieveCalendarEvents(): any[]
    {
        if (this.dataSource === null || this.dataSource === undefined)
        {
            return [];
        }
        var calendarEventArray: ICalendarViewEvent[] = this.dataSource.calendarViewEvents();
        var results = [];
        $.each(calendarEventArray, (index: number, calendarEvent: ICalendarViewEvent)=>{
            results.push({
                uniqueId: calendarEvent.uniqueId,
                title: calendarEvent.title,
                start: calendarEvent.start.format(),
                end: calendarEvent.end.format(),
                highlighted: this.dataSource.eventIsHighlighted(calendarEvent),
                sectionColor: calendarEvent.sectionColor,
                textColor: calendarEvent.textColor,
                backgroundColor: calendarEvent.backgroundColor,
                borderColor: calendarEvent.borderColor,
            });
        });
        return results;
    }

    public refresh(): void
    {
        this._$el.fullCalendar('refetchEvents');
    }
}
export = CalendarView;
