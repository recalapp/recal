define(["require", "exports", 'jquery'], function(require, exports, $) {
    var EncodeDecodeProxy = (function () {
        function EncodeDecodeProxy() {
        }
        EncodeDecodeProxy.prototype.titleCaseEncode = function (content) {
            return content.toString().replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        };

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
        return EncodeDecodeProxy;
    })();
    
    return EncodeDecodeProxy;
});
