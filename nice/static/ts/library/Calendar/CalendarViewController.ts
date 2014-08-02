import AbstractMethodException = require('../Core/AbstractMethodException');
import CalendarViewDataSource = require('./CalendarViewDataSource');
import CalendarViewDelegate = require('./CalendarViewDelegate');
import ICalendarViewController = require('./ICalendarViewController');
import ICalendarViewEvent = require('./ICalendarViewEvent');
import ViewController = require('../../library/CoreUI/ViewController');

class CalendarViewController extends ViewController implements ICalendarViewController, CalendarViewDataSource, CalendarViewDelegate
{
    public getCalendarViewEvents(): ICalendarViewEvent[]
    {
        throw new AbstractMethodException();
    }
}

export = CalendarViewController;
