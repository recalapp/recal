/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import InvalidActionException = require('../Core/InvalidActionException');
import Queue = require('../DataStructures/Queue');
import Server = require('./Server');
import ServerRequestType = require('./ServerRequestType');

import IServerConnection = Server.IServerConnection;
import IServerRequest = Server.IServerRequest;


interface RequestDeferredPair
{
    request: IServerRequest;
    deferred: JQueryDeferred<any>;
}

/**
  * A ServerConnection object is responsible for making server calls using  
  * server requests.
  */
class ServerConnection implements IServerConnection
{
    private _requestsQueue: Queue<RequestDeferredPair> = null;
    private get requestsQueue(): Queue<RequestDeferredPair>
    {
        if (this._requestsQueue === null || this._requestsQueue === undefined)
        {
            this._requestsQueue = new Queue<RequestDeferredPair>();
        }
        return this._requestsQueue;
    }

    private _concurrencyLimit: number = 1;
    private get concurrencyLimit(): number
    {
        return this._concurrencyLimit;
    }

    private _activeCalls: number = 0;
    private get activeCalls(): number
    {
        return this.activeCalls;
    }
    private set activeCalls(value: number)
    {
        this.activeCalls = value;
    }


    /**
      * Initializes a new server connection. 
      * concurrencyLimit: The maximum number of concurrent calls this 
      * Server Connection is allowed to make.
      */
    constructor(concurrencyLimit?: number)
    {
        if (concurrencyLimit)
        {
            this._concurrencyLimit = concurrencyLimit;
        }
    }

    /**
      * If the number of current requests > concurrencyLimit, then queue this 
      * server request. Otherwise, send this server request. Returns a promise
      * that gets accepted if the request is successful and rejected if the 
      * request is not successful.
      */
    public sendRequest(serverRequest: IServerRequest): JQueryPromise<any>
    {
        if (serverRequest === null || serverRequest === undefined)
        {
            throw new InvalidActionException('Server Request cannot be null');
        }
        var deferred = $.Deferred();
        this.requestsQueue.enqueue({
            request: serverRequest,
            deferred: deferred,
        });
        this.handleQueue();
        return deferred.promise();
    }

    private handleQueue(): void
    {
        if (this.activeCalls > this.concurrencyLimit || this.requestsQueue.empty)
        {
            return;
        }
        ++this.activeCalls;
        var pair = this.requestsQueue.dequeue();
        var request = pair.request;
        var deferred = pair.deferred;
        var complete = () => {
            --this.activeCalls;
            this.handleQueue();
        };
        $.ajax(request.url, {
            dataType: 'json',
            type: request.requestType === ServerRequestType.get ? 'GET' : 'POST',
            data: request.parameters.primitiveObject(),
            async: request.async,
            success: (data) => {
                complete();
                deferred.resolve(data);
            },
            error: (data) => {
                complete();
                deferred.reject(data);
            },
        });
    }
}

export = ServerConnection;
