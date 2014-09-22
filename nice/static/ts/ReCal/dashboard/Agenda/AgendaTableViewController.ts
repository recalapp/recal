/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import Agenda = require('./Agenda');
import AgendaTableViewCell = require('./AgendaTableViewCell');
import AgendaTableViewHeaderView = require('./AgendaTableViewHeaderView');
import CoreUI = require('../../../library/CoreUI/CoreUI');
import DateTime = require('../../../library/DateTime/DateTime');
import Events = require('../../common/Events/Events');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import IndexPath = require('../../../library/DataStructures/IndexPath');
import ReCalCommonBrowserEvents = require('../../common/ReCalCommonBrowserEvents');
import Set = require('../../../library/DataStructures/Set');
import Table = require('../../../library/Table/Table');
import TableViewController = require('../../../library/Table/TableViewController');

import AgendaTableViewControllerDependencies = Agenda.AgendaTableViewControllerDependencies;
import IAgendaTableViewCell = Agenda.IAgendaTableViewCell;
import IAgendaTableViewHeaderView = Agenda.IAgendaTableViewHeaderView;
import IEventsOperationsFacade = Events.IEventsOperationsFacade;
import ITableView = Table.ITableView;
import ITableViewCell = Table.ITableViewCell;
import ITableViewHeaderView = Table.ITableViewHeaderView;
import IViewTemplateRetriever = CoreUI.IViewTemplateRetriever;

declare function LO_hideLoading(message: string): void;
declare function LO_showLoading(message: string): void;
declare var SE_id;

class AgendaTableViewController extends TableViewController
{
    private _eventSectionArray: EventSection[] = new Array<EventSection>();
    private _loading: boolean = false;
    private static LO_MESSAGE = 'agenda loading';

    /**
      * Global Browser Events Manager
      */
    private _globalBrowserEventsManager: GlobalBrowserEventsManager = null;
    private get globalBrowserEventsManager(): GlobalBrowserEventsManager { return this._globalBrowserEventsManager; }

    /**
      * View template retriever
      */
    private _viewTemplateRetriever: IViewTemplateRetriever = null;
    private get viewTemplateRetriever(): IViewTemplateRetriever { return this._viewTemplateRetriever; }

    /**
      * Events Operations Facade
      */
    private _eventsOperationsFacade: IEventsOperationsFacade = null;
    private get eventsOperationsFacade(): IEventsOperationsFacade { return this._eventsOperationsFacade; }

    constructor(tableView: ITableView, dependencies: AgendaTableViewControllerDependencies)
    {
        super(tableView);
        this._viewTemplateRetriever = dependencies.viewTemplateRetriever;
        this._globalBrowserEventsManager = dependencies.globalBrowserEventsManager;
        this._eventsOperationsFacade = dependencies.eventsOperationsFacade;
        // when events change
        this.globalBrowserEventsManager.attachGlobalEventHandler(ReCalCommonBrowserEvents.eventsDataChanged, (ev: JQueryEventObject)=>
        {
            this.reload();
        });

        // when settings close
        $('#' + SE_id).on('close', (ev: JQueryEventObject)=>{
            // TODO check if visible
            this.reload();
        });

        // when switching between agenda and calendar
        $('#agenda.tab-pane').each((index: number, pane: any)=>{
            $(pane).on('transitionend', (ev: JQueryEventObject)=>{
                if ($(pane).hasClass('in'))
                {
                    this.reload();
                }
            });
        });

        //// unhighlight closed events
        //PopUp_addCloseListener((closedEventId: string)=>{
        //    // get cell based on eventId and unhighlight it
        //    $.each(this.view.selectedIndexPaths(), (index: number, indexPath: IndexPath) =>{
        //        var eventId: string = this._eventSectionArray[indexPath.section].eventIds[indexPath.item];
        //        if (eventId == closedEventId)
        //        {
        //            this.view.deselectCellAtIndexPath(indexPath);
        //            return false; // breaks
        //        }
        //    });
        //});

        // this should be the sole place to unhighlight deselected events and 
        // make sure the agenda view is in sync with the state of the events
        this.globalBrowserEventsManager.attachGlobalEventHandler(ReCalCommonBrowserEvents.eventSelectionChanged,
                (ev: JQueryEventObject, extra: any) => 
                {
                    if (extra !== null && extra !== undefined && extra.eventIds !== null && extra.eventIds !== undefined)
                    {
                        var changedEventIds = new Set<string>(extra.eventIds);
                        var changedSize = changedEventIds.size();
                        var foundCount = 0;
                        // get cell based on eventId and unhighlight it
                        $.each(this.view.selectedIndexPaths(), (index: number, indexPath: IndexPath) =>{
                            var eventId: string = this._eventSectionArray[indexPath.section].eventIds[indexPath.item];
                            if (changedEventIds.contains(eventId))
                            {
                                if (this.eventsOperationsFacade.eventIdIsSelected(eventId))
                                {
                                    this.view.selectCellAtIndexPath(indexPath);
                                }
                                else
                                {
                                    this.view.deselectCellAtIndexPath(indexPath);
                                }
                                ++foundCount;
                                if (foundCount == changedSize)
                                {
                                    return false; // break;
                                }
                            }
                        });
                    }
                    else
                    {
                        // TODO cannot tell what changed. update everything. need a way to map to all events in events manager
                    }
                });

        // reload
        this.reload();
    }

    public reload() : void
    {
        // TODO Agenda_filter
        // TODO EventSectionRangeProvider
        if (this._loading)
        {
            return;
        }
        this._loading = true;
        LO_showLoading(AgendaTableViewController.LO_MESSAGE);
        this._eventSectionArray = new Array<EventSection>();

        // yesterday 0:00:00 AM to before midnight
        var curDate = new DateTime();
        var startDate = new DateTime();
        startDate.date = curDate.date - 1;
        startDate.hours = 0;
        startDate.minutes = 0;
        startDate.seconds = 0;
        var endDate = new DateTime();
        endDate.date = curDate.date;
        endDate.hours = 0;
        endDate.minutes = 0;
        endDate.seconds = 0;
        var eventIds: string[] = this.eventsOperationsFacade.getEventIdsInRange(startDate, endDate);
        if (eventIds.length > 0)
        {
            this._eventSectionArray.push(new EventSection('Yesterday', eventIds));
        }

        // today to midnight
        startDate = endDate;
        endDate = new DateTime();
        endDate.date = curDate.date + 1;
        endDate.hours = 0;
        endDate.minutes = 0;
        endDate.seconds = 0;
        eventIds = this.eventsOperationsFacade.getEventIdsInRange(startDate, endDate);
        if (eventIds.length > 0)
        {
            this._eventSectionArray.push(new EventSection('Today', eventIds));
        }

        // this week
        startDate = endDate;
        endDate = new DateTime();
        endDate.date = curDate.date + 7;
        endDate.hours = 0;
        endDate.minutes = 0;
        endDate.seconds = 0;
        eventIds = this.eventsOperationsFacade.getEventIdsInRange(startDate, endDate);
        if (eventIds.length > 0)
        {
            this._eventSectionArray.push(new EventSection('This Week', eventIds));
        }

        // this month
        startDate = endDate;
        endDate = new DateTime();
        endDate.month = curDate.month + 1;
        endDate.date = 0;
        endDate.hours = 0;
        endDate.minutes = 0;
        endDate.seconds = 0;
        eventIds = this.eventsOperationsFacade.getEventIdsInRange(startDate, endDate);
        if (eventIds.length > 0)
        {
            this._eventSectionArray.push(new EventSection('This Month', eventIds));
        }

        this.view.refresh();
        LO_hideLoading(AgendaTableViewController.LO_MESSAGE);
        this._loading = false;
    }

    /*******************************************************************
     * Table View Data Source
     *****************************************************************/

    /**
      * Returns true if a cell should be deselected
      * when it is selected and clicked on again.
      */
    public shouldToggleSelection(): boolean
    {
        return false;
    }

    /**
     * Return a unique identifier for cell at the given index path.
     * Useful for when there are more than one types of cells in
     * a table view
     */
    public identifierForCellAtIndexPath(indexPath: IndexPath) : string
    {
        return 'agenda';
    }

    /**
      * Return a unique identifier for the header at the given index path.
      * Useful for when there are more than one types of header in
      * a table view
      */
    public identifierForHeaderViewAtSection(section: number) : string
    {
        return 'agenda-header';
    }

    /**
     * Create a new table view cell for the given identifier
     */
    public createCell(identifier: string) : ITableViewCell
    {
        return <AgendaTableViewCell> AgendaTableViewCell.fromJQuery(this.viewTemplateRetriever.retrieveTemplate(AgendaTableViewCell.templateSelector));
    }

    /**
      * Create a new table view header view for the given identifier
      */
    public createHeaderView(identifier: string) : ITableViewHeaderView
    {
        return <AgendaTableViewHeaderView> AgendaTableViewHeaderView.fromJQuery(this.viewTemplateRetriever.retrieveTemplate(AgendaTableViewHeaderView.templateSelector));
    }

    /**
     * Make any changes to the cell before it goes on screen.
     * Return (not necessarily the same) cell.
     */
    public decorateCell(cell: ITableViewCell): ITableViewCell
    {
        var eventsOperationsFacade = this.eventsOperationsFacade;
        var agendaCell: IAgendaTableViewCell = <IAgendaTableViewCell> cell;
        var indexPath: IndexPath = cell.indexPath;
        var eventSection: EventSection = this._eventSectionArray[indexPath.section];
        var eventId: string = eventSection.eventIds[indexPath.item];
        if (eventId === undefined)
        {
            // indexPath was invalid
            return cell;
        }
        var eventDict = eventsOperationsFacade.getEventById(eventId);

        agendaCell.setToEvent(eventDict);

        // TODO window resizing
        if (eventsOperationsFacade.eventIdIsSelected(eventId))
        {
            this.view.selectCell(agendaCell);
        }
        else
        {
            this.view.deselectCell(agendaCell);
        }

        return cell;
    }

    /**
      * Make any changes to the cell before it goes on screen.
      * Return (not necessarily the same) cell.
      */
    public decorateHeaderView(headerView: ITableViewHeaderView): ITableViewHeaderView
    {
        var agendaHeaderView: IAgendaTableViewHeaderView = <IAgendaTableViewHeaderView> headerView;
        var eventSection: EventSection = this._eventSectionArray[<number> headerView.section];
        agendaHeaderView.setTitle(eventSection.sectionName);
        return agendaHeaderView;
    }

    /**
     * The number of sections in this table view.
     */
    public numberOfSections() : number
    {
        if (!this._eventSectionArray)
        {
            return 0;
        }
        return this._eventSectionArray.length;
    }

    /**
     * The number of items in this section.
     */
    public numberOfItemsInSection(section: number) : number
    {
        if (!this._eventSectionArray)
        {
            return 0;
        }
        return this._eventSectionArray[section].eventIds.length;
    }

    /*******************************************************************
      * Table View Delegate
      *****************************************************************/
    /**
      * Callback for when a table view cell is selected
      */
    public didSelectCell(cell: ITableViewCell): void
    {
        var eventsOperationsFacade = this.eventsOperationsFacade;
        var indexPath: IndexPath = cell.indexPath;
        var eventId: string = this._eventSectionArray[indexPath.section].eventIds[indexPath.item];
        if (eventId === undefined)
        {
            // indexPath was invalid
            return;
        }
        
        if (eventsOperationsFacade.eventIdIsSelected(eventId))
        {
            eventsOperationsFacade.selectEventWithId(eventId);
        }
        else
        {
            // TODO bring event popup into focus - maybe simply by calling select again?
            eventsOperationsFacade.selectEventWithId(eventId); // TODO works? Does this cause the popup to come into focus?
        }
    }
}

class EventSection
{
    constructor(private _sectionName: string, private _eventIds: string[])
    {
    }

    public get sectionName(): string
    {
        return this._sectionName;
    }
    public set sectionName(value: string)
    {
        this._sectionName = value;
    }

    public get eventIds(): string[]
    {
        return this._eventIds;
    }
    public set eventIds(value: string[])
    {
        this._eventIds = value;
    }
}

export = AgendaTableViewController;
