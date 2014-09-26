define(["require", "exports"], function(require, exports) {
    var ServerRequest = (function () {
        function ServerRequest(params) {
            this._url = null;
            this._async = false;
            this._parameters = null;
            this._requestType = null;
            if (params !== null && params !== undefined) {
                this.url = params.url;
                this.async = params.async;
                this.parameters = params.parameters;
                this.requestType = params.requestType;
            }
        }
        Object.defineProperty(ServerRequest.prototype, "url", {
            get: function () {
                return this._url;
            },
            set: function (value) {
                this._url = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ServerRequest.prototype, "async", {
            get: function () {
                return this._async;
            },
            set: function (value) {
                this._async = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ServerRequest.prototype, "parameters", {
            get: function () {
                return this._parameters;
            },
            set: function (value) {
                this._parameters = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ServerRequest.prototype, "requestType", {
            get: function () {
                return this._requestType;
            },
            set: function (value) {
                this._requestType = value;
            },
            enumerable: true,
            configurable: true
        });
        return ServerRequest;
    })();

    
    return ServerRequest;
});
//# sourceMappingURL=ServerRequest.js.map
