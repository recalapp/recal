var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../CoreUI/FocusableView', './PopUpCommon'], function(require, exports, FocusableView, PopUpCommon) {
    // aliases
    var PopUpType = PopUpCommon.PopUpType;

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
            // TODO theme - separate module
            // NOTE extra initialization can be done by overriding the constructor
        }
        Object.defineProperty(PopUpView.prototype, "popUpId", {
            get: function () {
                return this._popUpId;
            },
            set: function (newValue) {
                this._popUpId = newValue;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PopUpView.prototype, "color", {
            get: function () {
                return this._color;
            },
            set: function (newValue) {
                this._color = newValue;
                this._updateColor();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PopUpView.prototype, "isMain", {
            get: function () {
                return this._type === 0 /* main */;
            },
            enumerable: true,
            configurable: true
        });

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

        PopUpView.prototype._updateColor = function () {
            // TODO make color a class
            // TODO PopUp_setColor
        };
        return PopUpView;
    })(FocusableView);

    
    return PopUpView;
});
