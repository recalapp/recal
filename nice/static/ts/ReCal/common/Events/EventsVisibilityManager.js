define(["require", "exports", '../ReCalCommonBrowserEvents', '../../../library/DataStructures/Set'], function(require, exports, ReCalCommonBrowserEvents, Set) {
    /**
    * EventsVisibilityManager deals with the visibility of events. An event may be
    * hidden because a user explicitly selected it to be hidden, or because its
    * course is not currently shown on the calendar according to the user's
    * preferences.
    */
    var EventsVisibilityManager = (function () {
        function EventsVisibilityManager(dependencies) {
            this._hiddenEventIds = new Set();
            /**
            * Global Browser Events Manager
            */
            this._globalBrowserEventsManager = null;
            this._globalBrowserEventsManager = dependencies.globalBrowserEventsManager;
        }
        Object.defineProperty(EventsVisibilityManager.prototype, "hiddenEventIds", {
            get: function () {
                return this._hiddenEventIds;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsVisibilityManager.prototype, "globalBrowserEventsManager", {
            get: function () {
                return this._globalBrowserEventsManager;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Hide the event associated with this ID. This is used for when the user
        * explicitly clicks on the hide button.
        */
        EventsVisibilityManager.prototype.hideEventWithId = function (eventId) {
            this.hiddenEventIds.add(eventId);
            this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDataChanged);
        };

        /**
        * Unhide the event associated with this ID. Safe to call on an event that
        * hasn't been hidden.
        */
        EventsVisibilityManager.prototype.unhideEventWithId = function (eventId) {
            if (this.hiddenEventIds.contains(eventId)) {
                this.hiddenEventIds.remove(eventId);
                this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDataChanged);
            }
        };

        /**
        * Returns true if the event should be hidden.
        */
        EventsVisibilityManager.prototype.eventIdIsHidden = function (eventId) {
            // TODO calculate visibility based on other information, such as user
            // preferences.
            return this.hiddenEventIds.contains(eventId);
        };

        /**
        * Used to quickly reset event visibility so that hiddenIds are the only
        * hidden events.
        */
        EventsVisibilityManager.prototype.resetEventVisibilityToHiddenEventIds = function (hiddenIds) {
            this._hiddenEventIds = new Set(hiddenIds);
        };
        return EventsVisibilityManager;
    })();

    
    return EventsVisibilityManager;
});
//# sourceMappingURL=EventsVisibilityManager.js.map
