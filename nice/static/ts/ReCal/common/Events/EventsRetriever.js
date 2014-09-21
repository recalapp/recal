define(["require", "exports", '../../../library/Core/ComparableResult', '../../../library/DateTime/DateTime', './EventsModel'], function(require, exports, ComparableResult, DateTime, EventsModel) {
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

        EventsRetriever.prototype.getEventsModelFromLegacyEventObject = function (legacyEventObject) {
            return new EventsModel({
                eventId: legacyEventObject.event_id.toString(),
                title: legacyEventObject.event_title,
                description: legacyEventObject.event_description,
                sectionId: legacyEventObject.section_id.toString(),
                courseId: legacyEventObject.course_id.toString(),
                eventTypeCode: legacyEventObject.event_type,
                startDate: DateTime.fromUnix(parseInt(legacyEventObject.event_start)),
                endDate: DateTime.fromUnix(parseInt(legacyEventObject.event_end)),
                lastEdited: DateTime.fromUnix(parseInt(legacyEventObject.modified_time))
            });
        };
        return EventsRetriever;
    })();

    
    return EventsRetriever;
});
