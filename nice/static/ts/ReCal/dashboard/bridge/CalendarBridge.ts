/// <reference path="../../../typings/tsd.d.ts" />

/// <amd-dependency path="dashboard" />

import $ = require('jquery');

import CalendarView = require('../../../library/Calendar/CalendarView');
import DashboardCalendarViewController = require('../DashboardCalendar/DashboardCalendarViewController');
import ICalendarView = require('../../../library/Calendar/ICalendarView');

var calendarView: ICalendarView = <CalendarView> CalendarView.fromJQuery($('#calendarui'));
var calendarVC: DashboardCalendarViewController;

function Cal_init()
{
    calendarVC = new DashboardCalendarViewController(calendarView);
}
function Cal_reload()
{
    calendarVC.reload();
}
(<any>window).Cal_init = Cal_init;
(<any>window).Cal_reload = Cal_reload;

Cal_init();
