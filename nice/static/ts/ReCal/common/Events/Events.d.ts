import DateTime = require('../../../library/DateTime/DateTime');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');

export interface EventsOperationsFacadeDependencies
{
    globalBrowserEventsManager: GlobalBrowserEventsManager;
}
export interface EventsSelectionManagerDependencies
{
    globalBrowserEventsManager: GlobalBrowserEventsManager;
}

export interface IEventsModel
{
    eventId: string;
    title: string;
    description: string;
    sectionId: string;
    courseId: string;
    eventTypeCode: string;
    startDate: DateTime;
    endDate: DateTime;
    lastEdited: DateTime;
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
}
