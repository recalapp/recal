/// <reference path="../../typings/tsd.d.ts" />

/// <amd-dependency path="fullcalendar" />
import $ = require('jquery');
import moment = require('moment');

import CalendarViewDataSource = require('./CalendarViewDataSource');
import CalendarViewDelegate = require('./CalendarViewDelegate');
import DateTime = require('../DateTime/DateTime');
import ICalendarView = require('./ICalendarView');
import ICalendarViewEvent = require('./ICalendarViewEvent');
import View = require('../CoreUI/View');

interface CustomFullCalendarEventObject extends FullCalendar.EventObject
{
    calendarViewEvent?: ICalendarViewEvent;
}

class CalendarView extends View implements ICalendarView
{
    private _dataSource: CalendarViewDataSource = null;
    private _delegate: CalendarViewDelegate = null;
    private _defaultOptions: FullCalendar.Options = {
        defaultView: "agendaWeek",
        slotMinutes: 30,
        firstHour: 8,
        minTime: '08:00:00',
        maxTime: '23:00:00',
        eventDurationEditable: false,
        eventStartEditable: false,
        //eventBackgroundColor: "#74a2ca",
        //eventBorderColor: "#428bca",
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
            this.initializeCalendar();
            //this.refresh();
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

    private initializeCalendar(): void
    {
        // deinitialize if needed
        this._$el.fullCalendar('destroy');

        // set default options
        this._defaultOptions.eventSources = [{
            events: (start: Moment, end: Moment, timezone: any, callback: (events: any[])=>void)=>
            {
                // TODO verify that the moment objects passed actually are correct in timezone
                callback(this.retrieveCalendarEvents(new DateTime(start), new DateTime(end)));
            }
        }];
        this._defaultOptions.height = this.dataSource.heightForCalendarView();
        this._defaultOptions.eventClick = (calEvent: CustomFullCalendarEventObject, jsEvent: any, html: any) => 
        {
            this.handleClick(calEvent, jsEvent, html);
        };
        this._defaultOptions.windowResize = (view: any)=>{
            this._$el.fullCalendar('option', 'height', this.dataSource.heightForCalendarView());
        };

        // initialize
        this._$el.fullCalendar(this._defaultOptions);
        //this.render();
    }

    private handleClick(calEvent: CustomFullCalendarEventObject, jsEvent: any, html: any)
    {
        // TODO handle single selection - multiple by default like table view
        if (!calEvent.calendarViewEvent.selected || !this.dataSource.shouldToggleSelection())
        {
            this.selectCalendarEvent(calEvent);
            if (this.delegate)
            {
                this.delegate.didSelectEvent(calEvent.calendarViewEvent);
            }
        } 
        else
        {
            // toggle selection on - deselect the cell
            this.deselectCalendarEvent(calEvent);
            if (this.delegate)
            {
                this.delegate.didDeselectEvent(calEvent.calendarViewEvent);
            }
        }
        this._$el.fullCalendar('updateEvent', this.updateFullCalendarEventFromCalendarViewEvent(calEvent, calEvent.calendarViewEvent));
    }

    private retrieveCalendarEvents(start: DateTime, end: DateTime): CustomFullCalendarEventObject[]
    {
        if (this.dataSource === null || this.dataSource === undefined)
        {
            return [];
        }
        var calendarEventArray: ICalendarViewEvent[] = this.dataSource.calendarViewEventsForRange(start, end);
        var results = new Array<CustomFullCalendarEventObject>();
        $.each(calendarEventArray, (index: number, calendarViewEvent: ICalendarViewEvent)=>{
            // TODO verify timezone
            results.push(this.createFullCalendarEventFromCalendarViewEvent(calendarViewEvent));
        });
        return results;
    }

    private createFullCalendarEventFromCalendarViewEvent(calendarViewEvent: ICalendarViewEvent): CustomFullCalendarEventObject
    {
        return this.updateFullCalendarEventFromCalendarViewEvent({
            title: null,
            start: null,
            end: null
        }, calendarViewEvent);
    }
    private updateFullCalendarEventFromCalendarViewEvent(calEvent: CustomFullCalendarEventObject, calendarViewEvent: ICalendarViewEvent): CustomFullCalendarEventObject
    {
        calEvent.id = calendarViewEvent.uniqueId;
        calEvent.title = calendarViewEvent.title;
        calEvent.start = calendarViewEvent.start.toJsDate();
        calEvent.end = calendarViewEvent.end.toJsDate();
        calEvent.textColor = calendarViewEvent.textColor;
        calEvent.backgroundColor = calendarViewEvent.backgroundColor;
        calEvent.borderColor = calendarViewEvent.borderColor;
        calEvent.calendarViewEvent = calendarViewEvent;
        return calEvent;
    }

    public selectCalendarEventsWithId(uniqueId: string): void
    {
        var calEvents: CustomFullCalendarEventObject[] = this.getCalendarEventsWithId(uniqueId);
        $.each(calEvents, (index: number, calEvent: CustomFullCalendarEventObject) => 
        {
            this.selectCalendarEvent(calEvent);
        });
    }
    public deselectCalendarEventsWithId(uniqueId: string): void
    {
        var calEvents: CustomFullCalendarEventObject[] = this.getCalendarEventsWithId(uniqueId);
        $.each(calEvents, (index: number, calEvent: CustomFullCalendarEventObject) => 
        {
            this.deselectCalendarEvent(calEvent);
        });
    }
    public getCalendarViewEventWithId(uniqueId: string): ICalendarViewEvent
    {
        var calEvents: CustomFullCalendarEventObject[] = this.getCalendarEventsWithId(uniqueId);
        if (calEvents.length === 0)
        {
            return null;
        }
        return calEvents[0].calendarViewEvent;
    }
    /**
      * Update the calendar html element associated with this calendar view event.
      * The id cannot change
      */
    public updateCalendarViewEvent(calendarViewEvent: ICalendarViewEvent): void
    {
        var calEvents: CustomFullCalendarEventObject[] = this.getCalendarEventsWithId(calendarViewEvent.uniqueId);
        if (calEvents.length === 0)
        {
            return;
        }
        this._$el.fullCalendar('updateEvent', this.updateFullCalendarEventFromCalendarViewEvent(calEvents[0], calendarViewEvent));
    }

    private getCalendarEventsWithId(uniqueId: string): CustomFullCalendarEventObject[]
    {
        return <CustomFullCalendarEventObject[]>this._$el.fullCalendar('clientEvents', uniqueId);
    }

    private selectCalendarEvent(calEvent: CustomFullCalendarEventObject): void
    {
        calEvent.calendarViewEvent.selected = true;
    }

    private deselectCalendarEvent(calEvent: CustomFullCalendarEventObject): void
    {
        calEvent.calendarViewEvent.selected = false;
    }

    public refresh(): void
    {
        // must use a try because fullCalendar doesn't handle when the view is not yet on screen
        try {
            this._$el.fullCalendar('refetchEvents');
        }
        catch(error){
        }
    }
    public render(): void
    {
        this._$el.fullCalendar('render');
    }
    public selectedCalendarViewEvents(): ICalendarViewEvent[]
    {
        var calEvents: CustomFullCalendarEventObject[] = <CustomFullCalendarEventObject[]> this._$el.fullCalendar('clientEvents', (calEvent: CustomFullCalendarEventObject)=>{
            return calEvent.calendarViewEvent.selected;
        });
        var result: ICalendarViewEvent[] = new Array<ICalendarViewEvent>();
        $.each(calEvents, (index: number, calEvent: CustomFullCalendarEventObject)=>{
            result.push(calEvent.calendarViewEvent)
        });
        return result;
    }

}
export = CalendarView;
