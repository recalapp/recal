/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../CoreUI/View'], function(require, exports, View) {
    var IndicatorView = (function (_super) {
        __extends(IndicatorView, _super);
        function IndicatorView($element, cssClass, identifier) {
            _super.call(this, $element, cssClass);
            this._identifier = null;
            this._identifier = identifier;
        }
        Object.defineProperty(IndicatorView.prototype, "identifier", {
            get: function () {
                return this._identifier;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(IndicatorView, "cssClass", {
            get: function () {
                return View.cssClass + ' indicatorView';
            },
            enumerable: true,
            configurable: true
        });
        return IndicatorView;
    })(View);

    
    return IndicatorView;
});
//# sourceMappingURL=IndicatorView.js.map
