define(["require", "exports", '../../../library/DataStructures/Set'], function(require, exports, Set) {
    var EventsModificationsManager = (function () {
        function EventsModificationsManager(dependencies) {
            this._modifiedEventIds = null;
            this._eventsStoreCoordinator = null;
            this._eventsStoreCoordinator = dependencies.eventsStoreCoordinator;
            this.clearModificationsHistory();
        }
        Object.defineProperty(EventsModificationsManager.prototype, "modifiedEventIds", {
            get: function () {
                return this._modifiedEventIds;
            },
            set: function (value) {
                this._modifiedEventIds = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(EventsModificationsManager.prototype, "eventsStoreCoordinator", {
            get: function () {
                return this._eventsStoreCoordinator;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Clear out the history of modified events.
        */
        EventsModificationsManager.prototype.clearModificationsHistory = function () {
            this.modifiedEventIds = new Set();
        };

        /**
        * returns true if there are modified events
        */
        EventsModificationsManager.prototype.hasModifiedEvents = function () {
            return this.modifiedEventIds && this.modifiedEventIds.size() > 0;
        };

        /**
        * Tells the events module that an event has been modified to be
        * modifiedEventsModel
        */
        EventsModificationsManager.prototype.commitModifiedEvent = function (modifiedEventsModel) {
            this.modifiedEventIds.add(modifiedEventsModel.eventId);
            this.eventsStoreCoordinator.addLocalEvents([modifiedEventsModel]);
        };

        EventsModificationsManager.prototype.getModifiedEvents = function () {
            var _this = this;
            return this.modifiedEventIds.toArray().map(function (eventId) {
                return _this.eventsStoreCoordinator.getEventById(eventId);
            });
        };
        return EventsModificationsManager;
    })();

    
    return EventsModificationsManager;
});
//# sourceMappingURL=EventsModificationsManager.js.map
