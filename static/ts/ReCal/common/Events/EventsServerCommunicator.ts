import Color = require('../../../library/Color/Color');
import ComparableResult = require('../../../library/Core/ComparableResult');
import DateTime = require('../../../library/DateTime/DateTime');
import Dictionary = require('../../../library/DataStructures/Dictionary');
import Events = require('./Events');
import EventsModel = require('./EventsModel');
import EventsModificationsManager = require('./EventsModificationsManager');
import EventsStoreCoordinator = require('./EventsStoreCoordinator');
import EventsVisibilityManager = require('./EventsVisibilityManager');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import ReCalCommonBrowserEvents = require('../ReCalCommonBrowserEvents');
import RepeatingTimer = require('../../../library/Timer/RepeatingTimer');
import Server = require('../../../library/Server/Server');
import ServerConnection = require('../../../library/Server/ServerConnection');
import ServerRequest = require('../../../library/Server/ServerRequest');
import ServerRequestType = require('../../../library/Server/ServerRequestType');

import IEventsModel = Events.IEventsModel;
import IServerConnection = Server.IServerConnection;
import IServerRequest = Server.IServerRequest;

class EventsServerCommunicator
{
    private _serverConnection: IServerConnection = new ServerConnection(1);
    private get serverConnection(): IServerConnection { return this._serverConnection; }

    private _lastConnected: DateTime = DateTime.fromUnix(0);
    private get lastConnected(): DateTime { return this._lastConnected }

    private set lastConnected(value: DateTime) { this._lastConnected = value; }

    private _eventsStoreCoordinator: EventsStoreCoordinator = null;
    private get eventsStoreCoordinator(): EventsStoreCoordinator { return this._eventsStoreCoordinator; }

    private _eventsVisibilityManager: EventsVisibilityManager = null;
    private get eventsVisibilityManager(): EventsVisibilityManager { return this._eventsVisibilityManager; }

    private _eventsModificationsManager: EventsModificationsManager = null;
    private get eventsModificationsManager(): EventsModificationsManager { return this._eventsModificationsManager; }

    /**
     * Global Browser Events Manager
     */
    private _globalBrowserEventsManager: GlobalBrowserEventsManager = null;
    private get globalBrowserEventsManager(): GlobalBrowserEventsManager { return this._globalBrowserEventsManager; }

    constructor(dependencies: Events.EventsServerCommunicatorDependencies)
    {
        this._eventsModificationsManager = dependencies.eventsModificationsManager;
        this._eventsStoreCoordinator = dependencies.eventsStoreCoordinator;
        this._eventsVisibilityManager = dependencies.eventsVisibilityManager;
        this._globalBrowserEventsManager = dependencies.globalBrowserEventsManager;
        new RepeatingTimer(()=>{
            this.pushAndPullEvents();
        }, 30 * 1000, {
            idleInterval: 5 * 60 * 1000,
            idleTimeout: 30 * 1000
        })
    }

    private pushAndPullEvents(): void
    {
        // TODO finish implementing.
        this.pushModifiedEvents(); // serverConnection takes care of queueing
        this.pullEvents();
    }

    public pushModifiedEvents()
    {
        if (!this.eventsModificationsManager.hasModifiedEvents() && !this.eventsVisibilityManager.visibilityChanged)
        {
            return;
        }
        var createServerRequest = ()=>
        {
            this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsWillBeginUploading);
            var paramsDict = new Dictionary<string, string>();
            var modifiedEvents = this.eventsModificationsManager.getModifiedEvents().map((eventsModel: IEventsModel)=>{
                return this.getLegacyEventObjectFromEventsModel(eventsModel);
            });
            paramsDict.set('events', JSON.stringify(modifiedEvents));
            paramsDict.set('hidden', JSON.stringify(this.eventsVisibilityManager.hiddenEventIds));
            // TODO hidden events
            var request = new ServerRequest({
                url: "/put",
                async: true,
                parameters: paramsDict,
                requestType: ServerRequestType.post
            });
            return request;
        };
        this.serverConnection.sendRequestLazilyConstructed(createServerRequest)
            .done((data: {changed_ids: EventIdChangeMap; deleted_ids: string[]})=>{
                // clear modifications history
                this.eventsModificationsManager.clearModificationsHistory();
                // clear hidden events history
                this.eventsVisibilityManager.resetEventVisibilityToHiddenEventIds(this.eventsVisibilityManager.hiddenEventIds);
                for (var oldId in data.changed_ids)
                {
                    var newId = data.changed_ids[oldId][0];
                    var newGroupId = data.changed_ids[oldId][1];
                    this.eventsStoreCoordinator.remapEventId(oldId, newId, newGroupId);
                }
                this.eventsStoreCoordinator.clearLocalEventsWithIds(data.deleted_ids);
                this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDidFinishUploading);
            })
            .fail(()=>{
                this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDidFailUploading);
            });
    }

    public pullEvents(): void
    {
        var createServerRequest = ()=>
        {
            this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsWillBeginDownloading);
            var serverRequest = new ServerRequest({
                url: '/get/' + this.lastConnected.unix,
                async: true,
                parameters: new Dictionary<string, string>(),
                requestType: ServerRequestType.get,
            });
            return serverRequest;
        };
        this.serverConnection.sendRequestLazilyConstructed(createServerRequest)
            .done((data: {events: LegacyEventObject[]; hidden_events: string[]}) =>
            {
                if (this.eventsModificationsManager.hasModifiedEvents() || this.eventsVisibilityManager.visibilityChanged)
                {
                    this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDidFinishDownloading);
                    return; // cancel pull if there are modified events
                }
                // no events have been modified. check for events that have been deleted.
                var shouldDelete = this.eventsStoreCoordinator.getEventIdsWithFilter((eventId: string)=>{
                    return {
                                keep: this.eventsStoreCoordinator.getEventById(eventId).lastEdited.compareTo(this.lastConnected) === ComparableResult.greater,
                                stop: false,
                           };
                });
                this.eventsStoreCoordinator.clearLocalEventsWithIds(shouldDelete);

                // handle downloaded content
                // hidden events
                if (data.hidden_events)
                {
                    this.eventsVisibilityManager.resetEventVisibilityToHiddenEventIds(data.hidden_events);
                }
                this.lastConnected = new DateTime();
                var eventsModels = data.events.map((eventDict: LegacyEventObject)=>{
                    // TODO handle the case where this event is currently being modified on the client (popup)
                    return this.getEventsModelFromLegacyEventObject(eventDict);
                });
                this.eventsStoreCoordinator.addLocalEvents(eventsModels);

                this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDidFinishDownloading);
            }).fail((data: any) =>
            {
                this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsDidFailDownloading);
            });
    }

    private getEventsModelFromLegacyEventObject(legacyEventObject: LegacyEventObject): IEventsModel
    {
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
    }

    private getLegacyEventObjectFromEventsModel(eventsModel: IEventsModel): LegacyEventObject
    {
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
            revision_id: eventsModel.revisionId,
        };
    }
}

interface EventIdChangeMap
{
    [oldId: string]: string[];
}

// TODO this is incomplete
interface LegacyEventObject
{
    event_id: string;
    event_group_id: string;
    event_title: string;
    event_description: string;
    event_location: string;
    section_id: string;
    course_id: string;
    event_type: string;
    event_start: string;
    event_end: string;
    modified_time: string;
    section_color: string;
    revision_id: string;
}

export = EventsServerCommunicator;
