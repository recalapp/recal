import Calendar = require('../../../library/Calendar/Calendar');
import CalendarViewEvent = require('../../../library/Calendar/CalendarViewEvent')
import Events = require('../Events/Events');

import IEventsModel = Events.IEventsModel;
import ICalendarViewEvent = Calendar.ICalendarViewEvent;

declare var SECTION_COLOR_MAP: any;

class ReCalCalendarViewEventAdapter
{
    private _calendarViewEvent: ICalendarViewEvent = null;
    public get calendarViewEvent(): ICalendarViewEvent
    {
        return this._calendarViewEvent;
    }

    constructor(eventsModel: IEventsModel)
    {
        this._calendarViewEvent = new CalendarViewEvent();
        this.calendarViewEvent.uniqueId = eventsModel.eventId;
        this.calendarViewEvent.title = eventsModel.title;
        this.calendarViewEvent.start = eventsModel.startDate;
        this.calendarViewEvent.end = eventsModel.endDate;
        this.calendarViewEvent.sectionColor = SECTION_COLOR_MAP[eventsModel.sectionId]['color'];
        this.calendarViewEvent.title = eventsModel.title;
        this.calendarViewEvent.title = eventsModel.title;
    }
}

export = ReCalCalendarViewEventAdapter;
