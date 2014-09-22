/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Agenda/AgendaTableViewController', '../../library/Calendar/CalendarView', '../common/CanvasPopUpContainer/CanvasPopUpContainerViewController', '../../library/ClickToEdit/ClickToEditViewFactory', './DashboardCalendar/DashboardCalendarViewController', '../common/Events/EventsOperationsFacade', '../../library/Core/GlobalBrowserEventsManager', '../common/ReCalSidebar/ReCalSidebarViewController', '../../library/Sidebar/SidebarView', '../../library/Notifications/SidebarNotificationsManager', '../../library/Table/TableView', '../../library/CoreUI/View', '../../library/CoreUI/ViewController', '../../library/CoreUI/ViewTemplateRetriever'], function(require, exports, AgendaTableViewController, CalendarView, CanvasPopUpContainerViewController, ClickToEditViewFactory, DashboardCalendarViewController, EventsOperationsFacade, GlobalBrowserEventsManager, ReCalSidebarViewController, SidebarView, SidebarNotificationsManager, TableView, View, ViewController, ViewTemplateRetriever) {
    var DashboardViewController = (function (_super) {
        __extends(DashboardViewController, _super);
        function DashboardViewController(view) {
            _super.call(this, view);
            /**
            * Global Browser Events Manager
            */
            this._globalBrowserEventsManager = null;
            /**
            * Notifications Manager
            */
            this._notificationsManager = null;
            /**
            * View template retriever
            */
            this._viewTemplateRetriever = null;
            /**
            * Events Operations Facade
            */
            this._eventsOperationsFacade = null;
            this._clickToEditViewFactory = null;
            /**
            * Calendar view controller
            */
            this._calendarViewController = null;
            /**
            * Agenda View Controller
            */
            this._agendaViewController = null;
            /**
            * Sidebar View Controller
            */
            this._sidebarViewController = null;
            /**
            * Canvas PopUp Container View Controller
            */
            this._canvasPopUpContainerViewController = null;
            this.initialize();
        }
        Object.defineProperty(DashboardViewController.prototype, "globalBrowserEventsManager", {
            get: function () {
                if (!this._globalBrowserEventsManager) {
                    this._globalBrowserEventsManager = new GlobalBrowserEventsManager();
                }
                return this._globalBrowserEventsManager;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DashboardViewController.prototype, "notificationsManager", {
            get: function () {
                if (!this._notificationsManager) {
                    this._notificationsManager = new SidebarNotificationsManager;
                }
                return this._notificationsManager;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DashboardViewController.prototype, "viewTemplateRetriever", {
            get: function () {
                if (!this._viewTemplateRetriever) {
                    this._viewTemplateRetriever = new ViewTemplateRetriever();
                }
                return this._viewTemplateRetriever;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DashboardViewController.prototype, "eventsOperationsFacade", {
            get: function () {
                if (!this._eventsOperationsFacade) {
                    this._eventsOperationsFacade = new EventsOperationsFacade({
                        globalBrowserEventsManager: this.globalBrowserEventsManager
                    });
                }
                return this._eventsOperationsFacade;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DashboardViewController.prototype, "clickToEditViewFactory", {
            get: function () {
                if (!this._clickToEditViewFactory) {
                    this._clickToEditViewFactory = new ClickToEditViewFactory();
                }
                return this._clickToEditViewFactory;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DashboardViewController.prototype, "calendarViewController", {
            get: function () {
                return this._calendarViewController;
            },
            set: function (value) {
                this._calendarViewController = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DashboardViewController.prototype, "agendaViewController", {
            get: function () {
                return this._agendaViewController;
            },
            set: function (value) {
                this._agendaViewController = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DashboardViewController.prototype, "sidebarViewController", {
            get: function () {
                return this._sidebarViewController;
            },
            set: function (value) {
                this._sidebarViewController = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DashboardViewController.prototype, "canvasPopUpContainerViewController", {
            get: function () {
                return this._canvasPopUpContainerViewController;
            },
            set: function (value) {
                this._canvasPopUpContainerViewController = value;
            },
            enumerable: true,
            configurable: true
        });

        DashboardViewController.prototype.initialize = function () {
            this.initializeSidebar();
            this.initializePopUpCanvas();
            this.initializeCalendar();
            this.initializeAgenda();
        };

        DashboardViewController.prototype.initializeCalendar = function () {
            // initialize calendar view
            var calendarView = CalendarView.fromJQuery(this.view.findJQuery('#calendarui'));
            var calendarVC = new DashboardCalendarViewController(calendarView, {
                eventsOperationsFacade: this.eventsOperationsFacade
            });
            this.addChildViewController(calendarVC);
            this.calendarViewController = calendarVC;
        };

        DashboardViewController.prototype.initializeAgenda = function () {
            // initialize agenda view
            var agendaTableView = TableView.fromJQuery(this.view.findJQuery('#agendaui'));
            var agendaVC = new AgendaTableViewController(agendaTableView, {
                viewTemplateRetriever: this.viewTemplateRetriever,
                eventsOperationsFacade: this.eventsOperationsFacade,
                globalBrowserEventsManager: this.globalBrowserEventsManager
            });
            this.addChildViewController(agendaVC);
            this.agendaViewController = agendaVC;
        };

        DashboardViewController.prototype.initializeSidebar = function () {
            // initialize sidebar
            var sidebarView = SidebarView.fromJQuery(this.view.findJQuery('#sidebar-container'));

            // set sidebar notifications manager's sidebar instance
            this.notificationsManager.sidebarView = sidebarView;

            // initialize sidebar view controller
            var sidebarVC = new ReCalSidebarViewController(sidebarView, {
                viewTemplateRetriever: this.viewTemplateRetriever,
                globalBrowserEventsManager: this.globalBrowserEventsManager,
                eventsOperationsFacade: this.eventsOperationsFacade,
                clickToEditViewFactory: this.clickToEditViewFactory
            });
            this.addChildViewController(sidebarVC);
            this.sidebarViewController = sidebarVC;
        };

        DashboardViewController.prototype.initializePopUpCanvas = function () {
            // initialize popup canvas
            // NOTE #popup-canvas div is only used to set the bounds. the actual div
            // that we attach popup to is the body.
            var popUpCanvasView = View.fromJQuery(this.view.findJQuery('#popup-canvas'));
            var popUpCanvasVC = new CanvasPopUpContainerViewController(popUpCanvasView, {
                globalBrowserEventsManager: this.globalBrowserEventsManager,
                canvasView: this.view,
                clickToEditViewFactory: this.clickToEditViewFactory
            });
            this.addChildViewController(popUpCanvasVC);
            this.canvasPopUpContainerViewController = popUpCanvasVC;
        };
        return DashboardViewController;
    })(ViewController);

    
    return DashboardViewController;
});
