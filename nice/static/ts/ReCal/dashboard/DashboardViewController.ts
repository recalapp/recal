/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import AgendaTableViewController = require('./Agenda/AgendaTableViewController');
import Calendar = require('../../library/Calendar/Calendar');
import CalendarView = require('../../library/Calendar/CalendarView');
import CanvasPopUpContainer = require('../common/CanvasPopUpContainer/CanvasPopUpContainer');
import CanvasPopUpContainerViewController = require('../common/CanvasPopUpContainer/CanvasPopUpContainerViewController');
import CoreUI = require('../../library/CoreUI/CoreUI');
import DashboardCalendarViewController = require('./DashboardCalendar/DashboardCalendarViewController');
import GlobalInstancesManager = require('../common/GlobalInstancesManager');
import Notifications = require('../../library/Notifications/Notifications');
import ReCalSidebar = require('../common/ReCalSidebar/ReCalSidebar');
import ReCalSidebarViewController = require('../common/ReCalSidebar/ReCalSidebarViewController');
import Sidebar = require('../../library/Sidebar/Sidebar');
import SidebarView = require('../../library/Sidebar/SidebarView');
import Table = require('../../library/Table/Table');
import TableView = require('../../library/Table/TableView');
import View = require('../../library/CoreUI/View');
import ViewController = require('../../library/CoreUI/ViewController');

import ICalendarView = Calendar.ICalendarView;
import ICalendarViewController = Calendar.ICalendarViewController;
import ICanvasPopUpContainerViewController = CanvasPopUpContainer.ICanvasPopUpContainerViewController;
import IReCalSidebarViewController = ReCalSidebar.IReCalSidebarViewController;
import ISidebarNotificationsManager = Notifications.ISidebarNotificationsManager;
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

    private _sidebarViewController: IReCalSidebarViewController = null;
    private get sidebarViewController(): IReCalSidebarViewController
    {
        return this._sidebarViewController;
    }
    private set sidebarViewController(value: IReCalSidebarViewController)
    {
        this._sidebarViewController = value;
    }

    private _canvasPopUpContainerViewController: ICanvasPopUpContainerViewController = null;
    private get canvasPopUpContainerViewController(): ICanvasPopUpContainerViewController
    {
        return this._canvasPopUpContainerViewController;
    }
    private set canvasPopUpContainerViewController(value: ICanvasPopUpContainerViewController)
    {
        this._canvasPopUpContainerViewController = value;
    }

    public initialize(): void
    {
        super.initialize();
        this.initializeSidebar();
        this.initializePopUpCanvas();
        this.initializeCalendar();
        this.initializeAgenda();
    }

    private initializeCalendar(): void
    {
        // initialize calendar view
        var calendarView: ICalendarView = <CalendarView> CalendarView.fromJQuery(this.view.findJQuery('#calendarui'));
        var calendarVC: ICalendarViewController = new DashboardCalendarViewController(calendarView);
        this.addChildViewController(calendarVC);
        this.calendarViewController = calendarVC;
    }

    private initializeAgenda(): void
    {
        // initialize agenda view
        var agendaTableView: ITableView = <TableView> TableView.fromJQuery(this.view.findJQuery('#agendaui'));
        var agendaVC: ITableViewController = new AgendaTableViewController(agendaTableView);
        this.addChildViewController(agendaVC);
        this.agendaViewController = agendaVC;
    }
    
    private initializeSidebar(): void
    {
        // initialize sidebar
        var sidebarView: ISidebarView = <SidebarView> SidebarView.fromJQuery(this.view.findJQuery('#sidebar-container'));

        // set sidebar notifications manager's sidebar instance
        (<ISidebarNotificationsManager>GlobalInstancesManager.instance.notificationsManager).sidebarView = sidebarView;

        // initialize sidebar view controller
        var sidebarVC: IReCalSidebarViewController = new ReCalSidebarViewController(sidebarView);
        this.addChildViewController(sidebarVC);
        this.sidebarViewController = sidebarVC;
    }

    private initializePopUpCanvas(): void
    {
        // initialize popup canvas
        var popUpCanvasView: IView = View.fromJQuery(this.view.findJQuery('#popup-canvas'));
        var popUpCanvasVC: ICanvasPopUpContainerViewController = new CanvasPopUpContainerViewController(popUpCanvasView);
        this.addChildViewController(popUpCanvasVC);
        this.canvasPopUpContainerViewController = popUpCanvasVC;
    }
}

export = DashboardViewController;
