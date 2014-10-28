define(["require", "exports", '../../../library/Color/Color', '../../../library/DateTime/DateTime', './EventsModel', '../../../library/DataStructures/Set'], function(require, exports, Color, DateTime, EventsModel, Set) {
    var EventsModificationsManager = (function () {
        function EventsModificationsManager(dependencies) {
            this._addedEventsCount = 0;
            this._modifiedEventIds = null;
            this._eventsStoreCoordinator = null;
            this._eventsStoreCoordinator = dependencies.eventsStoreCoordinator;
            this.clearModificationsHistory();
        }
        Object.defineProperty(EventsModificationsManager.prototype, "addedEventsCount", {
            get: function () {
                return this._addedEventsCount;
            },
            set: function (value) {
                this._addedEventsCount = value;
            },
            enumerable: true,
            configurable: true
        });

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

        /**
        * Creates a new event
        */
        EventsModificationsManager.prototype.createNewEventsModelForUser = function (user) {
            var eventId = (++this.addedEventsCount * -1).toString();
            var sectionId = '-1';
            var courseId = '-1';
            var color = new Color();
            if (user.enrolledCoursesModels.length > 0) {
                var course = user.enrolledCoursesModels[0];
                courseId = course.courseId;
                sectionId = course.sectionsModels[0].sectionId;
                color = course.sectionsModels[0].color;
            }
            var eventTypeCode = 'LE';
            if (user.eventTypes.allKeys().length > 0) {
                eventTypeCode = user.eventTypes.allKeys()[0];
            }
            var startDate = new DateTime();
            if (startDate.hours == 23) {
                startDate.hours = 18;
            }
            startDate.seconds = 0;
            var endDate = new DateTime(startDate);
            endDate.minutes += 50;
            return new EventsModel({
                eventId: eventId,
                title: 'Title',
                description: 'Add a description...',
                location: 'Location',
                sectionId: sectionId,
                courseId: courseId,
                eventTypeCode: eventTypeCode,
                startDate: startDate,
                endDate: endDate,
                lastEdited: new DateTime(),
                eventGroupId: eventId,
                sectionColor: color,
                revisionId: eventId
            });
        };
        return EventsModificationsManager;
    })();

    
    return EventsModificationsManager;
});
