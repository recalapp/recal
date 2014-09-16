import DateTime = require('../../../library/DateTime/DateTime');

export interface EventsModelConstructorArguments
{
    eventId: string;
    title: string;
    description: string;
    sectionId: string;
    eventTypeCode: string;
    startDate: DateTime;
    endDate: DateTime;
    lastEdited: DateTime;
}

export interface IEventsModel
{
    eventId: string;
    title: string;
    description: string;
    sectionId: string;
    eventTypeCode: string;
    startDate: DateTime;
    endDate: DateTime;
    lastEdited: DateTime;
}

/**
  * EventsManager is the class responsible for all operations related to events 
  * in the persepective of any events client. That is, to any non-model classes,
  * EventsManager will serve as the single gateway to getting information about 
  * events.
  */
export interface IEventsManager
{
    /***************************************************************************
      * Checking the state of events.
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
    /***************************************************************************
      * Manipulating the state of events.
      *************************************************************************/

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
      * Getting available event Ids
      *************************************************************************/
    /**
      * Apply to all selected events. apply must have type 
      * (string, boolean, boolean) => boolean. Returns false to break.
      */
    mapToSelectedEventIds(apply: (eventId: string, isPinned: boolean, isMain: boolean) => boolean): void;
}
