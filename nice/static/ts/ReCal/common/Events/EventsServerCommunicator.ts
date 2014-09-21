/// <reference path="../../../typings/tsd.d.ts" />

import DateTime = require('../../../library/DateTime/DateTime');
import Events = require('./Events');
import Server = require('../../../library/Server/Server');
import ServerConnection = require('../../../library/Server/ServerConnection');
import ServerRequest = require('../../../library/Server/ServerRequest');

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

    public pullEvents(): JQueryPromise<IEventsModel[]>
    {
        var createServerRequest = ()=>
        {
            return null;
        };
        this.serverConnection.sendRequest(createServerRequest())
            .done((data: any) =>{

            }).fail((data: any) =>{
            });
        return null;
    }
}

export = EventsServerCommunicator;
