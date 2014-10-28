import Dictionary = require('../DataStructures/Dictionary');
import Server = require('./Server');
import ServerRequestType = require('./ServerRequestType');

import IServerRequest = Server.IServerRequest;

class ServerRequest implements IServerRequest
{
    constructor(params?: IServerRequest)
    {
        if (params !== null && params !== undefined)
        {
            this.url = params.url;
            this.async = params.async;
            this.parameters = params.parameters;
            this.requestType = params.requestType;
        }
    }

    private _url: string = null;
    public get url(): string { return this._url; }
    public set url(value: string) { this._url = value; }

    private _async: boolean = false;
    public get async(): boolean { return this._async; }
    public set async(value: boolean) { this._async = value; }

    private _parameters: Dictionary<string, string> = null;
    public get parameters(): Dictionary<string, string> { return this._parameters; }
    public set parameters(value: Dictionary<string, string>) { this._parameters = value; }

    private _requestType: ServerRequestType = null;
    public get requestType(): ServerRequestType { return this._requestType; }
    public set requestType(value: ServerRequestType) { this._requestType = value; }
}

export = ServerRequest;
