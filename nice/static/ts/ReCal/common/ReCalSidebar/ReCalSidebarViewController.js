/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Core/BrowserEvents', '../EventsPopUp/EventsPopUpView', '../../../library/Core/GlobalBrowserEventsManager', '../GlobalInstancesManager', '../ReCalCommonBrowserEvents', '../../../library/CoreUI/ViewController'], function(require, exports, BrowserEvents, EventsPopUpView, GlobalBrowserEventsManager, GlobalInstancesManager, ReCalCommonBrowserEvents, ViewController) {
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
            this._currentPopUpView = null;
        }
        Object.defineProperty(ReCalSidebarViewController.prototype, "currentPopUpView", {
            get: function () {
                return this._currentPopUpView;
            },
            set: function (value) {
                this._currentPopUpView = value;
            },
            enumerable: true,
            configurable: true
        });

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
                _this.removePopUpView(popUpView);
                _this.view.triggerEvent(ReCalCommonBrowserEvents.popUpWillDetachFromSidebar, {
                    popUpView: popUpView
                });

                // now also update the event selection state by pinning the event
                GlobalInstancesManager.instance.eventsManager.pinEventWithId(popUpView.eventsModel.eventId);
            });

            // register popup as a droppable object
            this.view.registerDroppable(EventsPopUpView.cssSelector());

            // add listener for when PopUpView object was dropped into sidebar
            GlobalBrowserEventsManager.instance.attachGlobalEventHandler(ReCalCommonBrowserEvents.popUpWasDroppedInSidebar, function (ev, extra) {
                var popUpView = extra.popUpView;
                _this.addPopUpView(popUpView);

                // update event selection state
                GlobalInstancesManager.instance.eventsManager.unpinEventWithId(popUpView.eventsModel.eventId);
            });

            // add listener for when event selection state changes
            GlobalBrowserEventsManager.instance.attachGlobalEventHandler(ReCalCommonBrowserEvents.eventSelectionChanged, function (ev, extra) {
                var eventId = extra.eventId;
                if (eventId === null || eventId === undefined) {
                    // TODO get the main popup, then do stuffs
                    return;
                }
                if (GlobalInstancesManager.instance.eventsManager.eventIdIsMain(eventId)) {
                    // this event is supposed to be main
                    if (_this.currentPopUpView === null || _this.currentPopUpView === undefined) {
                        // create the popup view
                        _this.currentPopUpView = new EventsPopUpView();

                        // TODO set events model
                        // this.currentPopUpView.eventsModel =
                        _this.addPopUpView(_this.currentPopUpView);
                    }
                } else {
                    // event is no longer main. if it matches our current
                    // popup, then remove the popup
                    if (_this.currentPopUpView && _this.currentPopUpView.eventsModel.eventId === eventId) {
                        _this.removePopUpView(_this.currentPopUpView);
                    }
                }
            });
        };

        /**
        * Add a PopUpView object to the Sidebar. PopUpView object
        * must be detached from its previous parent first. If there is an
        * existing PopUpView object, it is removed first and replaced.
        */
        ReCalSidebarViewController.prototype.addPopUpView = function (popUpView) {
            // ensure there is only one main popup (for now)
            if (this.currentPopUpView !== null) {
                this.removePopUpView(this.currentPopUpView);
            }
            this.currentPopUpView = popUpView;
            this.view.pushStackViewWithIdentifier(this.currentPopUpView, this.getIdentifierForPopUpView(this.currentPopUpView));
        };

        /**
        * Remove the popup from sidebar
        */
        ReCalSidebarViewController.prototype.removePopUpView = function (popUpView) {
            if (this.currentPopUpView === popUpView) {
                this.currentPopUpView = null;
            }
            this.view.popStackViewWithIdentifier(this.getIdentifierForPopUpView(popUpView));
        };

        /**
        * Get the stack view identifier for this popUpView.
        * TODO make unique if we want to support multiple popups in sidebar
        */
        ReCalSidebarViewController.prototype.getIdentifierForPopUpView = function (popUpView) {
            return ReCalSidebarViewController.SIDEBAR_POPUP_PREFIX;
        };
        ReCalSidebarViewController.SIDEBAR_POPUP_PREFIX = 'sidebar_popup_';
        return ReCalSidebarViewController;
    })(ViewController);
    
    return ReCalSidebarViewController;
});
