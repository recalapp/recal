import DateTime = require('../../../library/DateTime/DateTime');
import EventsModificationsManager = require('./EventsModificationsManager');
import EventsStoreCoordinator = require('./EventsStoreCoordinator');
import EventsVisibilityManager = require('./EventsVisibilityManager');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');

export interface EventsOperationsFacadeDependencies
{
    globalBrowserEventsManager: GlobalBrowserEventsManager;
}
export interface EventsModificationsManagerDependencies
{
    eventsStoreCoordinator: EventsStoreCoordinator;
}
export interface EventsSelectionManagerDependencies
{
    globalBrowserEventsManager: GlobalBrowserEventsManager;
}
export interface EventsStoreCoordinatorDependencies
{
    globalBrowserEventsManager: GlobalBrowserEventsManager;
}

export interface EventsRetrieverDependencies
{
    eventsStoreCoordinator: EventsStoreCoordinator;
    eventsVisibilityManager: EventsVisibilityManager;
}

export interface EventsServerCommunicatorDependencies
{
    eventsModificationsManager: EventsModificationsManager;
    eventsStoreCoordinator: EventsStoreCoordinator;
    eventsVisibilityManager: EventsVisibilityManager;
    globalBrowserEventsManager: GlobalBrowserEventsManager;
}

export interface IEventsModel
{
    eventId: string;
    title: string;
    description: string;
    location: string;
    sectionId: string;
    courseId: string;
    eventTypeCode: string;
    startDate: DateTime;
    endDate: DateTime;
    lastEdited: DateTime;
    eventGroupId: string;
    sectionColor: string;
    revisionId: string;
}

/**
 * IEventsOperationsFacade is the class responsible for all operations
 * related to events in the persepective of any events client. That is, to
 * any non-model classes, IEventsOperationsFacade will serve as the single
 * gateway to getting information about events.
 */
export interface IEventsOperationsFacade
{
    /***************************************************************************
     * Event Retrieval
     *************************************************************************/
    /**
     * Get event associated with the ID
     */
    getEventById(eventId: string): IEventsModel;

    /**
     * Get all event IDs in the range, inclusive.
     */
    getEventIdsInRange(start: DateTime, end: DateTime): string[];

    /***************************************************************************
     * Event Selection
     *************************************************************************/
    /**
     * Returns true if the event Id is pinned. That is, if its popup is opened
     * and has been dragged from sidebar.
     */
    eventIdIsPinned(eventId: string): boolean;

    /**
     * Returns true if the event Id is the main one opened. That is, it is the
     * one in the sidebar.
     */
    eventIdIsMain(eventId: string): boolean;

    /**
     * Returns true if the event Id is selected. That is, its popup is opened
     */
    eventIdIsSelected(eventId: string): boolean;

    /**
     * Select the event with this ID. An event is considered selected when its
     * popup is opened.
     */
    selectEventWithId(eventId: string): void;

    /**
     * Deselect the event with this ID. By deselecting, you are also unpinning.
     * Call this when you are closing an event popup
     */
    deselectEventWithId(eventId: string): void;

    /**
     * Pin a selected event. Throws an exception if the event is not selected.
     * Pinning means that the event popup is dragged from the sidebar.
     */
    pinEventWithId(eventId: string): void;

    /**
     * Unpin (but does not deselect) an event. Throws an exception if the event
     * is not selected. Unpinning means that the event popup has been dropped
     * back into the sidebar.
     */
    unpinEventWithId(eventId: string): void;

    /***************************************************************************
     * Event Modification
     *************************************************************************/
    /**
     * Tells the events module that an event has been modified to be
     * modifiedEventsModel
     */
    commitModifiedEvent(modifiedEventsModel: IEventsModel): void;
}
