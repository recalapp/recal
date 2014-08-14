/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import AgendaTableViewController = require('./Agenda/AgendaTableViewController');
import Calendar = require('../../library/Calendar/Calendar');
import CalendarView = require('../../library/Calendar/CalendarView');
import CoreUI = require('../../library/CoreUI/CoreUI');
import DashboardCalendarViewController = require('./DashboardCalendar/DashboardCalendarViewController');
import Table = require('../../library/Table/Table');
import TableView = require('../../library/Table/TableView');
import ViewController = require('../../library/CoreUI/ViewController');

import ICalendarView = Calendar.ICalendarView;
import ICalendarViewController = Calendar.ICalendarViewController;
import ITableView = Table.ITableView;
import ITableViewController = Table.ITableViewController;
import IView = CoreUI.IView;

class DashboardViewController extends ViewController
{
    public initialize(): void
    {
        super.initialize();
        
        // initialize calendar view
        var calendarView: ICalendarView = <CalendarView> CalendarView.fromJQuery(this.view.findJQuery('#calendarui'));
        var calendarVC: ICalendarViewController = new DashboardCalendarViewController(calendarView);
        this.addChildViewController(calendarVC);
        
        // initialize agenda view
        var agendaTableView: ITableView = <TableView> TableView.fromJQuery(this.view.findJQuery('#agendaui'));
        var agendaVC: ITableViewController = new AgendaTableViewController(agendaTableView);
        this.addChildViewController(agendaVC);
    }
}

export = DashboardViewController;
