/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Core/BrowserEvents', '../DateTime/DateTime', '../CoreUI/FocusableView', '../Core/InvalidArgumentException'], function(require, exports, BrowserEvents, DateTime, FocusableView, InvalidArgumentException) {
    var TimeInputView = (function (_super) {
        __extends(TimeInputView, _super);
        function TimeInputView($element, cssClass) {
            _super.call(this, $element, cssClass);
            this._value = null;
            this._timeFormat = "H:mm A";
            if (!$element.is('input')) {
                throw new InvalidArgumentException("TimeInputView can only be constructed from a HTML input element.");
            }
            this._value = this._$el.data("logical_value") || DateTime.fromUnix(0);
            this.attachEventHandler(BrowserEvents.keyPress, function (ev) {
                ev.preventDefault();
            });
            this.refresh();
        }
        Object.defineProperty(TimeInputView.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._value = value;
                this.refresh();
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(TimeInputView.prototype, "timeFormat", {
            get: function () {
                return this._timeFormat;
            },
            set: function (value) {
                this._timeFormat = value;
                this.refresh();
            },
            enumerable: true,
            configurable: true
        });

        TimeInputView.prototype.refresh = function () {
            this._$el.val(this.value.format(this.timeFormat));
            this._$el.data("logical_value", this.value);
        };
        return TimeInputView;
    })(FocusableView);

    
    return TimeInputView;
});
//# sourceMappingURL=TimeInputView.js.map
