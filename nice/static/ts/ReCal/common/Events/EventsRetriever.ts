import ComparableResult = require('../../../library/Core/ComparableResult');
import DateTime = require('../../../library/DateTime/DateTime');
import Events = require('./Events');
import EventsModel = require('./EventsModel');
import EventsStoreCoordinator = require('./EventsStoreCoordinator');

import IEventsModel = Events.IEventsModel;

declare function EventsMan_getEventByID(id: string): any;
declare function EventsMan_getEventIDForRange(start: number, end: number): string[];

// TODO implement
class EventsRetriever
{
    private _eventsStoreCoordinator: EventsStoreCoordinator = null;
    private get eventsStoreCoordinator(): EventsStoreCoordinator { return this._eventsStoreCoordinator; }

    constructor(dependencies: Events.EventsRetrieverDependencies)
    {
        this._eventsStoreCoordinator = dependencies.eventsStoreCoordinator;
    }

    /**
      * Get event associated with the ID
      */
    public getEventById(eventId: string): IEventsModel
    {
        return this.eventsStoreCoordinator.getEventById(eventId);
    }

    /**
      * Get all event IDs in the range, inclusive.
      */
    public getEventIdsInRange(start: DateTime, end: DateTime): string[]
    {
        return this.eventsStoreCoordinator.getEventIdsWithFilter((eventId: string)=>{
            var eventsModel = this.getEventById(eventId);
            var ret: { keep: boolean; stop: boolean; } = { keep: false, stop: false };
            ret.keep = start.compareTo(eventsModel.startDate) === ComparableResult.less 
                && end.compareTo(eventsModel.startDate) === ComparableResult.greater;
            ret.stop = end.compareTo(eventsModel.startDate) === ComparableResult.less;
            return ret;
        });
    }

    private getEventsModelFromLegacyEventObject(legacyEventObject: any): IEventsModel
    {
        return new EventsModel({
            eventId: legacyEventObject.event_id.toString(),
            title: legacyEventObject.event_title,
            description: legacyEventObject.event_description,
            sectionId: legacyEventObject.section_id.toString(),
            courseId: legacyEventObject.course_id.toString(),
            eventTypeCode: legacyEventObject.event_type,
            startDate: DateTime.fromUnix(parseInt(legacyEventObject.event_start)),
            endDate: DateTime.fromUnix(parseInt(legacyEventObject.event_end)),
            lastEdited: DateTime.fromUnix(parseInt(legacyEventObject.modified_time))
        });
    }
}

export = EventsRetriever;
