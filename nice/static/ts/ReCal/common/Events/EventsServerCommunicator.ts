import DateTime = require('../../../library/DateTime/DateTime');
import Dictionary = require('../../../library/DataStructures/Dictionary');
import Events = require('./Events');
import EventsModel = require('./EventsModel');
import EventsStoreCoordinator = require('./EventsStoreCoordinator');
import EventsVisibilityManager = require('./EventsVisibilityManager');
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

    constructor(dependencies: Events.EventsRetrieverDependencies)
    {
        this._eventsStoreCoordinator = dependencies.eventsStoreCoordinator;
        this._eventsVisibilityManager = dependencies.eventsVisibilityManager;
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
        this.serverConnection.sendRequest(createServerRequest())
            .done((data: {events: any[]; hidden_events: string[]}) =>{
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
            }).fail((data: any) =>{
            });
    }

    private getEventsModelFromLegacyEventObject(legacyEventObject: any): IEventsModel
    {
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
    }
}

export = EventsServerCommunicator;
