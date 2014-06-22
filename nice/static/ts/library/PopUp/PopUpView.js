var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../CoreUI/FocusableView'], function(require, exports, FocusableView) {
    var PopUpView = (function (_super) {
        __extends(PopUpView, _super);
        function PopUpView(view) {
            _super.call(this, view);
            // TODO handle main/not main difference
            // TODO make draggable
            // TODO make resizable
            // TODO handle mousedown (should be in view controller?)
            // TODO support for shift-click
            // TODO max height (maybe should be in css? or some other location)
            // TODO initialize as needed
            // TODO activate tool tip - separate module
            // NOTE extra initialization can be done by overriding the constructor
        }
        PopUpView.prototype._makeResizable = function () {
            // TODO PopUp_makeResizable
        };

        PopUpView.prototype.removeFromParent = function () {
            _super.prototype.removeFromParent.call(this);
            // TODO handle PopUp_close() logic
        };

        PopUpView.prototype.focusView = function () {
            // TODO handle focus (appearance only, not logic)
        };

        PopUpView.prototype.blurView = function () {
            // TODO PopUp_loseFocus()
        };

        PopUpView.prototype.setColor = function (color) {
            // TODO make color a class
            // TODO PopUp_setColor
        };
        return PopUpView;
    })(FocusableView);

    
    return PopUpView;
});
