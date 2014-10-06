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

    }

    public pushModifiedEvents(): void
    {
        // TODO queueing logic does not make sense. We don't want a queue. If a
        // push request is going on, we don't want to do anything.
        if (!this.eventsModificationsManager.hasModifiedEvents())
        {
            return;
        }
        var createServerRequest = ()=>
        {
            var paramsDict = new Dictionary<string, string>();
            var modifiedEvents = this.eventsModificationsManager.getModifiedEvents().map((eventsModel: IEventsModel)=>{
                return this.getLegacyEventObjectFromEventsModel(eventsModel);
            });
            paramsDict.set("events", JSON.stringify(modifiedEvents));
            // TODO hidden events
            var request = new ServerRequest({
                url: "/put",
                async: true,
                parameters: paramsDict,
                requestType: ServerRequestType.post
            });
            return request;
        };
        this.serverConnection.sendRequest(createServerRequest())
            .done((data: {changed_ids: EventIdChangeMap; deleted_ids: string[]})=>{
                this.eventsModificationsManager.clearModificationsHistory();
                for (var oldId in data.changed_ids)
                {
                    var newId = data.changed_ids[oldId][0];
                    var newGroupId = data.changed_ids[oldId][1];
                    this.eventsStoreCoordinator.remapEventId(oldId, newId, newGroupId);
                }
                this.eventsStoreCoordinator.clearLocalEventsWithIds(data.deleted_ids);
            })
            .fail(()=>{

            });
    }

    public pullEvents(): void
    {
        var createServerRequest = ()=>
        {
            var serverRequest = new ServerRequest({
                url: '/get/' + this.lastConnected.unix,
                async: true,
                parameters: new Dictionary<string, string>(),
                requestType: ServerRequestType.get,
            });
            return serverRequest;
        };
        this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.eventsWillBeginDownloading);
        this.serverConnection.sendRequest(createServerRequest())
            .done((data: {events: LegacyEventObject[]; hidden_events: string[]}) =>
            {
                if (this.eventsModificationsManager.hasModifiedEvents())
                {
                    return; // cancel pull if there are modified events
                }
                if (this.lastConnected.unix === 0)
                {
                    this.eventsStoreCoordinator.clearLocalEvents();
                }
                this.lastConnected = new DateTime();
                var eventsModels = new Array<IEventsModel>();
                for (var i = 0; i < data.events.length; ++i)
                {
                    // TODO handle uncommitted and updated events
                    eventsModels.push(this.getEventsModelFromLegacyEventObject(data.events[i]));
                }
                this.eventsStoreCoordinator.addLocalEvents(eventsModels);
                // hidden events
                if (data.hidden_events)
                {
                    this.eventsVisibilityManager.resetEventVisibilityToHiddenEventIds(data.hidden_events);
                }
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
            sectionColor: legacyEventObject.section_color,
            revisionId: legacyEventObject.revision_id
        });
    }

    private getLegacyEventObjectFromEventsModel(eventsModel: IEventsModel): LegacyEventObject
    {
        return {
            event_id: eventsModel.eventId,
            event_title: eventsModel.title,
            event_description: eventsModel.description,
            event_location: eventsModel.location,
            section_id: eventsModel.sectionId,
            course_id: eventsModel.courseId,
            event_type: eventsModel.eventTypeCode,
            event_start: eventsModel.startDate.unix.toString(),
            event_end: eventsModel.endDate.unix.toString(),
            modified_time: eventsModel.lastEdited.unix.toString(),
            event_group_id: eventsModel.eventGroupId,
            section_color: eventsModel.sectionColor,
            revisionId: eventsModel.revisionId,
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
