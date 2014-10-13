import Events = require('./Events');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import ReCalCommonBrowserEvents = require('../ReCalCommonBrowserEvents');
import Set = require('../../../library/DataStructures/Set');

import EventsVisibilityManagerDependencies = Events.EventsVisibilityManagerDependencies;

/**
 * EventsVisibilityManager deals with the visibility of events. An event may be
 * hidden because a user explicitly selected it to be hidden, or because its
 * course is not currently shown on the calendar according to the user's
 * preferences.
 */
class EventsVisibilityManager
{
    private _enabled = true;
    public get enabled(): boolean { return this._enabled; }
    public set enabled(value: boolean) { this._enabled = value; }

    /**
     * A boolean to keep track of whether visibility has changed since reset
     * was last called
     * @type {boolean}
     * @private
     */
    private _visibilityChanged = false;
    public get visibilityChanged(): boolean { return this._visibilityChanged; }

    private _hiddenEventIds = new Set<string>();
    private get hiddenEventIdsSet(): Set<string> { return this._hiddenEventIds; }
    public get hiddenEventIds(): string[] { return this.hiddenEventIdsSet.toArray(); }

    /**
     * Global Browser Events Manager
     */
    private _globalBrowserEventsManager: GlobalBrowserEventsManager = null;
    private get globalBrowserEventsManager(): GlobalBrowserEventsManager { return this._globalBrowserEventsManager; }

    constructor(dependencies: EventsVisibilityManagerDependencies)
    {
        this._globalBrowserEventsManager =
        dependencies.globalBrowserEventsManager;
    }

    /**
     * Hide the event associated with this ID. This is used for when the user
     * explicitly clicks on the hide button.
     */
    public hideEventWithId(eventId: string): void
    {
        if (!this.hiddenEventIdsSet.contains(eventId))
        {
            this.hiddenEventIdsSet.add(eventId);
            this._visibilityChanged = true;
            this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDataChanged);
        }
    }

    /**
     * Unhide the event associated with this ID. Safe to call on an event that
     * hasn't been hidden.
     */
    public unhideEventWithId(eventId: string): void
    {
        if (this.hiddenEventIdsSet.contains(eventId))
        {
            this.hiddenEventIdsSet.remove(eventId);
            this._visibilityChanged = true;
            this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDataChanged);
        }
    }

    /**
     * Returns true if the event should be hidden.
     */
    public eventIdIsHidden(eventId: string): boolean
    {
        // TODO calculate visibility based on other information, such as user 
        // preferences.
        return (this.enabled && this.hiddenEventIdsSet.contains(eventId));
    }


    /**
     * Used to quickly reset event visibility so that hiddenIds are the only
     * hidden events.
     */
    public resetEventVisibilityToHiddenEventIds(hiddenIds: string[])
    {
        this._hiddenEventIds = new Set<string>(hiddenIds);
        this._visibilityChanged = false;
    }
}

export = EventsVisibilityManager
