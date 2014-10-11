import DateTime = require('../../../library/DateTime/DateTime');
import Events = require('./Events');
import EventsModificationsManager = require('./EventsModificationsManager');
import EventsRetriever = require('./EventsRetriever');
import EventsSelectionManager = require('./EventsSelectionManager');
import EventsServerCommunicator = require('./EventsServerCommunicator');
import EventsStoreCoordinator = require('./EventsStoreCoordinator');
import EventsVisibilityManager = require('./EventsVisibilityManager');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');

import IEventsModel = Events.IEventsModel;
import IEventsOperationsFacade = Events.IEventsOperationsFacade;

/**
 * IEventsOperationsFacade is the class responsible for all operations
 * related to events in the persepective of any events client. That is, to
 * any non-model classes, IEventsOperationsFacade will serve as the single
 * gateway to getting information about events.
 */
class EventsOperationsFacade implements IEventsOperationsFacade
{
    private _eventsStoreCoordinator: EventsStoreCoordinator = null;
    private get eventsStoreCoordinator(): EventsStoreCoordinator
    {
        if (!this._eventsStoreCoordinator)
        {
            this._eventsStoreCoordinator = new EventsStoreCoordinator({
                globalBrowserEventsManager: this.globalBrowserEventsManager,
            });
        }
        return this._eventsStoreCoordinator;
    }

    private _eventsServerCommunicator: EventsServerCommunicator = null;
    private get eventsServerCommunicator(): EventsServerCommunicator
    {
        if (!this._eventsServerCommunicator)
        {
            this._eventsServerCommunicator = new EventsServerCommunicator({
                eventsModificationsManager: this.eventsModificationsManager,
                eventsStoreCoordinator: this.eventsStoreCoordinator,
                eventsVisibilityManager: this.eventsVisibilityManager,
                globalBrowserEventsManager: this.globalBrowserEventsManager,
            });
        }
        return this._eventsServerCommunicator;
    }

    private _eventsVisibilityManager: EventsVisibilityManager = null;
    private get eventsVisibilityManager(): EventsVisibilityManager
    {
        if (!this._eventsVisibilityManager)
        {
            this._eventsVisibilityManager = new EventsVisibilityManager({
                globalBrowserEventsManager: this.globalBrowserEventsManager
            });
        }
        return this._eventsVisibilityManager;
    }

    /**
     * Events Modifications Manager
     */
    private _eventsModificationsManager: EventsModificationsManager = null;
    private get eventsModificationsManager(): EventsModificationsManager
    {
        if (!this._eventsModificationsManager)
        {
            this._eventsModificationsManager = new EventsModificationsManager({
                eventsStoreCoordinator: this.eventsStoreCoordinator,
            });
        }
        return this._eventsModificationsManager;
    }

    /**
     * Global Browser Events Manager
     */
    private _globalBrowserEventsManager: GlobalBrowserEventsManager = null;
    private get globalBrowserEventsManager(): GlobalBrowserEventsManager { return this._globalBrowserEventsManager; }


    constructor(dependencies: Events.EventsOperationsFacadeDependencies)
    {
        this._globalBrowserEventsManager =
        dependencies.globalBrowserEventsManager;
        this.eventsServerCommunicator.pullEvents();
    }

    /***************************************************************************
     * Event Retrieval
     *************************************************************************/
    private _eventsRetriever: EventsRetriever = null;
    private get eventsRetriever(): EventsRetriever
    {
        if (this._eventsRetriever === null || this._eventsRetriever
            === undefined)
        {
            this._eventsRetriever = new EventsRetriever({
                eventsStoreCoordinator: this.eventsStoreCoordinator,
                eventsVisibilityManager: this.eventsVisibilityManager,
            });
        }
        return this._eventsRetriever;
    }

    /**
     * Get event associated with the ID
     */
    public getEventById(eventId: string): IEventsModel
    {
        return this.eventsRetriever.getEventById(eventId);
    }

    /**
     * Get all event IDs in the range, inclusive.
     */
    public getEventIdsInRange(start: DateTime, end: DateTime): string[]
    {
        return this.eventsRetriever.getEventIdsInRange(start, end);
    }

    /***************************************************************************
     * Event Selection
     *************************************************************************/

    private _eventsSelectionManager: EventsSelectionManager = null;
    private get eventsSelectionManager(): EventsSelectionManager
    {
        if (this._eventsSelectionManager === null
            || this._eventsSelectionManager === undefined)
        {
            this._eventsSelectionManager = new EventsSelectionManager({
                globalBrowserEventsManager: this.globalBrowserEventsManager,
            });
        }
        return this._eventsSelectionManager;
    }

    /**
     * Returns true if the event Id is pinned. That is, if its popup is opened
     * and has been dragged from sidebar.
     */
    public eventIdIsPinned(eventId: string): boolean
    {
        return this.eventsSelectionManager.eventIdIsPinned(eventId);
    }

    /**
     * Returns true if the event Id is the main one opened. That is, it is the
     * one in the sidebar.
     */
    public eventIdIsMain(eventId: string): boolean
    {
        return this.eventsSelectionManager.eventIdIsMain(eventId);
    }

    /**
     * Returns true if the event Id is selected. That is, its popup is opened
     */
    public eventIdIsSelected(eventId: string): boolean
    {
        return this.eventsSelectionManager.eventIdIsSelected(eventId);
    }

    /**
     * Select the event with this ID. An event is considered selected when its
     * popup is opened.
     */
    public selectEventWithId(eventId: string): void
    {
        this.eventsSelectionManager.selectEventWithId(eventId);
    }

    /**
     * Deselect the event with this ID. By deselecting, you are also unpinning.
     * Call this when you are closing an event popup
     */
    public deselectEventWithId(eventId: string): void
    {
        this.eventsSelectionManager.deselectEventWithId(eventId);
    }

    /**
     * Pin a selected event. Throws an exception if the event is not selected.
     * Pinning means that the event popup is dragged from the sidebar.
     */
    public pinEventWithId(eventId: string): void
    {
        this.eventsSelectionManager.pinEventWithId(eventId);
    }

    /**
     * Unpin (but does not deselect) an event. Throws an exception if the event
     * is not selected. Unpinning means that the event popup has been dropped
     * back into the sidebar.
     */
    public unpinEventWithId(eventId: string): void
    {
        this.eventsSelectionManager.unpinEventWithId(eventId);
    }

    /***************************************************************************
     * Event Modification
     *************************************************************************/
    /**
     * Tells the events module that an event has been modified to be
     * modifiedEventsModel
     */
    public commitModifiedEvent(modifiedEventsModel: IEventsModel): void
    {
        this.eventsModificationsManager.commitModifiedEvent(modifiedEventsModel);
    }

    /***************************************************************************
     * Event Visibility
     **************************************************************************/
    /**
     * Hide the event associated with this ID. This is used for when the user
     * explicitly clicks on the hide button.
     */
    public hideEventWithId(eventId: string): void
    {
        this.eventsVisibilityManager.hideEventWithId(eventId);
    }

    /**
     * Unhide the event associated with this ID. Safe to call on an event that
     * hasn't been hidden.
     */
    public unhideEventWithId(eventId: string): void
    {
        this.eventsVisibilityManager.unhideEventWithId(eventId);
    }

    /**
     * Indicate whether or not hidden events should be shown.
     * @param shouldShow
     */
    public showHiddenEvents(shouldShow: boolean): void
    {
        this.eventsVisibilityManager.enabled = shouldShow;
    }
}

export = EventsOperationsFacade;
