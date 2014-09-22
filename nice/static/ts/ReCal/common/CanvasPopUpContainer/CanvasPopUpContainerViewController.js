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
            this._canvasView = null;
            /**
            * ClickToEditView Factory
            */
            this._clickToEditViewFactory = null;
            this._globalBrowserEventsManager = dependencies.globalBrowserEventsManager;
            this._canvasView = dependencies.canvasView;
            this._clickToEditViewFactory = dependencies.clickToEditViewFactory;
            this.initialize();
        }
        Object.defineProperty(CanvasPopUpContainerViewController.prototype, "globalBrowserEventsManager", {
            get: function () {
                return this._globalBrowserEventsManager;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CanvasPopUpContainerViewController.prototype, "canvasView", {
            get: function () {
                return this._canvasView;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CanvasPopUpContainerViewController.prototype, "clickToEditViewFactory", {
            get: function () {
                return this._clickToEditViewFactory;
            },
            enumerable: true,
            configurable: true
        });

        CanvasPopUpContainerViewController.prototype.initialize = function () {
            var _this = this;
            // when popup detaches from sidebar
            this.globalBrowserEventsManager.attachGlobalEventHandler(ReCalCommonBrowserEvents.popUpWillDetachFromSidebar, function (ev, extra) {
                var popUpView = extra.popUpView;
                _this.addPopUpView(popUpView);
                popUpView.css({
                    top: extra.boundingRect.top,
                    left: extra.boundingRect.left
                });
                popUpView.width = extra.width;
                popUpView.height = extra.height;
                popUpView.focus(); // focus must be called after the positions are set
            });

            // when popup is dropped onto sidebar
            this.canvasView.attachEventHandler(BrowserEvents.sidebarViewDidDrop, PopUpView.cssSelector(), function (ev, extra) {
                var popUpView = extra.view;
                _this.removePopUpView(popUpView);
                _this.canvasView.triggerEvent(ReCalCommonBrowserEvents.popUpWasDroppedInSidebar, {
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
            popUpView.addCssClass('in-canvas');
            this.canvasView.append(popUpView);
        };

        CanvasPopUpContainerViewController.prototype.removePopUpView = function (popUpView) {
            if (popUpView.parentView !== this.canvasView) {
                throw new InvalidActionException('PopUpView is not in canvas to begin with');
            }
            popUpView.removeCssClass('in-canvas');
            popUpView.removeFromParent();
        };
        return CanvasPopUpContainerViewController;
    })(ViewController);

    
    return CanvasPopUpContainerViewController;
});
