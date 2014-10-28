define(["require", "exports", '../../../library/DataStructures/Dictionary', '../ReCalCommonBrowserEvents'], function(require, exports, Dictionary, ReCalCommonBrowserEvents) {
    /**
    * The class responsible to actually storing the events locally.
    * This class is also responsible for keeping track of which events have been
    * modified.
    */
    var EventsStoreCoordinator = (function () {
        function EventsStoreCoordinator(dependencies) {
            this._eventsRegistry = null;
            this._eventIdsSorted = null;
            /**
            * Global Browser Events Manager
            */
            this._globalBrowserEventsManager = null;
            this._globalBrowserEventsManager = dependencies.globalBrowserEventsManager;
            this.clearLocalEvents();
        }
        Object.defineProperty(EventsStoreCoordinator.prototype, "eventsRegistry", {
            get: function () {
                return this._eventsRegistry;
            },
            set: function (value) {
                this._eventsRegistry = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(EventsStoreCoordinator.prototype, "eventIdsSorted", {
            get: function () {
                var _this = this;
                if (this._eventIdsSorted === null || this._eventIdsSorted === undefined) {
                    this._eventIdsSorted = this.eventsRegistry.allKeys();
                    this._eventIdsSorted.sort(function (a, b) {
                        var eventA = _this.eventsRegistry.get(a);
                        var eventB = _this.eventsRegistry.get(b);
                        return eventA.startDate.unix - eventB.startDate.unix;
                    });
                }
                return this._eventIdsSorted;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsStoreCoordinator.prototype, "globalBrowserEventsManager", {
            get: function () {
                return this._globalBrowserEventsManager;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Add the specified events to the events store. If an existing event with
        * the same id exists, this replaces it.
        */
        EventsStoreCoordinator.prototype.addLocalEvents = function (eventsModels) {
            for (var i = 0; i < eventsModels.length; ++i) {
                this.eventsRegistry.set(eventsModels[i].eventId, eventsModels[i]);
            }
            this.eventsDataChanged();
        };

        /**
        * Delete any events in the specified list of IDs. This function can safely
        * be called with event IDs that do not exist.
        */
        EventsStoreCoordinator.prototype.clearLocalEventsWithIds = function (eventIds) {
            for (var i = 0; i < eventIds.length; ++i) {
                if (this.eventsRegistry.contains(eventIds[i])) {
                    this.eventsRegistry.unset(eventIds[i]);
                }
            }
            this.eventsDataChanged();
        };

        /**
        * Clear out the local event store.
        */
        EventsStoreCoordinator.prototype.clearLocalEvents = function () {
            this.eventsRegistry = new Dictionary();
            this.eventsDataChanged();
        };

        /**
        * Rewrite the event id of an event
        * @param oldId
        * @param newId
        * @param newGroupId
        */
        EventsStoreCoordinator.prototype.remapEventId = function (oldId, newId, newGroupId) {
            var eventsModel = this.getEventById(oldId);
            if (eventsModel) {
                eventsModel.eventId = newId;
                eventsModel.eventGroupId = newGroupId;
                this.eventsRegistry.unset(oldId);
                this.eventsRegistry.set(newId, eventsModel);
                this._eventIdsSorted = null;
                this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventIdChanged, {
                    oldId: oldId,
                    eventsModel: eventsModel
                });
            }
        };

        /**
        * Get event associated with the ID
        */
        EventsStoreCoordinator.prototype.getEventById = function (eventId) {
            return this.eventsRegistry.get(eventId);
        };

        EventsStoreCoordinator.prototype.getEventIdsWithFilter = function (filter) {
            var ret = new Array();
            for (var i = 0; i < this.eventIdsSorted.length; ++i) {
                var result = filter(this.eventIdsSorted[i]);
                if (result.keep) {
                    ret.push(this.eventIdsSorted[i]);
                }
                if (result.stop) {
                    break;
                }
            }
            return ret;
        };

        EventsStoreCoordinator.prototype.eventsDataChanged = function () {
            this._eventIdsSorted = null;
            this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDataChanged);
        };
        return EventsStoreCoordinator;
    })();

    
    return EventsStoreCoordinator;
});
