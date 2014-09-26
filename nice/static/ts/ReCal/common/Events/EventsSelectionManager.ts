import Events = require('./Events');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import InvalidActionException = require('../../../library/Core/InvalidActionException');
import ReCalCommonBrowserEvents = require('../ReCalCommonBrowserEvents');
import Set = require('../../../library/DataStructures/Set');

class EventsSelectionManager
{
    /**
     * Global Browser Events Manager
     */
    private _globalBrowserEventsManager: GlobalBrowserEventsManager = null;
    private get globalBrowserEventsManager(): GlobalBrowserEventsManager { return this._globalBrowserEventsManager; }

    constructor(dependencies: Events.EventsSelectionManagerDependencies)
    {
        this._globalBrowserEventsManager =
        dependencies.globalBrowserEventsManager;
    }

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
        return this.eventIdIsSelected(eventId)
            && !this.eventIdIsPinned(eventId);
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
        var selected = this.selectedIds.toArray();
        var changed = new Set<string>();
        // TODO optimize
        for (var i = 0; i < selected.length; ++i)
        {
            if (!this.eventIdIsPinned(selected[i]))
            {
                this.selectedIds.remove(selected[i]);
                changed.add(selected[i]);
            }
        }
        this.selectedIds.add(eventId);
        changed.add(eventId);
        this.triggerSelectionChangeBrowserEvent(changed.toArray());
    }

    /**
     * Deselect the event with this ID. By deselecting, you are also unpinning.
     * Call this when you are closing an event popup
     */
    public deselectEventWithId(eventId: string): void
    {
        this.pinnedIds.remove(eventId);
        this.selectedIds.remove(eventId);
        this.triggerSelectionChangeBrowserEvent([eventId]);
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
        this.triggerSelectionChangeBrowserEvent([eventId]);
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
        this.triggerSelectionChangeBrowserEvent([eventId]);
    }

    /***************************************************************************
     * Helper functions
     *************************************************************************/
    private triggerSelectionChangeBrowserEvent(eventIds: string[])
    {
        this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventSelectionChanged,
            {
                eventIds: eventIds,
            });
    }
}

export = EventsSelectionManager;
