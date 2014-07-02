var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Core/BrowserEvents', './View'], function(require, exports, BrowserEvents, View) {
    var FocusableView = (function (_super) {
        __extends(FocusableView, _super);
        function FocusableView() {
            _super.apply(this, arguments);
            this._hasFocus = false;
        }
        Object.defineProperty(FocusableView.prototype, "hasFocus", {
            get: function () {
                return this._hasFocus;
            },
            enumerable: true,
            configurable: true
        });

        FocusableView.prototype.focusView = function () {
            this.triggerEvent(4 /* viewWillFocus */);
            this._$el.focus();
            this.triggerEvent(5 /* viewDidFocus */);
        };
        FocusableView.prototype.blurView = function () {
            this.triggerEvent(6 /* viewWillBlur */);
            this._$el.blur();
            this.triggerEvent(7 /* viewDidBlur */);
        };
        return FocusableView;
    })(View);
    
    return FocusableView;
});
