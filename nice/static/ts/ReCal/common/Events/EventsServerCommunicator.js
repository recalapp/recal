define(["require", "exports", '../../../library/Color/Color', '../../../library/Core/ComparableResult', '../../../library/DateTime/DateTime', '../../../library/DataStructures/Dictionary', './EventsModel', '../ReCalCommonBrowserEvents', '../../../library/Timer/RepeatingTimer', '../../../library/Server/ServerConnection', '../../../library/Server/ServerRequest', '../../../library/Server/ServerRequestType'], function(require, exports, Color, ComparableResult, DateTime, Dictionary, EventsModel, ReCalCommonBrowserEvents, RepeatingTimer, ServerConnection, ServerRequest, ServerRequestType) {
    var EventsServerCommunicator = (function () {
        function EventsServerCommunicator(dependencies) {
            var _this = this;
            this._serverConnection = new ServerConnection(1);
            this._lastConnected = DateTime.fromUnix(0);
            this._eventsStoreCoordinator = null;
            this._eventsVisibilityManager = null;
            this._eventsModificationsManager = null;
            /**
            * Global Browser Events Manager
            */
            this._globalBrowserEventsManager = null;
            this._eventsModificationsManager = dependencies.eventsModificationsManager;
            this._eventsStoreCoordinator = dependencies.eventsStoreCoordinator;
            this._eventsVisibilityManager = dependencies.eventsVisibilityManager;
            this._globalBrowserEventsManager = dependencies.globalBrowserEventsManager;
            new RepeatingTimer(function () {
                _this.pushAndPullEvents();
            }, 30 * 1000, {
                idleInterval: 5 * 60 * 1000,
                idleTimeout: 30 * 1000
            });
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

        Object.defineProperty(EventsServerCommunicator.prototype, "eventsModificationsManager", {
            get: function () {
                return this._eventsModificationsManager;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsServerCommunicator.prototype, "globalBrowserEventsManager", {
            get: function () {
                return this._globalBrowserEventsManager;
            },
            enumerable: true,
            configurable: true
        });

        EventsServerCommunicator.prototype.pushAndPullEvents = function () {
            // TODO finish implementing.
            this.pushModifiedEvents(); // serverConnection takes care of queueing
            this.pullEvents();
        };

        EventsServerCommunicator.prototype.pushModifiedEvents = function () {
            var _this = this;
            if (!this.eventsModificationsManager.hasModifiedEvents() && !this.eventsVisibilityManager.visibilityChanged) {
                return;
            }
            var createServerRequest = function () {
                _this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsWillBeginUploading);
                var paramsDict = new Dictionary();
                var modifiedEvents = _this.eventsModificationsManager.getModifiedEvents().map(function (eventsModel) {
                    return _this.getLegacyEventObjectFromEventsModel(eventsModel);
                });
                paramsDict.set('events', JSON.stringify(modifiedEvents));
                paramsDict.set('hidden', JSON.stringify(_this.eventsVisibilityManager.hiddenEventIds));

                // TODO hidden events
                var request = new ServerRequest({
                    url: "/put",
                    async: true,
                    parameters: paramsDict,
                    requestType: 1 /* post */
                });
                return request;
            };
            this.serverConnection.sendRequestLazilyConstructed(createServerRequest).done(function (data) {
                // clear modifications history
                _this.eventsModificationsManager.clearModificationsHistory();

                // clear hidden events history
                _this.eventsVisibilityManager.resetEventVisibilityToHiddenEventIds(_this.eventsVisibilityManager.hiddenEventIds);
                for (var oldId in data.changed_ids) {
                    var newId = data.changed_ids[oldId][0];
                    var newGroupId = data.changed_ids[oldId][1];
                    _this.eventsStoreCoordinator.remapEventId(oldId, newId, newGroupId);
                }
                _this.eventsStoreCoordinator.clearLocalEventsWithIds(data.deleted_ids);
                _this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDidFinishUploading);
            }).fail(function () {
                _this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDidFailUploading);
            });
        };

        EventsServerCommunicator.prototype.pullEvents = function () {
            var _this = this;
            var createServerRequest = function () {
                _this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsWillBeginDownloading);
                var serverRequest = new ServerRequest({
                    url: '/get/' + _this.lastConnected.unix,
                    async: true,
                    parameters: new Dictionary(),
                    requestType: 0 /* get */
                });
                return serverRequest;
            };
            this.serverConnection.sendRequestLazilyConstructed(createServerRequest).done(function (data) {
                if (_this.eventsModificationsManager.hasModifiedEvents() || _this.eventsVisibilityManager.visibilityChanged) {
                    _this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDidFinishDownloading);
                    return;
                }

                // no events have been modified. check for events that have been deleted.
                var shouldDelete = _this.eventsStoreCoordinator.getEventIdsWithFilter(function (eventId) {
                    return {
                        keep: _this.eventsStoreCoordinator.getEventById(eventId).lastEdited.compareTo(_this.lastConnected) === 1 /* greater */,
                        stop: false
                    };
                });
                _this.eventsStoreCoordinator.clearLocalEventsWithIds(shouldDelete);

                // handle downloaded content
                // hidden events
                if (data.hidden_events) {
                    _this.eventsVisibilityManager.resetEventVisibilityToHiddenEventIds(data.hidden_events);
                }
                _this.lastConnected = new DateTime();
                var eventsModels = data.events.map(function (eventDict) {
                    // TODO handle the case where this event is currently being modified on the client (popup)
                    return _this.getEventsModelFromLegacyEventObject(eventDict);
                });
                _this.eventsStoreCoordinator.addLocalEvents(eventsModels);

                _this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDidFinishDownloading);
            }).fail(function (data) {
                _this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDidFailDownloading);
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
                lastEdited: DateTime.fromUnix(parseInt(legacyEventObject.modified_time)),
                eventGroupId: legacyEventObject.event_group_id.toString(),
                sectionColor: Color.fromHex(legacyEventObject.section_color),
                revisionId: legacyEventObject.revision_id
            });
        };

        EventsServerCommunicator.prototype.getLegacyEventObjectFromEventsModel = function (eventsModel) {
            return {
                event_id: eventsModel.eventId,
                event_group_id: eventsModel.eventGroupId,
                event_title: eventsModel.title,
                event_description: eventsModel.description,
                event_location: eventsModel.location,
                section_id: eventsModel.sectionId,
                course_id: eventsModel.courseId,
                event_type: eventsModel.eventTypeCode,
                event_start: eventsModel.startDate.unix.toString(),
                event_end: eventsModel.endDate.unix.toString(),
                modified_time: eventsModel.lastEdited.unix.toString(),
                section_color: eventsModel.sectionColor.hexValue,
                revision_id: eventsModel.revisionId
            };
        };
        return EventsServerCommunicator;
    })();

    

    
    return EventsServerCommunicator;
});
//# sourceMappingURL=EventsServerCommunicator.js.map
