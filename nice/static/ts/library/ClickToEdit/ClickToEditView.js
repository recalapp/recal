/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />
/// <amd-dependency path="jeditable" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../Core/BrowserEvents", './ClickToEditCommon', './ClickToEditType', './ClickToEditTypeProvider', '../CoreUI/FocusableView', '../Core/InvalidArgumentException', "jeditable"], function(require, exports, BrowserEvents, ClickToEditCommon, ClickToEditType, ClickToEditTypeProvider, FocusableView, InvalidArgumentException) {
    var ClickToEditView = (function (_super) {
        __extends(ClickToEditView, _super);
        function ClickToEditView($element) {
            _super.call(this, $element);
            this._type = 0 /* text */;
            if (!this._$el.is('p, h1, h2, h3, h4, h5, h6')) {
                throw new InvalidArgumentException('ClickToEdit must be p, h1, h2, h3, h4, h5, or h6');
            }
            var type = this._$el.data(ClickToEditCommon.DataType);
            if (type !== null && type !== undefined) {
                this._type = parseInt(type);
            }
            this._initializeClickToEdit();
        }
        ClickToEditView.prototype._initializeClickToEdit = function () {
            var _this = this;
            this._$el.editable(function (value, settings) {
                _this.triggerEvent(BrowserEvents.clickToEditComplete, {
                    value: value
                });
                return value;
            }, {
                type: ClickToEditTypeProvider.instance().getTypeString(this._type),
                event: BrowserEvents.clickToEditShouldBegin
            });
            this.attachEventHandler(BrowserEvents.click, function () {
                _this.triggerEvent(BrowserEvents.clickToEditShouldBegin);
            });
        };
        Object.defineProperty(ClickToEditView.prototype, "value", {
            get: function () {
                return this._$el.text();
            },
            set: function (text) {
                this._$el.text(text);
            },
            enumerable: true,
            configurable: true
        });

        ClickToEditView.prototype.focusView = function () {
            _super.prototype.focusView.call(this);
            this.triggerEvent(BrowserEvents.clickToEditShouldBegin);
        };
        return ClickToEditView;
    })(FocusableView);
    
    return ClickToEditView;
});
