var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../CoreUI/ViewController'], function(require, exports, ViewController) {
    var PopUpType;
    (function (PopUpType) {
        PopUpType[PopUpType["main"] = 0] = "main";
        PopUpType[PopUpType["detached"] = 1] = "detached";
    })(PopUpType || (PopUpType = {}));
    ;

    var PopUpViewController = (function (_super) {
        __extends(PopUpViewController, _super);
        function PopUpViewController(view) {
            var _this = this;
            _super.call(this, view);
            // ID logic should be here? makes more sense
            this._popUpId = null;

            // TODO theme - separate module
            this.view.addEventListener('mousedown', function (ev) {
                _this.giveFocus();
            });
        }
        Object.defineProperty(PopUpViewController.prototype, "popUpId", {
            get: function () {
                return this._popUpId;
            },
            set: function (newValue) {
                this._popUpId = newValue;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PopUpViewController.prototype, "isMain", {
            get: function () {
                return this._type == 0 /* main */;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Give focus to its PopUpView and cause all other PopUps to lose focus
        */
        PopUpViewController.prototype.giveFocus = function () {
            this.view.focusView();
            // find a way to get all popups
        };
        return PopUpViewController;
    })(ViewController);
});
