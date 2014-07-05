/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './ClickToEditType', '../CoreUI/FocusableView', '../Core/InvalidArgumentException'], function(require, exports, ClickToEditType, FocusableView, InvalidArgumentException) {
    var ClickToEditView = (function (_super) {
        __extends(ClickToEditView, _super);
        // TODO handle focus/blur
        // TODO initialize
        function ClickToEditView($element) {
            _super.call(this, $element);
            this._type = 0 /* input */;
            if (!this._$el.is('p, h1, h2, h3, h4, h5, h6')) {
                throw new InvalidArgumentException('ClickToEdit must be p, h1, h2, h3, h4, h5, or h6');
            }
            this._initializeClickToEdit();
        }
        ClickToEditView.prototype._initializeClickToEdit = function () {
        };

        Object.defineProperty(ClickToEditView.prototype, "value", {
            // TODO update value
            get: function () {
                return this._$el.text();
            },
            // TODO get value
            set: function (text) {
                this._$el.text(text);
            },
            enumerable: true,
            configurable: true
        });

        return ClickToEditView;
    })(FocusableView);
    
    return ClickToEditView;
});
