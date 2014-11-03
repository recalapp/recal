define(["require", "exports", '../../../library/Core/ComparableResult', '../../../library/DataStructures/Set'], function(require, exports, ComparableResult, Set) {
    var EventsRetriever = (function () {
        function EventsRetriever(dependencies) {
            this._eventsStoreCoordinator = null;
            this._eventsVisibilityManager = null;
            this._courseBlacklist = null;
            this._eventsStoreCoordinator = dependencies.eventsStoreCoordinator;
            this._eventsVisibilityManager = dependencies.eventsVisibilityManager;
        }
        Object.defineProperty(EventsRetriever.prototype, "eventsStoreCoordinator", {
            get: function () {
                return this._eventsStoreCoordinator;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsRetriever.prototype, "eventsVisibilityManager", {
            get: function () {
                return this._eventsVisibilityManager;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsRetriever.prototype, "courseBlacklistSet", {
            get: function () {
                if (!this._courseBlacklist) {
                    this._courseBlacklist = new Set();
                }
                return this._courseBlacklist;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EventsRetriever.prototype, "courseBlacklist", {
            get: function () {
                return this.courseBlacklistSet.toArray();
            },
            set: function (value) {
                value = value || [];
                this._courseBlacklist = new Set(value);
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
                ret.keep = start.compareTo(eventsModel.startDate) === -1 /* less */ && end.compareTo(eventsModel.startDate) === 1 /* greater */ && !_this.eventsVisibilityManager.eventIdIsHidden(eventId) && !_this.courseBlacklistSet.contains(eventsModel.courseId);
                ret.stop = end.compareTo(eventsModel.startDate) === -1 /* less */;
                return ret;
            });
        };
        return EventsRetriever;
    })();

    
    return EventsRetriever;
});
