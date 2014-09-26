/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', './IndicatorView'], function(require, exports, $, IndicatorView) {
    var TemporaryIndicatorView = (function (_super) {
        __extends(TemporaryIndicatorView, _super);
        function TemporaryIndicatorView(identifier, displayText, encoded) {
            if (typeof encoded === "undefined") { encoded = false; }
            _super.call(this, TemporaryIndicatorView.template, TemporaryIndicatorView.cssClass, identifier);
            if (encoded) {
                this.findJQuery('#loading-content').html(displayText);
            } else {
                this.findJQuery('#loading-content').text(displayText);
            }
        }
        Object.defineProperty(TemporaryIndicatorView, "template", {
            get: function () {
                var $template = $('<div class="indicator alert alert-dismissable alert-success">');
                $template.append($('<span id="loading-content">'));
                return $template;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(TemporaryIndicatorView, "cssClass", {
            get: function () {
                return IndicatorView.cssClass + ' temporaryIndicatorView';
            },
            enumerable: true,
            configurable: true
        });
        return TemporaryIndicatorView;
    })(IndicatorView);

    
    return TemporaryIndicatorView;
});
