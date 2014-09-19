var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Core/BrowserEvents', '../../../library/Core/InvalidActionException', '../../../library/PopUp/PopUpView', '../ReCalCommonBrowserEvents', '../../../library/CoreUI/ViewController'], function(require, exports, BrowserEvents, InvalidActionException, PopUpView, ReCalCommonBrowserEvents, ViewController) {
    var CanvasPopUpContainerViewController = (function (_super) {
        __extends(CanvasPopUpContainerViewController, _super);
        function CanvasPopUpContainerViewController(view, dependencies) {
            _super.call(this, view);
            /**
            * Global Browser Events Manager
            */
            this._globalBrowserEventsManager = null;
            this._globalBrowserEventsManager = dependencies.globalBrowserEventsManager;
            this.initialize();
        }
        Object.defineProperty(CanvasPopUpContainerViewController.prototype, "globalBrowserEventsManager", {
            get: function () {
                return this._globalBrowserEventsManager;
            },
            enumerable: true,
            configurable: true
        });

        CanvasPopUpContainerViewController.prototype.initialize = function () {
            var _this = this;
            // when popup detaches from sidebar
            this.globalBrowserEventsManager.attachGlobalEventHandler(ReCalCommonBrowserEvents.popUpWillDetachFromSidebar, function (ev, extra) {
                _this.addPopUpView(extra.popUpView);
            });

            // when popup is dropped onto sidebar
            this.view.attachEventHandler(BrowserEvents.sidebarViewDidDrop, PopUpView.cssSelector(), function (ev, extra) {
                var popUpView = extra.view;
                popUpView.removeFromParent();
                _this.view.triggerEvent(ReCalCommonBrowserEvents.popUpWasDroppedInSidebar, {
                    popUpView: popUpView
                });
            });
        };

        /**
        * Add a PopUpView object to the canvas container. PopUpView object
        * must be detached from its previous parent first
        */
        CanvasPopUpContainerViewController.prototype.addPopUpView = function (popUpView) {
            if (popUpView.parentView !== null) {
                throw new InvalidActionException("PopUpView must be detached before adding to container");
            }
            this.view.append(popUpView);
        };
        return CanvasPopUpContainerViewController;
    })(ViewController);

    
    return CanvasPopUpContainerViewController;
});
