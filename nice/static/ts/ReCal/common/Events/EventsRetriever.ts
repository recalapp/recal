import DateTime = require('../../../library/DateTime/DateTime');
import Events = require('./Events');
import EventsModel = require('./EventsModel');

import IEventsModel = Events.IEventsModel;

declare function EventsMan_getEventByID(id: string): any;
declare function EventsMan_getEventIDForRange(start: number, end: number): string[];

// TODO implement
class EventsRetriever
{
    /**
      * Get event associated with the ID
      */
    public getEventById(eventId: string): IEventsModel
    {
        var legacyEventObject: any = EventsMan_getEventByID(eventId);
        return this.getEventsModelFromLegacyEventObject(legacyEventObject)
    }

    /**
      * Get all event IDs in the range, inclusive.
      */
    public getEventIdsInRange(start: DateTime, end: DateTime): string[]
    {
        return EventsMan_getEventIDForRange(start.unix, end.unix);
    }

    private getEventsModelFromLegacyEventObject(legacyEventObject: any): IEventsModel
    {
        return new EventsModel({
            eventId: legacyEventObject.event_id.toString(),
            title: legacyEventObject.event_title,
            description: legacyEventObject.event_description,
            sectionId: legacyEventObject.section_id.toString(),
            eventTypeCode: legacyEventObject.event_type,
            startDate: DateTime.fromUnix(parseInt(legacyEventObject.event_start)),
            endDate: DateTime.fromUnix(parseInt(legacyEventObject.event_end)),
            lastEdited: DateTime.fromUnix(parseInt(legacyEventObject.modified_time))
        });
    }
}

export = EventsRetriever;
