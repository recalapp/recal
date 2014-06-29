var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../Core/BrowserEvents', './PopUpView', '../CoreUI/ViewController'], function(require, exports, $, BrowserEvents, PopUpView, ViewController) {
    var PopUpType;
    (function (PopUpType) {
        PopUpType[PopUpType["main"] = 0] = "main";
        PopUpType[PopUpType["detached"] = 1] = "detached";
    })(PopUpType || (PopUpType = {}));
    ;

    var PopUpContainerViewController = (function (_super) {
        __extends(PopUpContainerViewController, _super);
        function PopUpContainerViewController(view) {
            var _this = this;
            _super.call(this, view);
            this.view.attachEventHandler(2 /* mouseDown */, '.popup', function (ev) {
                ev.preventDefault();
                var popUpView = PopUpView.fromJQuery($(ev.target));
                _this.giveFocus(popUpView);
            });
        }
        /**
        * Give focus to its PopUpView and cause all other PopUps to lose focus
        */
        PopUpContainerViewController.prototype.giveFocus = function (popUpView) {
            // find a way to get all popups
        };
        return PopUpContainerViewController;
    })(ViewController);
});
