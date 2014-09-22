/// <reference path="../../typings/tsd.d.ts" />
define(["require", "exports", 'jquery', '../Core/InvalidActionException', '../DataStructures/Queue', './ServerRequestType'], function(require, exports, $, InvalidActionException, Queue, ServerRequestType) {
    /**
    * A ServerConnection object is responsible for making server calls using
    * server requests.
    */
    var ServerConnection = (function () {
        /**
        * Initializes a new server connection.
        * concurrencyLimit: The maximum number of concurrent calls this
        * Server Connection is allowed to make.
        */
        function ServerConnection(concurrencyLimit) {
            this._requestsQueue = null;
            this._concurrencyLimit = 1;
            this._activeCalls = 0;
            if (concurrencyLimit) {
                this._concurrencyLimit = concurrencyLimit;
            }
        }
        Object.defineProperty(ServerConnection.prototype, "requestsQueue", {
            get: function () {
                if (this._requestsQueue === null || this._requestsQueue === undefined) {
                    this._requestsQueue = new Queue();
                }
                return this._requestsQueue;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ServerConnection.prototype, "concurrencyLimit", {
            get: function () {
                return this._concurrencyLimit;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ServerConnection.prototype, "activeCalls", {
            get: function () {
                return this._activeCalls;
            },
            set: function (value) {
                this._activeCalls = value;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * If the number of current requests > concurrencyLimit, then queue this
        * server request. Otherwise, send this server request. Returns a promise
        * that gets accepted if the request is successful and rejected if the
        * request is not successful.
        */
        ServerConnection.prototype.sendRequest = function (serverRequest) {
            if (serverRequest === null || serverRequest === undefined) {
                throw new InvalidActionException('Server Request cannot be null');
            }
            var deferred = $.Deferred();
            this.requestsQueue.enqueue({
                request: serverRequest,
                deferred: deferred
            });
            this.handleQueue();
            return deferred.promise();
        };

        ServerConnection.prototype.handleQueue = function () {
            var _this = this;
            if (this.activeCalls > this.concurrencyLimit || this.requestsQueue.empty) {
                return;
            }
            ++this.activeCalls;
            var pair = this.requestsQueue.dequeue();
            var request = pair.request;
            var deferred = pair.deferred;
            var complete = function () {
                --_this.activeCalls;
                _this.handleQueue();
            };
            $.ajax(request.url, {
                dataType: 'json',
                type: request.requestType === 0 /* get */ ? 'GET' : 'POST',
                data: request.parameters.primitiveObject(),
                async: request.async,
                success: function (data) {
                    complete();
                    deferred.resolve(data);
                },
                error: function (data) {
                    complete();
                    deferred.reject(data);
                }
            });
        };
        return ServerConnection;
    })();

    
    return ServerConnection;
});
