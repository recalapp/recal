/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Core/BrowserEvents', '../../../library/Core/GlobalBrowserEventsManager', '../ReCalCommonBrowserEvents', '../../../library/PopUp/PopUpView', '../../../library/CoreUI/ViewController'], function(require, exports, BrowserEvents, GlobalBrowserEventsManager, ReCalCommonBrowserEvents, PopUpView, ViewController) {
    /************************************************************************
    * This class is responsible for managing the sidebar in ReCal. In particular,
    * it is responsible for listening to the following events:
    * 1. When a PopUp view is supposed to go into the sidebar.
    * 2. When a notification view is supposed to be shown.
    * 3. When a similar event is found.
    * 4. When a set of events is supposed to be show in the full sidebar view.
    **********************************************************************/
    var ReCalSidebarViewController = (function (_super) {
        __extends(ReCalSidebarViewController, _super);
        function ReCalSidebarViewController(sidebarView) {
            _super.call(this, sidebarView);
        }
        Object.defineProperty(ReCalSidebarViewController.prototype, "view", {
            get: function () {
                return this._view;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Do any initialization needed. Better than overriding constructor
        * because this gives the option of not calling super.initialize();
        */
        ReCalSidebarViewController.prototype.initialize = function () {
            this.initializePopUp();
        };

        /**
        * This initializes all the operations related to PopUp
        */
        ReCalSidebarViewController.prototype.initializePopUp = function () {
            var _this = this;
            // add listener for when PopUpView objects begin dragging.
            this.view.attachEventHandler(BrowserEvents.popUpWillDrag, function (ev, extra) {
                var popUpView = extra.view;

                // when we begin dragging, we remove from sidebar and trigger this
                // event, allowing other controllers to add this PopUpView to their
                // view
                popUpView.removeFromParent();
                _this.view.triggerEvent(ReCalCommonBrowserEvents.popUpWillDetachFromSidebar, {
                    popUpView: popUpView
                });
            });

            // register popup as a droppable object
            this.view.registerDroppable(PopUpView.cssSelector());

            // add listenter for when PopUpView object was dropped into sidebar
            GlobalBrowserEventsManager.instance.attachGlobalEventHandler(ReCalCommonBrowserEvents.popUpWillDetachFromSidebar, function (ev, extra) {
                var popUpView = extra.popUpView;
                _this.addPopUpView(popUpView);
            });
        };

        /**
        * Add a PopUpView object to the Sidebar. PopUpView object
        * must be detached from its previous parent first. If there is an
        * existing PopUpView object, it is removed first and replaced.
        */
        ReCalSidebarViewController.prototype.addPopUpView = function (popUpView) {
            // TODO ensure there is only one main popup (for now)
        };
        return ReCalSidebarViewController;
    })(ViewController);
    
    return ReCalSidebarViewController;
});
