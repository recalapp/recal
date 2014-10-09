/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import Calendar = require('../../library/Calendar/Calendar');
import CalendarView = require('../../library/Calendar/CalendarView');
import CoreUI = require('../../library/CoreUI/CoreUI');
import NiceCalendarViewController = require('./NiceCalendar/NiceCalendarViewController');
import Events = require('../common/Events/Events');
import EventsOperationsFacade = require('../common/Events/EventsOperationsFacade');
import GlobalBrowserEventsManager = require('../../library/Core/GlobalBrowserEventsManager');
import Notifications = require('../../library/Notifications/Notifications');
import ReCalSidebar = require('../common/ReCalSidebar/ReCalSidebar');
import ReCalSidebarViewController = require('../common/ReCalSidebar/ReCalSidebarViewController');
import Sidebar = require('../../library/Sidebar/Sidebar');
import SidebarView = require('../../library/Sidebar/SidebarView');
import SidebarNotificationsManager = require('../../library/Notifications/SidebarNotificationsManager');
import Table = require('../../library/Table/Table');
import TableView = require('../../library/Table/TableView');
import View = require('../../library/CoreUI/View');
import ViewController = require('../../library/CoreUI/ViewController');
import ViewTemplateRetriever = require('../../library/CoreUI/ViewTemplateRetriever');

import ICalendarView = Calendar.ICalendarView;
import ICalendarViewController = Calendar.ICalendarViewController;
import IEventsOperationsFacade = Events.IEventsOperationsFacade;
import ISidebarView = Sidebar.ISidebarView;
import ITableView = Table.ITableView;
import ITableViewController = Table.ITableViewController;
import IView = CoreUI.IView;
import IViewTemplateRetriever = CoreUI.IViewTemplateRetriever;

class NiceViewController extends ViewController
{
    /**
     * Global Browser Events Manager
     */
    private _globalBrowserEventsManager: GlobalBrowserEventsManager = null;
    private get globalBrowserEventsManager(): GlobalBrowserEventsManager
    {
        if (!this._globalBrowserEventsManager)
        {
            this._globalBrowserEventsManager = new GlobalBrowserEventsManager();
        }
        return this._globalBrowserEventsManager;
    }

    /**
     * View template retriever
     */
    private _viewTemplateRetriever: IViewTemplateRetriever = null;
    private get viewTemplateRetriever(): IViewTemplateRetriever
    {
        if (!this._viewTemplateRetriever)
        {
            this._viewTemplateRetriever = new ViewTemplateRetriever();
        }
        return this._viewTemplateRetriever;
    }

    /**
     * Events Operations Facade
     */
    private _eventsOperationsFacade: IEventsOperationsFacade = null;
    private get eventsOperationsFacade(): IEventsOperationsFacade
    {
        if (!this._eventsOperationsFacade)
        {
            this._eventsOperationsFacade = new EventsOperationsFacade({
                globalBrowserEventsManager: this.globalBrowserEventsManager,
            });
        }
        return this._eventsOperationsFacade;
    }

    /**
     * Calendar view controller
     */
    private _calendarViewController: ICalendarViewController = null;
    private get calendarViewController(): ICalendarViewController { return this._calendarViewController; }

    private set calendarViewController(value: ICalendarViewController) { this._calendarViewController = value; }

    constructor(view: IView)
    {
        super(view);
        this.initialize();
    }

    private initialize(): void
    {
        this.initializeCalendar();
    }

    private initializeCalendar(): void
    {
        // initialize calendar view
        var calendarView: ICalendarView = <CalendarView> CalendarView.fromJQuery(this.view.findJQuery('#calendarui'));
        var calendarVC: ICalendarViewController = new NiceCalendarViewController(calendarView, {
            eventsOperationsFacade: this.eventsOperationsFacade
        });
        this.addChildViewController(calendarVC);
        this.calendarViewController = calendarVC;
    }
}

export = NiceViewController;
