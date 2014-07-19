var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../Core/BrowserEvents', '../ClickToEdit/ClickToEditBaseView', '../Core/GlobalBrowserEventsManager', './PopUpCommon', './PopUpView', '../CoreUI/View', '../CoreUI/ViewController'], function(require, exports, $, BrowserEvents, ClickToEditBaseView, GlobalBrowserEventsManager, PopUpCommon, PopUpView, View, ViewController) {
    var PopUpContainerViewController = (function (_super) {
        __extends(PopUpContainerViewController, _super);
        function PopUpContainerViewController(view) {
            _super.call(this, view);
            GlobalBrowserEventsManager.instance().attachGlobalEventHandler(BrowserEvents.mouseDown, PopUpCommon.allDescendentsSelector, function (ev) {
                // don't prevent default, otherwise click to edit will not blur on click
                var targetView = View.fromJQuery($(ev.target));
                if (!(targetView instanceof ClickToEditBaseView)) {
                    $(ev.target).focus();
                }
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
            // TODO remove - not used anymore
            this.map(function (popUpView) {
                popUpView === toBeFocused ? popUpView.highlight() : popUpView.unhighlight();
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
