/// <reference path="../../../typings/tsd.d.ts" />
/// <amd-dependency path="bootstrap" />

import Calendar = require('../../../library/Calendar/Calendar');
import CalendarViewController = require('../../../library/Calendar/CalendarViewController');
import CalendarViewEvent = require('../../../library/Calendar/CalendarViewEvent');
import NiceCalendar = require('./NiceCalendar');
import DateTime = require('../../../library/DateTime/DateTime');
import Events = require('../../common/Events/Events');
import ReCalCalendarViewEventAdapter = require('../../common/ReCalCalendar/ReCalCalendarViewEventAdapter');

import NiceCalendarViewControllerDependencies = NiceCalendar.NiceCalendarViewControllerDependencies;
import ICalendarView = Calendar.ICalendarView;
import ICalendarViewEvent = Calendar.ICalendarViewEvent;
import IEventsOperationsFacade = Events.IEventsOperationsFacade;

class NiceCalendarViewController extends CalendarViewController
{
    /**
      * Events Operations Facade
      */
    private _eventsOperationsFacade: IEventsOperationsFacade = null;
    private get eventsOperationsFacade(): IEventsOperationsFacade { return this._eventsOperationsFacade; }

    constructor(calendarView: ICalendarView, dependencies: NiceCalendarViewControllerDependencies)
    {
        super(calendarView);
        this._eventsOperationsFacade = dependencies.eventsOperationsFacade;
        this.initialize();
    }

    private initialize(): void
    {
        $('#calendar.tab-pane').each((index: number, pane: any)=>{
            $(pane).on('transitionend', (ev: JQueryEventObject)=>{
                if ($(pane).hasClass('in'))
                {
                    // TODO render
                    this.view.render();
                    this.view.refresh();
                }
            });
        });
        // TODO check if visible
        this.view.refresh();
    }

    /********************************************************************
      Data Source
      ******************************************************************/

    /**
      * Returns true if a cell should be deselected
      * when it is selected and clicked on again.
      */
    public shouldToggleSelection(): boolean
    {
        return false;
    }

    /**
     * The array of calendar view events in range
     */
    public calendarViewEventsForRange(start: DateTime, end: DateTime): ICalendarViewEvent[] {
        return [];
    }

    /**
      * The height for calendar view in pixels
      */
    public heightForCalendarView(): number
    {
        return window.innerHeight - $('.navbar').height() - 50;
    }

    /********************************************************************
      Delegate
      ******************************************************************/
}

export = NiceCalendarViewController;
