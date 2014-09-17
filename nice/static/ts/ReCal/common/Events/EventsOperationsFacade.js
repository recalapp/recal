define(["require", "exports", './EventsSelectionManager'], function(require, exports, EventsSelectionManager) {
    /**
    * IEventsOperationsFacade is the class responsible for all operations
    * related to events in the persepective of any events client. That is, to
    * any non-model classes, IEventsOperationsFacade will serve as the single
    * gateway to getting information about events.
    */
    var EventsOperationsFacade = (function () {
        function EventsOperationsFacade() {
            this._eventsSelectionManager = null;
        }
        Object.defineProperty(EventsOperationsFacade.prototype, "eventsSelectionManager", {
            get: function () {
                if (this._eventsSelectionManager === null || this._eventsSelectionManager === undefined) {
                    this._eventsSelectionManager = new EventsSelectionManager();
                }
                return this._eventsSelectionManager;
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
        EventsOperationsFacade.prototype.eventIdIsPinned = function (eventId) {
            return this.eventsSelectionManager.eventIdIsPinned(eventId);
        };

        /**
        * Returns true if the event Id is the main one opened. That is, it is the
        * one in the sidebar.
        */
        EventsOperationsFacade.prototype.eventIdIsMain = function (eventId) {
            return this.eventsSelectionManager.eventIdIsMain(eventId);
        };

        /**
        * Returns true if the event Id is selected. That is, its popup is opened
        */
        EventsOperationsFacade.prototype.eventIdIsSelected = function (eventId) {
            return this.eventsSelectionManager.eventIdIsSelected(eventId);
        };

        /***************************************************************************
        * Manipulating the state of events.
        *************************************************************************/
        /**
        * Select the event with this ID. An event is considered selected when its
        * popup is opened.
        */
        EventsOperationsFacade.prototype.selectEventWithId = function (eventId) {
            this.eventsSelectionManager.selectEventWithId(eventId);
        };

        /**
        * Deselect the event with this ID. By deselecting, you are also unpinning.
        * Call this when you are closing an event popup
        */
        EventsOperationsFacade.prototype.deselectEventWithId = function (eventId) {
            this.eventsSelectionManager.deselectEventWithId(eventId);
        };

        /**
        * Pin a selected event. Throws an exception if the event is not selected.
        * Pinning means that the event popup is dragged from the sidebar.
        */
        EventsOperationsFacade.prototype.pinEventWithId = function (eventId) {
            this.eventsSelectionManager.pinEventWithId(eventId);
        };

        /**
        * Unpin (but does not deselect) an event. Throws an exception if the event
        * is not selected. Unpinning means that the event popup has been dropped
        * back into the sidebar.
        */
        EventsOperationsFacade.prototype.unpinEventWithId = function (eventId) {
            this.eventsSelectionManager.unpinEventWithId(eventId);
        };
        return EventsOperationsFacade;
    })();

    
    return EventsOperationsFacade;
});
