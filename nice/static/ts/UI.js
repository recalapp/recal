var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var View = (function () {
    function View($el) {
        this.$el = $el;
    }
    View.prototype.append = function (childView) {
        this.$el.append(childView.$el);
    };
    return View;
})();
exports.View = View;

var FocusableView = (function (_super) {
    __extends(FocusableView, _super);
    function FocusableView() {
        _super.apply(this, arguments);
    }
    FocusableView.prototype.focusView = function () {
        this.$el.focus();
    };
    FocusableView.prototype.blurView = function () {
        this.$el.blur();
    };
    return FocusableView;
})(View);
exports.FocusableView = FocusableView;

var ViewController = (function () {
    function ViewController() {
    }
    return ViewController;
})();
exports.ViewController = ViewController;
