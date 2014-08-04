/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import CalendarViewController = require('../../../library/Calendar/CalendarViewController');
import CalendarViewEvent = require('../../../library/Calendar/CalendarViewEvent');
import DateTime = require('../../../library/DateTime/DateTime');

import ICalendarViewEvent = require('../../../library/Calendar/ICalendarViewEvent');
            
declare function colorLuminance(color: string, lumFactor: number): string;
declare function EventsMan_addUpdateListener(listener: ()=>void): void;
declare function EventsMan_getEventByID(id: string): any;
declare function EventsMan_getEventIDForRange(start: number, end: number): string[];
declare function PopUp_addCloseListener(listener: (eventId: string)=>void): void;
declare function PopUp_getMainPopUp(): any;
declare function PopUp_getPopUpByID(popUpId: string): any;
declare function PopUp_giveFocus(popUp: any): void;
declare function PopUp_setToEventID(popUp: any, popUpId: string): void;
declare function luminanceToRgb(lum: string): string;
declare function LO_hideLoading(id: string): void;
declare function LO_showLoading(id: string): void;
declare function rgbToRgba(rgb: string, transFactor: number): string;
declare function setOpacity(color: string, transFactor: number): string;
declare function UI_isPinned(eventId: string): boolean;
declare function UI_isMain(eventId: string): boolean;
declare var FACTOR_LUM: number;
declare var FACTOR_TRANS: number;
declare var FACTOR_TRANS_DARK: number;
declare var SE_id: string;
declare var SECTION_COLOR_MAP: any;
declare var THEME: string;

class DashboardCalendarViewController extends CalendarViewController
{
    public initialize(): void
    {
        // deselect when closing events
        PopUp_addCloseListener((eventId: string)=>
        {
            this.view.deselectCalendarEventsWithId(eventId);
        });
        
        // reload before displaying
        // TODO check if visible
        EventsMan_addUpdateListener(()=>
        {
            this.view.refresh();
        });
        $('#' + SE_id).on('close', (ev: JQueryEventObject)=>
        {
            this.view.refresh();
        });
        $('#calendar.tab-pane').each((index: number, pane: any)=>{
            $(pane).on('transitionend', (ev: JQueryEventObject)=>{
                if ($(pane).hasClass('in'))
                {
                    // TODO render
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
        var backgroundColor = calEvent.sectionColor;
        backgroundColor = colorLuminance(backgroundColor, FACTOR_LUM);
        calEvent.backgroundColor = rgbToRgba(luminanceToRgb(backgroundColor), 1.0);
        calEvent.borderColor = calEvent.backgroundColor;
        calEvent.textColor = '#ffffff';
        calEvent.highlighted = true;
    }
    private unhighlightCalendarEvent(calEvent: ICalendarViewEvent)
    {
        if (!calEvent.highlighted)
        {
            return;
        }
        var factor_trans = (THEME == 'w') ? FACTOR_TRANS : FACTOR_TRANS_DARK;
        var backgroundColor = calEvent.sectionColor;
        backgroundColor = colorLuminance(backgroundColor, FACTOR_LUM);
        calEvent.backgroundColor = rgbToRgba(luminanceToRgb(backgroundColor), factor_trans);
        calEvent.borderColor = setOpacity(calEvent.backgroundColor, 1.0);
        calEvent.textColor = calEvent.sectionColor;
        calEvent.highlighted = false;
    }

    public reload(): void
    {
        LO_showLoading('cal loading');
        this.view.refresh();
        LO_hideLoading('cal loading');
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
    public calendarViewEventsForRange(start: DateTime, end: DateTime): ICalendarViewEvent[]
    {
        var eventIds = EventsMan_getEventIDForRange(start.unix, end.unix);
        var calendarEvents: ICalendarViewEvent[] = new Array<ICalendarViewEvent>();
        $.each(eventIds, (index: number, eventId: string)=>
        {
            var eventDict = EventsMan_getEventByID(eventId);
            var calEvent = new CalendarViewEvent();
            calEvent.uniqueId = eventId;
            calEvent.title = eventDict['event_title'];
            calEvent.start = DateTime.fromUnix(parseInt(eventDict.event_start));
            calEvent.end = DateTime.fromUnix(parseInt(eventDict.event_end));
            calEvent.sectionColor = SECTION_COLOR_MAP[eventDict.section_id]['color'];
            calEvent.selected = UI_isPinned(eventId) || UI_isMain(eventId);
            calEvent.highlighted = !calEvent.selected; // forces first highlighting
            calEvent.selected ? this.highlightCalendarEvent(calEvent) : this.unhighlightCalendarEvent(calEvent);
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
        var eventId: string = calendarViewEvent.uniqueId;
        var popUp = PopUp_getPopUpByID(eventId);
        if (popUp === null || popUp === undefined)
        {
            // create the popup
            popUp = PopUp_getMainPopUp();
            PopUp_setToEventID(popUp, eventId);
            // TODO handle success/retry logic. was needed for when popup has uncommitted changes
        }
        PopUp_giveFocus(popUp);

        // TODO update selection. deselect any events no longer relevant
        // TODO handle highlight logic - decide whether to do that here or in calendar view itself
    }
}

export = DashboardCalendarViewController;
