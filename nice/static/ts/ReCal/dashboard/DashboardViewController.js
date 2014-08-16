/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Agenda/AgendaTableViewController', '../../library/Calendar/CalendarView', './DashboardCalendar/DashboardCalendarViewController', './GlobalInstancesManager', '../../library/Sidebar/SidebarView', '../../library/Table/TableView', '../../library/CoreUI/ViewController'], function(require, exports, AgendaTableViewController, CalendarView, DashboardCalendarViewController, GlobalInstancesManager, SidebarView, TableView, ViewController) {
    var DashboardViewController = (function (_super) {
        __extends(DashboardViewController, _super);
        function DashboardViewController() {
            _super.apply(this, arguments);
            this._calendarViewController = null;
            this._agendaViewController = null;
            this._sidebarView = null;
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

        Object.defineProperty(DashboardViewController.prototype, "sidebarView", {
            get: function () {
                return this._sidebarView;
            },
            set: function (value) {
                this._sidebarView = value;
            },
            enumerable: true,
            configurable: true
        });

        DashboardViewController.prototype.initialize = function () {
            _super.prototype.initialize.call(this);

            // initialize calendar view
            var calendarView = CalendarView.fromJQuery(this.view.findJQuery('#calendarui'));
            var calendarVC = new DashboardCalendarViewController(calendarView);
            this.addChildViewController(calendarVC);
            this.calendarViewController = calendarVC;

            // initialize agenda view
            var agendaTableView = TableView.fromJQuery(this.view.findJQuery('#agendaui'));
            var agendaVC = new AgendaTableViewController(agendaTableView);
            this.addChildViewController(agendaVC);
            this.agendaViewController = agendaVC;

            // initialize sidebar
            var sidebarView = SidebarView.fromJQuery(this.view.findJQuery('#sidebar-container'));
            this.sidebarView = sidebarView;

            // set sidebar notifications manager's sidebar instance
            GlobalInstancesManager.instance.notificationsManager.sidebarView = sidebarView;
        };
        return DashboardViewController;
    })(ViewController);

    
    return DashboardViewController;
});
