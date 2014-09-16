define(["require", "exports", '../../../library/Core/GlobalBrowserEventsManager', '../../../library/Core/InvalidActionException', '../ReCalCommonBrowserEvents', '../../../library/DataStructures/Set'], function(require, exports, GlobalBrowserEventsManager, InvalidActionException, ReCalCommonBrowserEvents, Set) {
    /**
    * EventsManager is the class responsible for all operations related to events
    * in the persepective of any events client. That is, to any non-model classes,
    * EventsManager will serve as the single gateway to getting information about
    * events.
    */
    var EventsManager = (function () {
        function EventsManager() {
            /**
            * An event is considered pinned if it is selected and if its popup has
            * been dragged from the sidebar.
            */
            this._pinnedIds = new Set();
            /**
            * An event is considered selected if it has a popup opened for it.
            */
            this._selectedIds = new Set();
        }
        Object.defineProperty(EventsManager.prototype, "pinnedIds", {
            get: function () {
                return this._pinnedIds;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsManager.prototype, "selectedIds", {
            get: function () {
                return this._selectedIds;
            },
            enumerable: true,
            configurable: true
        });

        /***************************************************************************
        * Checking the state of events.
        *************************************************************************/
        /**
        * Returns true if the event Id is pinned. That is, if its popup is opened
        * and has been dragged from sidebar.
        */
        EventsManager.prototype.eventIdIsPinned = function (eventId) {
            return this._pinnedIds.contains(eventId);
        };

        /**
        * Returns true if the event Id is the main one opened. That is, it is the
        * one in the sidebar.
        */
        EventsManager.prototype.eventIdIsMain = function (eventId) {
            return this.eventIdIsSelected(eventId) && !this.eventIdIsPinned(eventId);
        };

        /**
        * Returns true if the event Id is selected. That is, its popup is opened
        */
        EventsManager.prototype.eventIdIsSelected = function (eventId) {
            return this.selectedIds.contains(eventId);
        };

        /***************************************************************************
        * Manipulating the state of events.
        *************************************************************************/
        /**
        * Select the event with this ID. An event is considered selected when its
        * popup is opened.
        */
        EventsManager.prototype.selectEventWithId = function (eventId) {
            this.selectedIds.add(eventId);
            this.triggerSelectionChangeBrowserEvent(eventId);
        };

        /**
        * Deselect the event with this ID. By deselecting, you are also unpinning.
        * Call this when you are closing an event popup
        */
        EventsManager.prototype.deselectEventWithId = function (eventId) {
            this.pinnedIds.remove(eventId);
            this.selectedIds.remove(eventId);
            this.triggerSelectionChangeBrowserEvent(eventId);
        };

        /**
        * Pin a selected event. Throws an exception if the event is not selected.
        * Pinning means that the event popup is dragged from the sidebar.
        */
        EventsManager.prototype.pinEventWithId = function (eventId) {
            if (!this.eventIdIsSelected(eventId)) {
                throw new InvalidActionException('Event Id must first be selected before pinning');
            }
            this.pinnedIds.add(eventId);
            this.triggerSelectionChangeBrowserEvent(eventId);
        };

        /**
        * Unpin (but does not deselect) an event. Throws an exception if the event
        * is not selected. Unpinning means that the event popup has been dropped
        * back into the sidebar.
        */
        EventsManager.prototype.unpinEventWithId = function (eventId) {
            if (!this.eventIdIsSelected(eventId)) {
                throw new InvalidActionException('Cannot unpin an event that is not selected to begin with');
            }
            this.pinnedIds.remove(eventId);
            this.triggerSelectionChangeBrowserEvent(eventId);
        };

        /***************************************************************************
        * Getting available event Ids
        *************************************************************************/
        /**
        * Apply to all selected events. apply must have type
        * (string, boolean, boolean) => boolean. Returns false to break.
        */
        EventsManager.prototype.mapToSelectedEventIds = function (apply) {
            var selectedIdsArray = this.selectedIds.toArray();
            for (var i = 0; i < selectedIdsArray.length; ++i) {
                var eventId = selectedIdsArray[i];
                if (!apply(eventId, this.eventIdIsPinned(eventId), this.eventIdIsMain(eventId))) {
                    break;
                }
            }
        };

        /***************************************************************************
        * Helper functions
        *************************************************************************/
        EventsManager.prototype.triggerSelectionChangeBrowserEvent = function (eventId) {
            GlobalBrowserEventsManager.instance.triggerEvent(ReCalCommonBrowserEvents.eventSelectionChanged, {
                eventId: eventId
            });
        };
        return EventsManager;
    })();

    
    return EventsManager;
});
