import AbstractMethodException = require('../Core/AbstractMethodException');
import CalendarViewDataSource = require('./CalendarViewDataSource');
import CalendarViewDelegate = require('./CalendarViewDelegate');
import DateTime = require('../DateTime/DateTime');
import ICalendarView = require('./ICalendarView');
import ICalendarViewController = require('./ICalendarViewController');
import ICalendarViewEvent = require('./ICalendarViewEvent');
import ViewController = require('../../library/CoreUI/ViewController');

class CalendarViewController extends ViewController implements ICalendarViewController, CalendarViewDataSource, CalendarViewDelegate
{
    constructor(view: ICalendarView)
    {
        super(view);
        this.view.dataSource = this;
        this.view.delegate = this;
    }

    get view(): ICalendarView
    {
        return <ICalendarView>this._view;
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
        return true;
    }
    
    /**
      * The array of calendar view events in range
      */
    public calendarViewEventsForRange(start: DateTime, end: DateTime): ICalendarViewEvent[]
    {
        throw new AbstractMethodException();
    }
    
    /**
      * The height for calendar view in pixels
      */
    public heightForCalendarView(): number
    {
        throw new AbstractMethodException();
    }

    /********************************************************************
      Delegate
      ******************************************************************/

    /**
      * Callback for when an event is selected
      */
    public didSelectEvent(calendarViewEvent: ICalendarViewEvent): void
    {
    }

    /**
      * Callback for when an event is deselected
      */
    public didDeselectEvent(calendarViewEvent: ICalendarViewEvent): void
    {
    }
}

export = CalendarViewController;
