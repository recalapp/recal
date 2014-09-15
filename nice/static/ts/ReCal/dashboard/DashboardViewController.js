/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Agenda/AgendaTableViewController', '../../library/Calendar/CalendarView', '../common/CanvasPopUpContainer/CanvasPopUpContainerViewController', './DashboardCalendar/DashboardCalendarViewController', '../../library/Core/GlobalBrowserEventsManager', '../common/GlobalInstancesManager', '../common/ReCalCommonBrowserEvents', '../common/ReCalSidebar/ReCalSidebarViewController', '../../library/Sidebar/SidebarView', '../../library/Table/TableView', '../../library/CoreUI/View', '../../library/CoreUI/ViewController'], function(require, exports, AgendaTableViewController, CalendarView, CanvasPopUpContainerViewController, DashboardCalendarViewController, GlobalBrowserEventsManager, GlobalInstancesManager, ReCalCommonBrowserEvents, ReCalSidebarViewController, SidebarView, TableView, View, ViewController) {
    var DashboardViewController = (function (_super) {
        __extends(DashboardViewController, _super);
        function DashboardViewController() {
            _super.apply(this, arguments);
            this._calendarViewController = null;
            this._agendaViewController = null;
            this._sidebarViewController = null;
            this._canvasPopUpContainerViewController = null;
        }
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
            var _this = this;
            _super.prototype.initialize.call(this);
            this.initializeSidebar();
            this.initializePopUpCanvas();

            // setup logic between sidebar and popup canvas
            // when popup detaches from sidebar
            GlobalBrowserEventsManager.instance.attachGlobalEventHandler(ReCalCommonBrowserEvents.popUpWillDetachFromSidebar, function (ev, extra) {
                _this.canvasPopUpContainerViewController.addPopUpView(extra.popUpView);
            });

            // when popup is released onto sidebar:
            this.initializeCalendar();
            this.initializeAgenda();
        };

        DashboardViewController.prototype.initializeCalendar = function () {
            // initialize calendar view
            var calendarView = CalendarView.fromJQuery(this.view.findJQuery('#calendarui'));
            var calendarVC = new DashboardCalendarViewController(calendarView);
            this.addChildViewController(calendarVC);
            this.calendarViewController = calendarVC;
        };

        DashboardViewController.prototype.initializeAgenda = function () {
            // initialize agenda view
            var agendaTableView = TableView.fromJQuery(this.view.findJQuery('#agendaui'));
            var agendaVC = new AgendaTableViewController(agendaTableView);
            this.addChildViewController(agendaVC);
            this.agendaViewController = agendaVC;
        };

        DashboardViewController.prototype.initializeSidebar = function () {
            // initialize sidebar
            var sidebarView = SidebarView.fromJQuery(this.view.findJQuery('#sidebar-container'));

            // set sidebar notifications manager's sidebar instance
            GlobalInstancesManager.instance.notificationsManager.sidebarView = sidebarView;

            // initialize sidebar view controller
            var sidebarVC = new ReCalSidebarViewController(sidebarView);
            this.addChildViewController(sidebarVC);
            this.sidebarViewController = sidebarVC;
        };

        DashboardViewController.prototype.initializePopUpCanvas = function () {
            // initialize popup canvas
            var popUpCanvasView = View.fromJQuery(this.view.findJQuery('#popup-canvas'));
            var popUpCanvasVC = new CanvasPopUpContainerViewController(popUpCanvasView);
            this.addChildViewController(popUpCanvasVC);
            this.canvasPopUpContainerViewController = popUpCanvasVC;
        };
        return DashboardViewController;
    })(ViewController);

    
    return DashboardViewController;
});
