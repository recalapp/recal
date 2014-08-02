import AbstractMethodException = require('../Core/AbstractMethodException');
import CalendarViewDataSource = require('./CalendarViewDataSource');
import CalendarViewDelegate = require('./CalendarViewDelegate');
import ICalendarView = require('./ICalendarView');
import ICalendarViewController = require('./ICalendarViewController');
import ICalendarViewEvent = require('./ICalendarViewEvent');
import ViewController = require('../../library/CoreUI/ViewController');

class CalendarViewController extends ViewController implements ICalendarViewController, CalendarViewDataSource, CalendarViewDelegate
{
    get view(): ICalendarView
    {
        return <ICalendarView>this._view;
    }

    /**
      * The array of calendar view events
      */
    public calendarViewEvents(): ICalendarViewEvent[]
    {
        throw new AbstractMethodException();
    }
    
    /**
      * The height for calendar view. e.g. "250px"
      */
    public heightForCalendarView(): string
    {
        throw new AbstractMethodException();
    }

    /**
      * Returns true if the event should be highlighted
      */
    eventIsHighlighted(calendarViewEvent: ICalendarViewEvent): boolean
    {
        throw new AbstractMethodException();
    }
}

export = CalendarViewController;
