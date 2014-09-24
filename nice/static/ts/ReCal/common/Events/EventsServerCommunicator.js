define(["require", "exports", '../../../library/DateTime/DateTime', '../../../library/DataStructures/Dictionary', './EventsModel', '../../../library/Server/ServerConnection', '../../../library/Server/ServerRequest', '../../../library/Server/ServerRequestType'], function(require, exports, DateTime, Dictionary, EventsModel, ServerConnection, ServerRequest, ServerRequestType) {
    var EventsServerCommunicator = (function () {
        function EventsServerCommunicator(dependencies) {
            this._serverConnection = new ServerConnection(1);
            this._lastConnected = DateTime.fromUnix(0);
            this._eventsStoreCoordinator = null;
            this._eventsVisibilityManager = null;
            this._eventsStoreCoordinator = dependencies.eventsStoreCoordinator;
            this._eventsVisibilityManager = dependencies.eventsVisibilityManager;
        }
        Object.defineProperty(EventsServerCommunicator.prototype, "serverConnection", {
            get: function () {
                return this._serverConnection;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsServerCommunicator.prototype, "lastConnected", {
            get: function () {
                return this._lastConnected;
            },
            set: function (value) {
                this._lastConnected = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsServerCommunicator.prototype, "eventsStoreCoordinator", {
            get: function () {
                return this._eventsStoreCoordinator;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsServerCommunicator.prototype, "eventsVisibilityManager", {
            get: function () {
                return this._eventsVisibilityManager;
            },
            enumerable: true,
            configurable: true
        });

        EventsServerCommunicator.prototype.pullEvents = function () {
            var _this = this;
            var createServerRequest = function () {
                var serverRequest = new ServerRequest({
                    url: '/get/' + _this.lastConnected.unix,
                    async: true,
                    parameters: new Dictionary(),
                    requestType: 0 /* get */
                });
                return serverRequest;
            };
            this.serverConnection.sendRequest(createServerRequest()).done(function (data) {
                if (_this.lastConnected.unix === 0) {
                    _this.eventsStoreCoordinator.clearLocalEvents();
                }
                _this.lastConnected = new DateTime();
                var eventsModels = new Array();
                for (var i = 0; i < data.events.length; ++i) {
                    // TODO handle uncommitted and updated events
                    eventsModels.push(_this.getEventsModelFromLegacyEventObject(data.events[i]));
                }
                _this.eventsStoreCoordinator.addLocalEvents(eventsModels);

                // hidden events
                if (data.hidden_events) {
                    _this.eventsVisibilityManager.resetEventVisibilityToHiddenEventIds(data.hidden_events);
                }
            }).fail(function (data) {
            });
        };

        EventsServerCommunicator.prototype.getEventsModelFromLegacyEventObject = function (legacyEventObject) {
            return new EventsModel({
                eventId: legacyEventObject.event_id.toString(),
                title: legacyEventObject.event_title,
                description: legacyEventObject.event_description,
                location: legacyEventObject.event_location,
                sectionId: legacyEventObject.section_id.toString(),
                courseId: legacyEventObject.course_id.toString(),
                eventTypeCode: legacyEventObject.event_type,
                startDate: DateTime.fromUnix(parseInt(legacyEventObject.event_start)),
                endDate: DateTime.fromUnix(parseInt(legacyEventObject.event_end)),
                lastEdited: DateTime.fromUnix(parseInt(legacyEventObject.modified_time))
            });
        };
        return EventsServerCommunicator;
    })();

    
    return EventsServerCommunicator;
});
