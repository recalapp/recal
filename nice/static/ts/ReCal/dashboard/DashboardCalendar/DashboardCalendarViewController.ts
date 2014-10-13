/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import Calendar = require('../../../library/Calendar/Calendar');
import CalendarViewController = require('../../../library/Calendar/CalendarViewController');
import CalendarViewEvent = require('../../../library/Calendar/CalendarViewEvent');
import DashboardCalendar = require('./DashboardCalendar');
import DateTime = require('../../../library/DateTime/DateTime');
import Events = require('../../common/Events/Events');
import ReCalCalendarViewEventAdapter = require('../../common/ReCalCalendar/ReCalCalendarViewEventAdapter');

import DashboardCalendarViewControllerDependencies = DashboardCalendar.DashboardCalendarViewControllerDependencies;
import ICalendarView = Calendar.ICalendarView;
import ICalendarViewEvent = Calendar.ICalendarViewEvent;
import IEventsOperationsFacade = Events.IEventsOperationsFacade;

class DashboardCalendarViewController extends CalendarViewController
{
    /**
     * Events Operations Facade
     */
    private _eventsOperationsFacade: IEventsOperationsFacade = null;
    private get eventsOperationsFacade(): IEventsOperationsFacade { return this._eventsOperationsFacade; }

    constructor(calendarView: ICalendarView,
                dependencies: DashboardCalendarViewControllerDependencies)
    {
        super(calendarView);
        this._eventsOperationsFacade = dependencies.eventsOperationsFacade;
        this.initialize();
    }

    private initialize(): void
    {
        // deselect when closing events
        //PopUp_addCloseListener((eventId: string)=>
        //{
        //    this.view.deselectCalendarEventsWithId(eventId);
        //    var calEvent: ICalendarViewEvent = this.view.getCalendarViewEventWithId(eventId);
        //    this.unhighlightCalendarEvent(calEvent);
        //    this.view.updateCalendarViewEvent(calEvent);
        //});

        // reload before displaying
        // TODO check if visible
        /*$('#' + SE_id).on('close', (ev: JQueryEventObject)=>
        {
            this.view.refresh();
        });*/
        $('#calendar.tab-pane').each((index: number, pane: any)=>
        {
            $(pane).on('transitionend', (ev: JQueryEventObject)=>
            {
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

    private highlightCalendarEvent(calEvent: ICalendarViewEvent)
    {
        if (calEvent.highlighted)
        {
            return;
        }
        //var backgroundColor = calEvent.sectionColor;
        //backgroundColor = colorLuminance(backgroundColor, FACTOR_LUM);
        //calEvent.backgroundColor =
        //rgbToRgba(luminanceToRgb(backgroundColor), 1.0);
        //calEvent.borderColor = calEvent.backgroundColor;
        //calEvent.textColor = '#ffffff';
//        calEvent.highlighted = true;
    }

    private unhighlightCalendarEvent(calEvent: ICalendarViewEvent)
    {
        if (!calEvent.highlighted)
        {
            return;
        }
        //var factor_trans = (THEME == 'w') ? FACTOR_TRANS : FACTOR_TRANS_DARK;
        //var backgroundColor = calEvent.sectionColor;
        //backgroundColor = colorLuminance(backgroundColor, FACTOR_LUM);
        //calEvent.backgroundColor =
        //rgbToRgba(luminanceToRgb(backgroundColor), factor_trans);
        //calEvent.borderColor = setOpacity(calEvent.backgroundColor, 1.0);
        //calEvent.textColor = calEvent.sectionColor;
//        calEvent.highlighted = false;
    }

    public reload(): void
    {
        //LO_showLoading('cal loading');
        this.view.refresh();
        //LO_hideLoading('cal loading');
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
    public calendarViewEventsForRange(start: DateTime,
                                      end: DateTime): ICalendarViewEvent[]
    {
        var eventsOperationsFacade = this.eventsOperationsFacade;
        var eventIds = eventsOperationsFacade.getEventIdsInRange(start, end);
        var calendarEvents: ICalendarViewEvent[] = new Array<ICalendarViewEvent>();
        $.each(eventIds, (index: number, eventId: string)=>
        {
            var eventsModel = eventsOperationsFacade.getEventById(eventId);
            var calEventAdapter = new ReCalCalendarViewEventAdapter(eventsModel);
            var calEvent = calEventAdapter.calendarViewEvent;
            calEvent.selected =
            eventsOperationsFacade.eventIdIsSelected(eventId);
            calEvent.highlighted = !calEvent.selected; // forces first highlighting
            calEvent.selected ? this.highlightCalendarEvent(calEvent) :
                this.unhighlightCalendarEvent(calEvent);
            calendarEvents.push(calEvent);
        });
        return calendarEvents;
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

    /**
     * Callback for when an event is selected
     */
    public didSelectEvent(calendarViewEvent: ICalendarViewEvent): void
    {
        var eventsOperationsFacade = this.eventsOperationsFacade;
        var eventId: string = calendarViewEvent.uniqueId;

        if (eventsOperationsFacade.eventIdIsSelected(eventId))
        {
            eventsOperationsFacade.selectEventWithId(eventId);
        }
        else
        {
            // TODO bring event popup into focus - maybe simply by calling select again?
            eventsOperationsFacade.selectEventWithId(eventId); // TODO works? Does this cause the popup to come into focus?
        }

        // update selection. deselect any events no longer relevant
        this.highlightCalendarEvent(calendarViewEvent);
        this.view.updateCalendarViewEvent(calendarViewEvent);
        $.each(this.view.selectedCalendarViewEvents(),
            (index: number, selectedEvent: ICalendarViewEvent)=>
            {
                var eventId = selectedEvent.uniqueId;
                if (!eventsOperationsFacade.eventIdIsSelected(eventId))
                {
                    this.view.deselectCalendarEventsWithId(eventId);
                    this.unhighlightCalendarEvent(selectedEvent);
                    this.view.updateCalendarViewEvent(selectedEvent);
                }
            });

    }
}

export = DashboardCalendarViewController;
