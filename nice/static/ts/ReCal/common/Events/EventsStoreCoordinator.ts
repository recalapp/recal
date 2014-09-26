import Dictionary = require('../../../library/DataStructures/Dictionary');
import Events = require('./Events');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import ReCalCommonBrowserEvents = require('../ReCalCommonBrowserEvents');

import EventsStoreCoordinatorDependencies = Events.EventsStoreCoordinatorDependencies;
import IEventsModel = Events.IEventsModel;

/**
 * The class responsible to actually storing the events locally.
 * This class is also responsible for keeping track of which events have been
 * modified.
 */
class EventsStoreCoordinator
{
    private _eventsRegistry: Dictionary<string, IEventsModel> = null;
    private get eventsRegistry(): Dictionary<string, IEventsModel> { return this._eventsRegistry; }

    private set eventsRegistry(value: Dictionary<string, IEventsModel>)
    {
        this._eventsRegistry = value;
    }

    private _eventIdsSorted: string[] = null;
    private get eventIdsSorted(): string[]
    {
        if (this._eventIdsSorted === null || this._eventIdsSorted === undefined)
        {
            this._eventIdsSorted = this.eventsRegistry.allKeys();
            this._eventIdsSorted.sort((a: string, b: string) =>
            {
                var eventA = this.eventsRegistry.get(a);
                var eventB = this.eventsRegistry.get(b);
                return eventA.startDate.unix - eventB.startDate.unix;
            });
        }
        return this._eventIdsSorted;
    }

    /**
     * Global Browser Events Manager
     */
    private _globalBrowserEventsManager: GlobalBrowserEventsManager = null;
    private get globalBrowserEventsManager(): GlobalBrowserEventsManager { return this._globalBrowserEventsManager; }

    constructor(dependencies: EventsStoreCoordinatorDependencies)
    {
        this._globalBrowserEventsManager =
        dependencies.globalBrowserEventsManager;
        this.clearLocalEvents();
    }

    /**
     * Add the specified events to the events store. If an existing event with
     * the same id exists, this replaces it.
     */
    public addLocalEvents(eventsModels: IEventsModel[]): void
    {
        for (var i = 0; i < eventsModels.length; ++i)
        {
            this.eventsRegistry.set(eventsModels[i].eventId, eventsModels[i]);
        }
        this.eventsDataChanged();
    }

    /**
     * Delete any events in the specified list of IDs. This function can safely
     * be called with event IDs that do not exist.
     */
    public clearLocalEventsWithIds(eventIds: string[]): void
    {
        for (var i = 0; i < eventIds.length; ++i)
        {
            if (this.eventsRegistry.contains(eventIds[i]))
            {
                this.eventsRegistry.unset(eventIds[i]);
            }
        }
        this.eventsDataChanged();
    }

    /**
     * Clear out the local event store.
     */
    public clearLocalEvents(): void
    {
        this.eventsRegistry = new Dictionary<string, IEventsModel>();
        this.eventsDataChanged();
    }

    /**
     * Get event associated with the ID
     */
    public getEventById(eventId: string): IEventsModel
    {
        return this.eventsRegistry.get(eventId);
    }

    public getEventIdsWithFilter(filter: (string)=> {keep: boolean; stop: boolean}): string[]
    {
        var ret = new Array<string>();
        for (var i = 0; i < this.eventIdsSorted.length; ++i)
        {
            var result = filter(this.eventIdsSorted[i]);
            if (result.keep)
            {
                ret.push(this.eventIdsSorted[i]);
            }
            if (result.stop)
            {
                break;
            }
        }
        return ret;
    }

    private eventsDataChanged()
    {
        this._eventIdsSorted = null;
        this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDataChanged);
    }
}

export = EventsStoreCoordinator;
