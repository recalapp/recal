/// <reference path="../../typings/tsd.d.ts" />

/// <amd-dependency path="fullcalendar" />
import $ = require('jquery');

import CalendarViewDataSource = require('./CalendarViewDataSource');
import CalendarViewDelegate = require('./CalendarViewDelegate');
import View = require('../CoreUI/View');

class CalendarView extends View
{
    private _dataSource: CalendarViewDataSource = null;
    private _delegate: CalendarViewDelegate = null;
    private static _eventSource = {
        events: [],
    };
    private static _defaultOptions = {
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
        eventSources: [CalendarView._eventSource],
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

    public refresh(): void
    {
    }
}
export = CalendarView;
