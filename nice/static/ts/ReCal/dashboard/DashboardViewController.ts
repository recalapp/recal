/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import AgendaTableViewController = require('./Agenda/AgendaTableViewController');
import Calendar = require('../../library/Calendar/Calendar');
import CalendarView = require('../../library/Calendar/CalendarView');
import CoreUI = require('../../library/CoreUI/CoreUI');
import DashboardCalendarViewController = require('./DashboardCalendar/DashboardCalendarViewController');
import GlobalInstancesManager = require('./GlobalInstancesManager');
import Sidebar = require('../../library/Sidebar/Sidebar');
import SidebarView = require('../../library/Sidebar/SidebarView');
import Table = require('../../library/Table/Table');
import TableView = require('../../library/Table/TableView');
import ViewController = require('../../library/CoreUI/ViewController');

import ICalendarView = Calendar.ICalendarView;
import ICalendarViewController = Calendar.ICalendarViewController;
import ISidebarView = Sidebar.ISidebarView;
import ITableView = Table.ITableView;
import ITableViewController = Table.ITableViewController;
import IView = CoreUI.IView;

class DashboardViewController extends ViewController
{
    private _calendarViewController: ICalendarViewController = null;
    private get calendarViewController(): ICalendarViewController 
    {
        return this._calendarViewController;
    }
    private set calendarViewController(value: ICalendarViewController)
    {
        this._calendarViewController = value;
    }

    private _agendaViewController: ITableViewController = null;
    private get agendaViewController(): ITableViewController
    {
        return this._agendaViewController;
    }
    private set agendaViewController(value: ITableViewController)
    {
        this._agendaViewController = value;
    }

    private _sidebarView: ISidebarView = null;
    private get sidebarView(): ISidebarView
    {
        return this._sidebarView;
    }
    private set sidebarView(value: ISidebarView)
    {
        this._sidebarView = value;
    }

    public initialize(): void
    {
        super.initialize();
        
        // initialize calendar view
        var calendarView: ICalendarView = <CalendarView> CalendarView.fromJQuery(this.view.findJQuery('#calendarui'));
        var calendarVC: ICalendarViewController = new DashboardCalendarViewController(calendarView);
        this.addChildViewController(calendarVC);
        this.calendarViewController = calendarVC;
        
        // initialize agenda view
        var agendaTableView: ITableView = <TableView> TableView.fromJQuery(this.view.findJQuery('#agendaui'));
        var agendaVC: ITableViewController = new AgendaTableViewController(agendaTableView);
        this.addChildViewController(agendaVC);
        this.agendaViewController = agendaVC;

        // initialize sidebar
        var sidebarView: ISidebarView = <SidebarView> SidebarView.fromJQuery(this.view.findJQuery('#sidebar-container'));
        this.sidebarView = sidebarView;

        // set sidebar notifications manager's sidebar instance
        GlobalInstancesManager.instance.notificationsManager.sidebarView = sidebarView;
    }
}

export = DashboardViewController;
