/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Agenda/AgendaTableViewController', '../../library/Calendar/CalendarView', '../common/CanvasPopUpContainer/CanvasPopUpContainerViewController', '../../library/ClickToEdit/ClickToEditViewFactory', './DashboardCalendar/DashboardCalendarViewController', '../common/EventsPopUp/EventsPopUpViewFactory', '../common/Events/EventsOperationsFacade', '../../library/Core/GlobalBrowserEventsManager', '../../library/Indicators/IndicatorsContainerView', '../../library/Indicators/IndicatorsManager', '../../library/Indicators/IndicatorsType', '../common/ReCalCommonBrowserEvents', '../common/ReCalSidebar/ReCalSidebarViewController', './Settings/SettingsView', './Settings/SettingsViewController', '../../library/Sidebar/SidebarView', '../../library/Notifications/SidebarNotificationsManager', '../../library/Table/TableView', '../common/UserProfiles/UserProfilesServerCommunicator', '../../library/CoreUI/View', '../../library/CoreUI/ViewController', '../../library/CoreUI/ViewTemplateRetriever'], function(require, exports, AgendaTableViewController, CalendarView, CanvasPopUpContainerViewController, ClickToEditViewFactory, DashboardCalendarViewController, EventsPopUpViewFactory, EventsOperationsFacade, GlobalBrowserEventsManager, IndicatorsContainerView, IndicatorsManager, IndicatorsType, ReCalCommonBrowserEvents, ReCalSidebarViewController, SettingsView, SettingsViewController, SidebarView, SidebarNotificationsManager, TableView, UserProfilesServerCommunicator, View, ViewController, ViewTemplateRetriever) {
    var DashboardViewController = (function (_super) {
        __extends(DashboardViewController, _super);
        function DashboardViewController(view, dependencies) {
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
            * @type IEventsOperationsFacade
            * @private
            */
            this._eventsOperationsFacade = null;
            /**
            * click to edit view factory
            * @type IClickToEditViewFactory
            * @private
            */
            this._clickToEditViewFactory = null;
            /**
            * IndicatorsManager
            * @type IIndicatorsManager
            * @private
            */
            this._indicatorsManager = null;
            /**
            * Events Pop Up View Factory
            * @type {IEventsPopUpViewFactory}
            * @private
            */
            this._eventsPopUpViewFactory = null;
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
            this._settingsViewController = null;
            /**
            * The logged in user
            * @type {IUserProfilesMode}
            * @private
            */
            this._user = null;
            this._userProfilesServerCommunicator = null;
            this._user = dependencies.user;
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

        Object.defineProperty(DashboardViewController.prototype, "indicatorsManager", {
            get: function () {
                if (!this._indicatorsManager) {
                    this._indicatorsManager = new IndicatorsManager();
                    this._indicatorsManager.indicatorsContainerView = IndicatorsContainerView.fromJQuery(this.view.findJQuery('#indicators-container'));
                }
                return this._indicatorsManager;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DashboardViewController.prototype, "eventsPopUpViewFactory", {
            get: function () {
                if (!this._eventsPopUpViewFactory) {
                    this._eventsPopUpViewFactory = new EventsPopUpViewFactory({
                        clickToEditViewFactory: this.clickToEditViewFactory,
                        viewTemplateRetriever: this.viewTemplateRetriever,
                        user: this.user
                    });
                }
                return this._eventsPopUpViewFactory;
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


        Object.defineProperty(DashboardViewController.prototype, "settingsViewController", {
            get: function () {
                return this._settingsViewController;
            },
            set: function (value) {
                this._settingsViewController = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DashboardViewController.prototype, "user", {
            get: function () {
                return this._user;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DashboardViewController.prototype, "userProfilesServerCommunicator", {
            get: function () {
                if (!this._userProfilesServerCommunicator) {
                    this._userProfilesServerCommunicator = new UserProfilesServerCommunicator();
                }
                return this._userProfilesServerCommunicator;
            },
            enumerable: true,
            configurable: true
        });

        DashboardViewController.prototype.initialize = function () {
            //this.userProfilesServerCommunicator.updateUserProfile(this.user).done((user: IUserProfilesModel)=>{
            //    this._user = user;
            //        });
            this.setUpEventsServerCommunicationIndicators();
            this.initializeSidebar();
            this.initializePopUpCanvas();
            this.initializeCalendar();
            this.initializeAgenda();
            this.initializeSettings();
        };

        DashboardViewController.prototype.setUpEventsServerCommunicationIndicators = function () {
            var _this = this;
            var errorDownloading = false;
            this.globalBrowserEventsManager.attachGlobalEventHandler(ReCalCommonBrowserEvents.eventsWillBeginDownloading, function () {
                if (!errorDownloading) {
                    _this.indicatorsManager.showIndicator("events_download", 0 /* persistent */, "Loading events...");
                }
            });
            this.globalBrowserEventsManager.attachGlobalEventHandler(ReCalCommonBrowserEvents.eventsDidFinishDownloading, function () {
                _this.indicatorsManager.hideIndicatorWithIdentifier("events_download");
                if (errorDownloading) {
                    errorDownloading = false;
                    _this.indicatorsManager.showIndicator("events_success", 1 /* temporary */, "Connected :)");
                }
            });
            this.globalBrowserEventsManager.attachGlobalEventHandler(ReCalCommonBrowserEvents.eventsDidFailDownloading, function () {
                _this.indicatorsManager.hideIndicatorWithIdentifier("events_download");
                errorDownloading = true;
                _this.indicatorsManager.showIndicator("events_download", 2 /* error */, "Error connecting.");
            });
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
                indicatorsManager: this.indicatorsManager,
                globalBrowserEventsManager: this.globalBrowserEventsManager,
                user: this.user
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
                globalBrowserEventsManager: this.globalBrowserEventsManager,
                eventsPopUpViewFactory: this.eventsPopUpViewFactory,
                eventsOperationsFacade: this.eventsOperationsFacade
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
                canvasView: this.view,
                clickToEditViewFactory: this.clickToEditViewFactory,
                eventsOperationsFacade: this.eventsOperationsFacade,
                globalBrowserEventsManager: this.globalBrowserEventsManager
            });
            this.addChildViewController(popUpCanvasVC);
            this.canvasPopUpContainerViewController = popUpCanvasVC;
        };

        DashboardViewController.prototype.initializeSettings = function () {
            var settingsView = SettingsView.fromJQuery(this.view.findJQuery('#settingsModal'));
            this.settingsViewController = new SettingsViewController(settingsView, {
                eventsOperationsFacade: this.eventsOperationsFacade,
                globalBrowserEventsManager: this.globalBrowserEventsManager,
                user: this.user
            });
            this.addChildViewController(this.settingsViewController);
        };
        return DashboardViewController;
    })(ViewController);

    
    return DashboardViewController;
});
//# sourceMappingURL=DashboardViewController.js.map
