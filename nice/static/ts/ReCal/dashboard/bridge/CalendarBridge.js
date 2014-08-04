/// <reference path="../../../typings/tsd.d.ts" />
define(["require", "exports", 'jquery', '../../../library/Calendar/CalendarView', '../Calendar/DashboardCalendarViewController', "dashboard"], function(require, exports, $, CalendarView, DashboardCalendarViewController) {
    var calendarView = CalendarView.fromJQuery($('#calendar'));
    var calendarVC;

    function Cal_init() {
        calendarVC = new DashboardCalendarViewController(calendarView);
    }
    function Cal_reload() {
        calendarVC.reload();
    }
    window.Cal_init = Cal_init;
    window.Cal_reload = Cal_reload;

    Cal_init();
});
