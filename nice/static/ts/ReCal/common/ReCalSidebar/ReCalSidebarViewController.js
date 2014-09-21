/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Core/BrowserEvents', '../EventsPopUp/EventsPopUpView', '../ReCalCommonBrowserEvents', '../../../library/CoreUI/ViewController'], function(require, exports, BrowserEvents, EventsPopUpView, ReCalCommonBrowserEvents, ViewController) {
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
        function ReCalSidebarViewController(sidebarView, dependencies) {
            _super.call(this, sidebarView);
            this._currentPopUpView = null;
            /**
            * Global Browser Events Manager
            */
            this._globalBrowserEventsManager = null;
            /**
            * View template retriever
            */
            this._viewTemplateRetriever = null;
            /**
            * Events Operations Facade
            */
            this._eventsOperationsFacade = null;
            this._globalBrowserEventsManager = dependencies.globalBrowserEventsManager;
            this._viewTemplateRetriever = dependencies.viewTemplateRetriever;
            this._eventsOperationsFacade = dependencies.eventsOperationsFacade;
            this.initializePopUp();
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

        Object.defineProperty(ReCalSidebarViewController.prototype, "globalBrowserEventsManager", {
            get: function () {
                return this._globalBrowserEventsManager;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ReCalSidebarViewController.prototype, "viewTemplateRetriever", {
            get: function () {
                return this._viewTemplateRetriever;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ReCalSidebarViewController.prototype, "eventsOperationsFacade", {
            get: function () {
                return this._eventsOperationsFacade;
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
                var absoluteTop = popUpView.absoluteTop;
                var absoluteLeft = popUpView.absoluteLeft;
                var width = popUpView.width;
                var height = popUpView.height;
                _this.removePopUpView(popUpView, false);
                _this.view.triggerEvent(ReCalCommonBrowserEvents.popUpWillDetachFromSidebar, {
                    popUpView: popUpView,
                    absoluteTop: absoluteTop,
                    absoluteLeft: absoluteLeft,
                    width: width,
                    height: height
                });

                // now also update the event selection state by pinning the event
                _this.eventsOperationsFacade.pinEventWithId(popUpView.eventsModel.eventId);
            });

            // register popup as a droppable object
            this.view.registerDroppable(EventsPopUpView.cssSelector());

            // add listener for when PopUpView object was dropped into sidebar
            this.globalBrowserEventsManager.attachGlobalEventHandler(ReCalCommonBrowserEvents.popUpWasDroppedInSidebar, function (ev, extra) {
                var popUpView = extra.popUpView;
                var oldId = null;
                if (_this.currentPopUpView) {
                    oldId = _this.currentPopUpView.eventsModel.eventId;
                }
                _this.addPopUpView(popUpView);

                // update event selection state
                _this.eventsOperationsFacade.unpinEventWithId(popUpView.eventsModel.eventId);
                if (oldId !== null) {
                    _this.eventsOperationsFacade.deselectEventWithId(oldId);
                }
            });

            // add listener for when event selection state changes
            this.globalBrowserEventsManager.attachGlobalEventHandler(ReCalCommonBrowserEvents.eventSelectionChanged, function (ev, extra) {
                if (extra === null || extra === undefined || extra.eventIds === null || extra.eventIds === undefined) {
                    // can't tell anything. must check everything.
                    return;
                }
                var eventIds = extra.eventIds;
                var mainEventId = null;
                for (var i = 0; i < eventIds.length; ++i) {
                    if (_this.eventsOperationsFacade.eventIdIsMain(eventIds[i])) {
                        mainEventId = eventIds[i];
                        break;
                    }
                }
                if (mainEventId !== null) {
                    // this event is supposed to be main
                    if (_this.currentPopUpView === null || _this.currentPopUpView === undefined) {
                        // create the popup view
                        var newPopUpView = new EventsPopUpView({
                            viewTemplateRetriever: _this.viewTemplateRetriever
                        });

                        // set events model
                        var eventsModel = _this.eventsOperationsFacade.getEventById(mainEventId);
                        newPopUpView.eventsModel = eventsModel;
                        _this.addPopUpView(newPopUpView);
                    } else {
                        // set events model
                        var eventsModel = _this.eventsOperationsFacade.getEventById(mainEventId);
                        if (_this.currentPopUpView.eventsModel.eventId !== eventsModel.eventId) {
                            var oldId = _this.currentPopUpView.eventsModel.eventId;
                            _this.currentPopUpView.eventsModel = eventsModel;
                            _this.eventsOperationsFacade.deselectEventWithId(oldId);
                        }
                    }
                    _this.currentPopUpView.focus();
                } else {
                    // event is no longer main. if it matches our current
                    // popup, then remove the popup
                    if (_this.currentPopUpView && eventIds.contains(_this.currentPopUpView.eventsModel.eventId)) {
                        // everything in eventIds is not main, so we can safely remove this main popup
                        _this.removePopUpView(_this.currentPopUpView, true);
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
                this.removePopUpView(this.currentPopUpView, false);
            }
            this.currentPopUpView = popUpView;
            this.view.pushStackViewWithIdentifier(this.currentPopUpView, this.getIdentifierForPopUpView(this.currentPopUpView));
        };

        /**
        * Remove the popup from sidebar
        */
        ReCalSidebarViewController.prototype.removePopUpView = function (popUpView, animated) {
            if (this.currentPopUpView === popUpView) {
                this.currentPopUpView = null;
            }
            if (this.view.containsStackViewWithIdentifier(this.getIdentifierForPopUpView(popUpView))) {
                this.view.popStackViewWithIdentifier(this.getIdentifierForPopUpView(popUpView), animated);
            }
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
