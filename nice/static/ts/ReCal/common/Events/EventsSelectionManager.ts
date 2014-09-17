import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import InvalidActionException = require('../../../library/Core/InvalidActionException');
import ReCalCommonBrowserEvents = require('../ReCalCommonBrowserEvents');
import Set = require('../../../library/DataStructures/Set');

class EventsSelectionManager
{
    /**
      * An event is considered pinned if it is selected and if its popup has
      * been dragged from the sidebar.
      */
    private _pinnedIds = new Set<string>();
    private get pinnedIds(): Set<string>
    {
        return this._pinnedIds;
    }

    /**
      * An event is considered selected if it has a popup opened for it.
      */
    private _selectedIds = new Set<string>();
    private get selectedIds(): Set<string>
    {
        return this._selectedIds;
    }

    /***************************************************************************
      * Checking the state of events.
      *************************************************************************/
    /**
      * Returns true if the event Id is pinned. That is, if its popup is opened
      * and has been dragged from sidebar.
      */
    public eventIdIsPinned(eventId: string): boolean
    {
        return this._pinnedIds.contains(eventId);
    }

    /**
      * Returns true if the event Id is the main one opened. That is, it is the
      * one in the sidebar.
      */
    public eventIdIsMain(eventId: string): boolean
    {
        return this.eventIdIsSelected(eventId) && !this.eventIdIsPinned(eventId);
    }

    /**
      * Returns true if the event Id is selected. That is, its popup is opened
      */
    public eventIdIsSelected(eventId: string): boolean
    {
        return this.selectedIds.contains(eventId);
    }

    /***************************************************************************
      * Manipulating the state of events.
      *************************************************************************/

    /**
      * Select the event with this ID. An event is considered selected when its
      * popup is opened.
      */
    public selectEventWithId(eventId: string): void
    {
        this.selectedIds.add(eventId);
        this.triggerSelectionChangeBrowserEvent(eventId);
    }

    /**
      * Deselect the event with this ID. By deselecting, you are also unpinning.
      * Call this when you are closing an event popup
      */
    public deselectEventWithId(eventId: string): void
    {
        this.pinnedIds.remove(eventId);
        this.selectedIds.remove(eventId);
        this.triggerSelectionChangeBrowserEvent(eventId);
    }

    /**
      * Pin a selected event. Throws an exception if the event is not selected.
      * Pinning means that the event popup is dragged from the sidebar.
      */
    public pinEventWithId(eventId: string): void
    {
        if (!this.eventIdIsSelected(eventId))
        {
            throw new InvalidActionException('Event Id must first be selected before pinning');
        }
        this.pinnedIds.add(eventId);
        this.triggerSelectionChangeBrowserEvent(eventId);
    }

    /**
      * Unpin (but does not deselect) an event. Throws an exception if the event
      * is not selected. Unpinning means that the event popup has been dropped 
      * back into the sidebar.
      */
    public unpinEventWithId(eventId: string): void
    {
        if (!this.eventIdIsSelected(eventId))
        {
            throw new InvalidActionException('Cannot unpin an event that is not selected to begin with');
        }
        this.pinnedIds.remove(eventId);
        this.triggerSelectionChangeBrowserEvent(eventId);
    }

    /***************************************************************************
      * Getting available event Ids
      *************************************************************************/
    /**
      * Apply to all selected events. apply must have type 
      * (string, boolean, boolean) => boolean. Returns false to break.
      */
    public mapToSelectedEventIds(apply: (eventId: string, isPinned: boolean, isMain: boolean) => boolean): void
    {
        var selectedIdsArray = this.selectedIds.toArray();
        for (var i = 0; i < selectedIdsArray.length; ++i)
        {
            var eventId = selectedIdsArray[i]
            if (!apply(eventId, this.eventIdIsPinned(eventId), this.eventIdIsMain(eventId)))
            {
                break;
            }
        }
    }
/***************************************************************************
      * Helper functions
      *************************************************************************/
    private triggerSelectionChangeBrowserEvent(eventId: string)
    {
        GlobalBrowserEventsManager.instance.triggerEvent(ReCalCommonBrowserEvents.eventSelectionChanged, 
        {
            eventId: eventId,
        });
    }
}

export = EventsSelectionManager;
