define(["require", "exports", 'jquery'], function(require, exports, $) {
    var EncodeDecodeProxy = (function () {
        function EncodeDecodeProxy() {
        }
        Object.defineProperty(EncodeDecodeProxy, "instance", {
            get: function () {
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });

        EncodeDecodeProxy.prototype.htmlEncode = function (content) {
            return $('<div>').text(content).html();
        };

        EncodeDecodeProxy.prototype.htmlDecode = function (content) {
            return $('<div>').html(content).text();
        };

        EncodeDecodeProxy.prototype.newLinesToBr = function (content) {
            // equavalent to nl2br in php
            return content.replace(/(\n|\r)/g, "<br>");
        };

        EncodeDecodeProxy.prototype.brToNewLines = function (content) {
            return content.replace(/(\n|\r)/g, "").replace(/<br>/g, "\n");
        };
        EncodeDecodeProxy._instance = new EncodeDecodeProxy();
        return EncodeDecodeProxy;
    })();
    
    return EncodeDecodeProxy;
});
