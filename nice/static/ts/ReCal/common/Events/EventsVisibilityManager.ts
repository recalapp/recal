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

    private _hiddenEventIds = new Set<string>();
    private get hiddenEventIds(): Set<string> { return this._hiddenEventIds; }

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
        this.hiddenEventIds.add(eventId);
        this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDataChanged);
    }

    /**
     * Unhide the event associated with this ID. Safe to call on an event that
     * hasn't been hidden.
     */
    public unhideEventWithId(eventId: string): void
    {
        if (this.hiddenEventIds.contains(eventId))
        {
            this.hiddenEventIds.remove(eventId);
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
        return this.enabled && this.hiddenEventIds.contains(eventId);
    }


    /**
     * Used to quickly reset event visibility so that hiddenIds are the only
     * hidden events.
     */
    public resetEventVisibilityToHiddenEventIds(hiddenIds: string[])
    {
        this._hiddenEventIds = new Set<string>(hiddenIds);
    }
}

export = EventsVisibilityManager
