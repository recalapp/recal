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

}

export = EventsRetriever;
