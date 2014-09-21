/// <reference path="../../typings/tsd.d.ts" />

import Dictionary = require('../DataStructures/Dictionary');
import ServerRequestType = require('./ServerRequestType');

/**
  * A server request defines the properties of a particular server call. 
  */
export interface IServerRequest
{
    url: string;
    async: boolean;
    parameters: Dictionary<string, string>;
    requestType: ServerRequestType;
}

/**
  * A ServerConnection object is responsible for making server calls using  
  * server requests.
  */
export interface IServerConnection
{
    /**
      * If the number of current requests > concurrencyLimit, then queue this 
      * server request. Otherwise, send this server request. Returns a promise
      * that gets accepted if the request is successful and rejected if the 
      * request is not successful.
      */
    sendRequest(serverRequest: IServerRequest): JQueryPromise<any>;
}
