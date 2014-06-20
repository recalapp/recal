var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './View'], function(require, exports, View) {
    var FocusableView = (function (_super) {
        __extends(FocusableView, _super);
        function FocusableView() {
            _super.apply(this, arguments);
        }
        FocusableView.prototype.focusView = function () {
            this._$el.focus();
        };
        FocusableView.prototype.blurView = function () {
            this._$el.blur();
        };
        return FocusableView;
    })(View);
    
    return FocusableView;
});
