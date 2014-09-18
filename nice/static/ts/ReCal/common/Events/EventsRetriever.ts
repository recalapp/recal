import DateTime = require('../../../library/DateTime/DateTime');
import Events = require('./Events');
import EventsModel = require('./EventsModel');

import IEventsModel = Events.IEventsModel;

// TODO implement
class EventsRetriever
{
    /**
      * Get event associated with the ID
      */
    public getEventById(eventId: string): IEventsModel
    {
        return null;
    }

    /**
      * Get all events in the range, inclusive.
      */
    public getAllEventsInRange(start: DateTime, end: DateTime): IEventsModel[]
    {
        return null;
    }
}

export = EventsRetriever;
