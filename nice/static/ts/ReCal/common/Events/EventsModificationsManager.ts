import Events = require('./Events');
import EventsStoreCoordinator = require('./EventsStoreCoordinator');
import Set = require('../../../library/DataStructures/Set');

import IEventsModel = Events.IEventsModel;

class EventsModificationsManager
{
    private _modifiedEventIds: Set<string> = null;
    private get modifiedEventIds(): Set<string> { return this._modifiedEventIds; }
    private set modifiedEventIds(value: Set<string>) { this._modifiedEventIds = value; }
    
    private _eventsStoreCoordinator: EventsStoreCoordinator = null;
    private get eventsStoreCoordinator(): EventsStoreCoordinator { return this._eventsStoreCoordinator; }

    constructor(dependencies: Events.EventsModificationsManagerDependencies)
    {
        this._eventsStoreCoordinator = dependencies.eventsStoreCoordinator;
        this.clearModificationsHistory();
    }

    /**
      * Clear out the history of modified events.
      */
    public clearModificationsHistory()
    {
        this.modifiedEventIds = new Set<string>();
    }
    
    /**
      * returns true if there are modified events
      */
    public hasModifiedEvents()
    {
        return this.modifiedEventIds && this.modifiedEventIds.size() > 0;
    }
    
    /**
      * Tells the events module that an event has been modified to be 
      * modifiedEventsModel
      */
    public commitModifiedEvent(modifiedEventsModel: IEventsModel): void
    {
        this.modifiedEventIds.add(modifiedEventsModel.eventId);
        this.eventsStoreCoordinator.addLocalEvents([modifiedEventsModel]);
    }

}

export = EventsModificationsManager;
