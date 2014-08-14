/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Agenda/AgendaTableViewController', '../../library/Calendar/CalendarView', './DashboardCalendar/DashboardCalendarViewController', '../../library/Table/TableView', '../../library/CoreUI/ViewController'], function(require, exports, AgendaTableViewController, CalendarView, DashboardCalendarViewController, TableView, ViewController) {
    var DashboardViewController = (function (_super) {
        __extends(DashboardViewController, _super);
        function DashboardViewController() {
            _super.apply(this, arguments);
        }
        DashboardViewController.prototype.initialize = function () {
            _super.prototype.initialize.call(this);

            // initialize calendar view
            var calendarView = CalendarView.fromJQuery(this.view.findJQuery('#calendarui'));
            var calendarVC = new DashboardCalendarViewController(calendarView);
            this.addChildViewController(calendarVC);

            // initialize agenda view
            var agendaTableView = TableView.fromJQuery(this.view.findJQuery('#agendaui'));
            var agendaVC = new AgendaTableViewController(agendaTableView);
            this.addChildViewController(agendaVC);
        };
        return DashboardViewController;
    })(ViewController);

    
    return DashboardViewController;
});
