define(["require", "exports", './EventsModificationsManager', './EventsRetriever', './EventsSelectionManager', './EventsServerCommunicator', './EventsStoreCoordinator', './EventsVisibilityManager'], function(require, exports, EventsModificationsManager, EventsRetriever, EventsSelectionManager, EventsServerCommunicator, EventsStoreCoordinator, EventsVisibilityManager) {
    /**
    * IEventsOperationsFacade is the class responsible for all operations
    * related to events in the persepective of any events client. That is, to
    * any non-model classes, IEventsOperationsFacade will serve as the single
    * gateway to getting information about events.
    */
    var EventsOperationsFacade = (function () {
        function EventsOperationsFacade(dependencies) {
            this._eventsStoreCoordinator = null;
            this._eventsServerCommunicator = null;
            this._eventsVisibilityManager = null;
            /**
            * Events Modifications Manager
            */
            this._eventsModificationsManager = null;
            /**
            * Global Browser Events Manager
            */
            this._globalBrowserEventsManager = null;
            /***************************************************************************
            * Event Retrieval
            *************************************************************************/
            this._eventsRetriever = null;
            /***************************************************************************
            * Event Selection
            *************************************************************************/
            this._eventsSelectionManager = null;
            this._globalBrowserEventsManager = dependencies.globalBrowserEventsManager;
            this.eventsServerCommunicator.pullEvents();
        }
        Object.defineProperty(EventsOperationsFacade.prototype, "eventsStoreCoordinator", {
            get: function () {
                if (!this._eventsStoreCoordinator) {
                    this._eventsStoreCoordinator = new EventsStoreCoordinator({
                        globalBrowserEventsManager: this.globalBrowserEventsManager
                    });
                }
                return this._eventsStoreCoordinator;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsOperationsFacade.prototype, "eventsServerCommunicator", {
            get: function () {
                if (!this._eventsServerCommunicator) {
                    this._eventsServerCommunicator = new EventsServerCommunicator({
                        eventsStoreCoordinator: this.eventsStoreCoordinator,
                        eventsVisibilityManager: this.eventsVisibilityManager
                    });
                }
                return this._eventsServerCommunicator;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsOperationsFacade.prototype, "eventsVisibilityManager", {
            get: function () {
                if (!this._eventsVisibilityManager) {
                    this._eventsVisibilityManager = new EventsVisibilityManager();
                }
                return this._eventsVisibilityManager;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsOperationsFacade.prototype, "eventsModificationsManager", {
            get: function () {
                if (!this._eventsModificationsManager) {
                    this._eventsModificationsManager = new EventsModificationsManager({
                        eventsStoreCoordinator: this.eventsStoreCoordinator
                    });
                }
                return this._eventsModificationsManager;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsOperationsFacade.prototype, "globalBrowserEventsManager", {
            get: function () {
                return this._globalBrowserEventsManager;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsOperationsFacade.prototype, "eventsRetriever", {
            get: function () {
                if (this._eventsRetriever === null || this._eventsRetriever === undefined) {
                    this._eventsRetriever = new EventsRetriever({
                        eventsStoreCoordinator: this.eventsStoreCoordinator,
                        eventsVisibilityManager: this.eventsVisibilityManager
                    });
                }
                return this._eventsRetriever;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Get event associated with the ID
        */
        EventsOperationsFacade.prototype.getEventById = function (eventId) {
            return this.eventsRetriever.getEventById(eventId);
        };

        /**
        * Get all event IDs in the range, inclusive.
        */
        EventsOperationsFacade.prototype.getEventIdsInRange = function (start, end) {
            return this.eventsRetriever.getEventIdsInRange(start, end);
        };

        Object.defineProperty(EventsOperationsFacade.prototype, "eventsSelectionManager", {
            get: function () {
                if (this._eventsSelectionManager === null || this._eventsSelectionManager === undefined) {
                    this._eventsSelectionManager = new EventsSelectionManager({
                        globalBrowserEventsManager: this.globalBrowserEventsManager
                    });
                }
                return this._eventsSelectionManager;
            },
            enumerable: true,
            configurable: true
        });

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

        /***************************************************************************
        * Event Modification
        *************************************************************************/
        /**
        * Tells the events module that an event has been modified to be
        * modifiedEventsModel
        */
        EventsOperationsFacade.prototype.commitModifiedEvent = function (modifiedEventsModel) {
            this.eventsModificationsManager.commitModifiedEvent(modifiedEventsModel);
        };
        return EventsOperationsFacade;
    })();

    
    return EventsOperationsFacade;
});
