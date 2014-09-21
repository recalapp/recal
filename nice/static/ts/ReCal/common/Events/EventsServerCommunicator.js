/// <reference path="../../../typings/tsd.d.ts" />
define(["require", "exports", '../../../library/DateTime/DateTime', '../../../library/Server/ServerConnection'], function(require, exports, DateTime, ServerConnection) {
    var EventsServerCommunicator = (function () {
        function EventsServerCommunicator() {
            this._serverConnection = new ServerConnection(1);
            this._lastConnected = DateTime.fromUnix(0);
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

        EventsServerCommunicator.prototype.pullEvents = function () {
            var createServerRequest = function () {
                return null;
            };
            this.serverConnection.sendRequest(createServerRequest()).done(function (data) {
            }).fail(function (data) {
            });
            return null;
        };
        return EventsServerCommunicator;
    })();

    
    return EventsServerCommunicator;
});
