define(["require", "exports", '../../../library/Core/InvalidActionException', '../ReCalCommonBrowserEvents', '../../../library/DataStructures/Set'], function(require, exports, InvalidActionException, ReCalCommonBrowserEvents, Set) {
    var EventsSelectionManager = (function () {
        function EventsSelectionManager(dependencies) {
            /**
            * Global Browser Events Manager
            */
            this._globalBrowserEventsManager = null;
            /**
            * An event is considered pinned if it is selected and if its popup has
            * been dragged from the sidebar.
            */
            this._pinnedIds = new Set();
            /**
            * An event is considered selected if it has a popup opened for it.
            */
            this._selectedIds = new Set();
            this._globalBrowserEventsManager = dependencies.globalBrowserEventsManager;
        }
        Object.defineProperty(EventsSelectionManager.prototype, "globalBrowserEventsManager", {
            get: function () {
                return this._globalBrowserEventsManager;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsSelectionManager.prototype, "pinnedIds", {
            get: function () {
                return this._pinnedIds;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsSelectionManager.prototype, "selectedIds", {
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
        EventsSelectionManager.prototype.eventIdIsPinned = function (eventId) {
            return this._pinnedIds.contains(eventId);
        };

        /**
        * Returns true if the event Id is the main one opened. That is, it is the
        * one in the sidebar.
        */
        EventsSelectionManager.prototype.eventIdIsMain = function (eventId) {
            return this.eventIdIsSelected(eventId) && !this.eventIdIsPinned(eventId);
        };

        /**
        * Returns true if the event Id is selected. That is, its popup is opened
        */
        EventsSelectionManager.prototype.eventIdIsSelected = function (eventId) {
            return this.selectedIds.contains(eventId);
        };

        /***************************************************************************
        * Manipulating the state of events.
        *************************************************************************/
        /**
        * Select the event with this ID. An event is considered selected when its
        * popup is opened.
        */
        EventsSelectionManager.prototype.selectEventWithId = function (eventId) {
            var selected = this.selectedIds.toArray();
            var changed = new Set();

            for (var i = 0; i < selected.length; ++i) {
                if (!this.eventIdIsPinned(selected[i])) {
                    this.selectedIds.remove(selected[i]);
                    changed.add(selected[i]);
                }
            }
            this.selectedIds.add(eventId);
            changed.add(eventId);
            this.triggerSelectionChangeBrowserEvent(changed.toArray());
        };

        /**
        * Deselect the event with this ID. By deselecting, you are also unpinning.
        * Call this when you are closing an event popup
        */
        EventsSelectionManager.prototype.deselectEventWithId = function (eventId) {
            this.pinnedIds.remove(eventId);
            this.selectedIds.remove(eventId);
            this.triggerSelectionChangeBrowserEvent([eventId]);
        };

        /**
        * Pin a selected event. Throws an exception if the event is not selected.
        * Pinning means that the event popup is dragged from the sidebar.
        */
        EventsSelectionManager.prototype.pinEventWithId = function (eventId) {
            if (!this.eventIdIsSelected(eventId)) {
                // the case where we go straight to pinning, skipping the select step
                this.selectedIds.add(eventId);
            }
            this.pinnedIds.add(eventId);
            this.triggerSelectionChangeBrowserEvent([eventId]);
        };

        /**
        * Unpin (but does not deselect) an event. Throws an exception if the event
        * is not selected. Unpinning means that the event popup has been dropped
        * back into the sidebar.
        */
        EventsSelectionManager.prototype.unpinEventWithId = function (eventId) {
            if (!this.eventIdIsSelected(eventId)) {
                throw new InvalidActionException('Cannot unpin an event that is not selected to begin with');
            }
            this.pinnedIds.remove(eventId);
            this.triggerSelectionChangeBrowserEvent([eventId]);
        };

        /***************************************************************************
        * Helper functions
        *************************************************************************/
        EventsSelectionManager.prototype.triggerSelectionChangeBrowserEvent = function (eventIds) {
            this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventSelectionChanged, {
                eventIds: eventIds
            });
        };
        return EventsSelectionManager;
    })();

    
    return EventsSelectionManager;
});
