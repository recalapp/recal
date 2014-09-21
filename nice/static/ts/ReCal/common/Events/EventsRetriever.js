define(["require", "exports", '../../../library/Core/ComparableResult'], function(require, exports, ComparableResult) {
    // TODO implement
    var EventsRetriever = (function () {
        function EventsRetriever(dependencies) {
            this._eventsStoreCoordinator = null;
            this._eventsStoreCoordinator = dependencies.eventsStoreCoordinator;
        }
        Object.defineProperty(EventsRetriever.prototype, "eventsStoreCoordinator", {
            get: function () {
                return this._eventsStoreCoordinator;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Get event associated with the ID
        */
        EventsRetriever.prototype.getEventById = function (eventId) {
            return this.eventsStoreCoordinator.getEventById(eventId);
        };

        /**
        * Get all event IDs in the range, inclusive.
        */
        EventsRetriever.prototype.getEventIdsInRange = function (start, end) {
            var _this = this;
            return this.eventsStoreCoordinator.getEventIdsWithFilter(function (eventId) {
                var eventsModel = _this.getEventById(eventId);
                var ret = { keep: false, stop: false };
                ret.keep = start.compareTo(eventsModel.startDate) === -1 /* less */ && end.compareTo(eventsModel.startDate) === 1 /* greater */;
                ret.stop = end.compareTo(eventsModel.startDate) === -1 /* less */;
                return ret;
            });
        };
        return EventsRetriever;
    })();

    
    return EventsRetriever;
});
