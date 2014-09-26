/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', './IndicatorView'], function(require, exports, $, IndicatorView) {
    var PersistentIndicatorView = (function (_super) {
        __extends(PersistentIndicatorView, _super);
        function PersistentIndicatorView(identifier, displayText, encoded) {
            if (typeof encoded === "undefined") { encoded = false; }
            _super.call(this, PersistentIndicatorView.template, PersistentIndicatorView.cssClass, identifier);
            if (encoded) {
                this.findJQuery('#loading-content').html(displayText);
            } else {
                this.findJQuery('#loading-content').text(displayText);
            }
        }
        Object.defineProperty(PersistentIndicatorView, "template", {
            get: function () {
                var $template = $('<div class="indicator alert alert-dismissable alert-info">');
                $template.append($('<span id="loading-content">'));
                return $template;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PersistentIndicatorView, "cssClass", {
            get: function () {
                return IndicatorView.cssClass + ' persistentIndicatorView';
            },
            enumerable: true,
            configurable: true
        });
        return PersistentIndicatorView;
    })(IndicatorView);

    
    return PersistentIndicatorView;
});
//# sourceMappingURL=PersistentIndicatorView.js.map
