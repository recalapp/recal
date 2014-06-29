var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../Core/BrowserEvents', './PopUpCommon', './PopUpView', '../CoreUI/ViewController'], function(require, exports, $, BrowserEvents, PopUpCommon, PopUpView, ViewController) {
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
            this.view.attachEventHandler(1 /* mouseDown */, PopUpCommon.CssSelector, function (ev) {
                ev.preventDefault();
                var popUpView = PopUpView.fromJQuery($(ev.target));
                _this.giveFocus(popUpView);
            });
        }
        /**
        * Give focus to its PopUpView and cause all other PopUps to lose focus
        */
        PopUpContainerViewController.prototype.giveFocus = function (toBeFocused) {
            // find a way to get all popups
            this.map(function (popUpView) {
                popUpView === toBeFocused ? popUpView.focusView() : popUpView.blurView();
            });
        };

        PopUpContainerViewController.prototype.map = function (apply) {
            // TODO must be overridden to support sidebar
            $.each(this.view.children, function (index, childView) {
                if (childView instanceof PopUpView) {
                    return apply(childView);
                }
            });
        };

        PopUpContainerViewController.prototype.getPopUpById = function (popUpId) {
            var ret = null;
            this.map(function (popUpView) {
                if (popUpView.popUpId === popUpId) {
                    ret = popUpView;
                    return false;
                }
            });
            return ret;
        };
        return PopUpContainerViewController;
    })(ViewController);
});
