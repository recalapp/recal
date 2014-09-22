/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import AgendaTableViewController = require('./Agenda/AgendaTableViewController');
import Calendar = require('../../library/Calendar/Calendar');
import CalendarView = require('../../library/Calendar/CalendarView');
import CanvasPopUpContainer = require('../common/CanvasPopUpContainer/CanvasPopUpContainer');
import CanvasPopUpContainerViewController = require('../common/CanvasPopUpContainer/CanvasPopUpContainerViewController');
import ClickToEdit = require('../../library/ClickToEdit/ClickToEdit');
import ClickToEditViewFactory = require('../../library/ClickToEdit/ClickToEditViewFactory');
import CoreUI = require('../../library/CoreUI/CoreUI');
import DashboardCalendarViewController = require('./DashboardCalendar/DashboardCalendarViewController');
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
import ICanvasPopUpContainerViewController = CanvasPopUpContainer.ICanvasPopUpContainerViewController;
import IClickToEditViewFactory = ClickToEdit.IClickToEditViewFactory;
import IEventsOperationsFacade = Events.IEventsOperationsFacade;
import IReCalSidebarViewController = ReCalSidebar.IReCalSidebarViewController;
import ISidebarNotificationsManager = Notifications.ISidebarNotificationsManager;
import ISidebarView = Sidebar.ISidebarView;
import ITableView = Table.ITableView;
import ITableViewController = Table.ITableViewController;
import IView = CoreUI.IView;
import IViewTemplateRetriever = CoreUI.IViewTemplateRetriever;

class DashboardViewController extends ViewController
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
      * Notifications Manager
      */
    private _notificationsManager: ISidebarNotificationsManager = null;
    private get notificationsManager(): ISidebarNotificationsManager 
    { 
        if (!this._notificationsManager)
        {
            this._notificationsManager = new SidebarNotificationsManager; 
        }
        return this._notificationsManager; 
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
    private _clickToEditViewFactory: IClickToEditViewFactory = null;
    private get clickToEditViewFactory(): IClickToEditViewFactory
    {
        if (!this._clickToEditViewFactory)
        {
            this._clickToEditViewFactory = new ClickToEditViewFactory();
        }
        return this._clickToEditViewFactory;
    }

    /**
      * Calendar view controller
      */
    private _calendarViewController: ICalendarViewController = null;
    private get calendarViewController(): ICalendarViewController { return this._calendarViewController; }
    private set calendarViewController(value: ICalendarViewController) { this._calendarViewController = value; }

    /**
      * Agenda View Controller
      */
    private _agendaViewController: ITableViewController = null;
    private get agendaViewController(): ITableViewController { return this._agendaViewController; }
    private set agendaViewController(value: ITableViewController) { this._agendaViewController = value; }

    /**
      * Sidebar View Controller
      */
    private _sidebarViewController: IReCalSidebarViewController = null;
    private get sidebarViewController(): IReCalSidebarViewController { return this._sidebarViewController; }
    private set sidebarViewController(value: IReCalSidebarViewController) { this._sidebarViewController = value; }

    /**
      * Canvas PopUp Container View Controller
      */
    private _canvasPopUpContainerViewController: ICanvasPopUpContainerViewController = null;
    private get canvasPopUpContainerViewController(): ICanvasPopUpContainerViewController { return this._canvasPopUpContainerViewController; }
    private set canvasPopUpContainerViewController(value: ICanvasPopUpContainerViewController) { this._canvasPopUpContainerViewController = value; }

    constructor(view: IView)
    {
        super(view);
        this.initialize();
    }

    private initialize(): void
    {
        this.initializeSidebar();
        this.initializePopUpCanvas();
        this.initializeCalendar();
        this.initializeAgenda();
    }

    private initializeCalendar(): void
    {
        // initialize calendar view
        var calendarView: ICalendarView = <CalendarView> CalendarView.fromJQuery(this.view.findJQuery('#calendarui'));
        var calendarVC: ICalendarViewController = new DashboardCalendarViewController(calendarView, {
            eventsOperationsFacade: this.eventsOperationsFacade,
        });
        this.addChildViewController(calendarVC);
        this.calendarViewController = calendarVC;
    }

    private initializeAgenda(): void
    {
        // initialize agenda view
        var agendaTableView: ITableView = <TableView> TableView.fromJQuery(this.view.findJQuery('#agendaui'));
        var agendaVC: ITableViewController = new AgendaTableViewController(agendaTableView, {
            viewTemplateRetriever: this.viewTemplateRetriever,
            eventsOperationsFacade: this.eventsOperationsFacade,
            globalBrowserEventsManager: this.globalBrowserEventsManager,
        });
        this.addChildViewController(agendaVC);
        this.agendaViewController = agendaVC;
    }
    
    private initializeSidebar(): void
    {
        // initialize sidebar
        var sidebarView: ISidebarView = <SidebarView> SidebarView.fromJQuery(this.view.findJQuery('#sidebar-container'));

        // set sidebar notifications manager's sidebar instance
        this.notificationsManager.sidebarView = sidebarView;

        // initialize sidebar view controller
        var sidebarVC: IReCalSidebarViewController = new ReCalSidebarViewController(sidebarView, {
            viewTemplateRetriever: this.viewTemplateRetriever,
            globalBrowserEventsManager: this.globalBrowserEventsManager,
            eventsOperationsFacade: this.eventsOperationsFacade,
            clickToEditViewFactory: this.clickToEditViewFactory,
        });
        this.addChildViewController(sidebarVC);
        this.sidebarViewController = sidebarVC;
    }

    private initializePopUpCanvas(): void
    {
        // initialize popup canvas
        // NOTE #popup-canvas div is only used to set the bounds. the actual div
        // that we attach popup to is the body.
        var popUpCanvasView: IView = View.fromJQuery(this.view.findJQuery('#popup-canvas'));
        var popUpCanvasVC: ICanvasPopUpContainerViewController = new CanvasPopUpContainerViewController(popUpCanvasView, {
            canvasView: this.view,
            clickToEditViewFactory: this.clickToEditViewFactory,
            eventsOperationsFacade: this.eventsOperationsFacade,
            globalBrowserEventsManager: this.globalBrowserEventsManager,
        });
        this.addChildViewController(popUpCanvasVC);
        this.canvasPopUpContainerViewController = popUpCanvasVC;
    }
}

export = DashboardViewController;
