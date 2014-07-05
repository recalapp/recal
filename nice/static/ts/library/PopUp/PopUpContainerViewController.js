var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../Core/BrowserEvents', '../Core/GlobalBrowserEventsManager', './PopUpCommon', './PopUpView', '../CoreUI/ViewController'], function(require, exports, $, BrowserEvents, GlobalBrowserEventsManager, PopUpCommon, PopUpView, ViewController) {
    var PopUpContainerViewController = (function (_super) {
        __extends(PopUpContainerViewController, _super);
        function PopUpContainerViewController(view) {
            var _this = this;
            _super.call(this, view);
            GlobalBrowserEventsManager.instance().attachGlobalEventHandler(1 /* mouseDown */, PopUpCommon.AllDescendentsSelector, function (ev) {
                ev.preventDefault();
                var $popUpElement = PopUpCommon.findPopUpFromChild($(ev.target));
                var popUpView = PopUpView.fromJQuery($popUpElement);
                _this.giveFocus(popUpView);
            });
        }
        PopUpContainerViewController.prototype._tryGetMainPopUp = function () {
            var ret = null;
            this.map(function (popUpView) {
                if (popUpView.isMain) {
                    ret = popUpView;
                    return false;
                }
            });
            return ret;
        };

        PopUpContainerViewController.prototype.hasMain = function () {
            return this._tryGetMainPopUp() !== null;
        };

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
    
    return PopUpContainerViewController;
});
