define(["require", "exports", '../../../library/DateTime/DateTime', './EventsModel'], function(require, exports, DateTime, EventsModel) {
    // TODO implement
    var EventsRetriever = (function () {
        function EventsRetriever() {
        }
        /**
        * Get event associated with the ID
        */
        EventsRetriever.prototype.getEventById = function (eventId) {
            var legacyEventObject = EventsMan_getEventByID(eventId);
            return this.getEventsModelFromLegacyEventObject(legacyEventObject);
        };

        /**
        * Get all event IDs in the range, inclusive.
        */
        EventsRetriever.prototype.getEventIdsInRange = function (start, end) {
            return EventsMan_getEventIDForRange(start.unix, end.unix);
        };

        EventsRetriever.prototype.getEventsModelFromLegacyEventObject = function (legacyEventObject) {
            return new EventsModel({
                eventId: legacyEventObject.event_id.toString(),
                title: legacyEventObject.event_title,
                description: legacyEventObject.event_description,
                sectionId: legacyEventObject.section_id.toString(),
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
