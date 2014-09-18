/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import Agenda = require('./Agenda');
import AgendaTableViewCell = require('./AgendaTableViewCell');
import AgendaTableViewHeaderView = require('./AgendaTableViewHeaderView');
import DateTime = require('../../../library/DateTime/DateTime');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import GlobalInstancesManager = require('../../common/GlobalInstancesManager');
import ReCalCommonBrowserEvents = require('../../common/ReCalCommonBrowserEvents');
import IndexPath = require('../../../library/DataStructures/IndexPath');
import Table = require('../../../library/Table/Table');
import TableViewController = require('../../../library/Table/TableViewController');

import IAgendaTableViewCell = Agenda.IAgendaTableViewCell;
import IAgendaTableViewHeaderView = Agenda.IAgendaTableViewHeaderView;
import ITableViewCell = Table.ITableViewCell;
import ITableViewHeaderView = Table.ITableViewHeaderView;

declare function EventsMan_addUpdateListener(callBack: ()=>void): void;
declare function LO_hideLoading(message: string): void;
declare function LO_showLoading(message: string): void;
declare function PopUp_addCloseListener(callBack: (eventId: string)=>void): void;
declare function PopUp_getMainPopUp(): any;
declare function PopUp_getPopUpByID(popUpId: string): any;
declare function PopUp_giveFocus(popUp: any): void;
declare function PopUp_setToEventID(popUp: any, popUpId: string): void;
declare function UI_isMain(eventId: string): boolean;
declare function UI_isPinned(eventId: string): boolean;
declare var SE_id;

class AgendaTableViewController extends TableViewController
{
    private _eventSectionArray: EventSection[];
    private _loading: boolean = false;
    private static LO_MESSAGE = 'agenda loading';
    public initialize() : void
    {
        super.initialize();
        // when events change
        EventsMan_addUpdateListener(()=>{
            // TODO check if visible
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

        // unhighlight closed events
        PopUp_addCloseListener((closedEventId: string)=>{
            // get cell based on eventId and unhighlight it
            $.each(this.view.selectedIndexPaths(), (index: number, indexPath: IndexPath) =>{
                var eventId: string = this._eventSectionArray[indexPath.section].eventIds[indexPath.item];
                if (eventId == closedEventId)
                {
                    this.view.deselectCellAtIndexPath(indexPath);
                    return false; // breaks
                }
            });
        });

        // this should be the sole place to unhighlight deselected events and 
        // make sure the agenda view is in sync with the state of the events
        GlobalBrowserEventsManager.instance.attachGlobalEventHandler(ReCalCommonBrowserEvents.eventSelectionChanged,
                (ev: JQueryEventObject, extra: any) => 
                {
                    if (extra !== null && extra !== undefined && extra.eventId !== null && extra.eventId !== undefined)
                    {
                        // get cell based on eventId and unhighlight it
                        $.each(this.view.selectedIndexPaths(), (index: number, indexPath: IndexPath) =>{
                            var eventId: string = this._eventSectionArray[indexPath.section].eventIds[indexPath.item];
                            if (eventId == extra.eventId)
                            {
                                if (GlobalInstancesManager.instance.eventsOperationsFacade.eventIdIsSelected(eventId))
                                {
                                    this.view.selectCellAtIndexPath(indexPath);
                                }
                                else
                                {
                                    this.view.deselectCellAtIndexPath(indexPath);
                                }
                                return false; // breaks
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
        var eventsOperationsFacade = GlobalInstancesManager.instance.eventsOperationsFacade;
        var eventIds: string[] = eventsOperationsFacade.getEventIdsInRange(startDate, endDate);
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
        eventIds = eventsOperationsFacade.getEventIdsInRange(startDate, endDate);
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
        eventIds = eventsOperationsFacade.getEventIdsInRange(startDate, endDate);
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
        eventIds = eventsOperationsFacade.getEventIdsInRange(startDate, endDate);
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
        return AgendaTableViewCell.fromTemplate();
    }

    /**
      * Create a new table view header view for the given identifier
      */
    public createHeaderView(identifier: string) : ITableViewHeaderView
    {
        return AgendaTableViewHeaderView.fromTemplate();
    }

    /**
     * Make any changes to the cell before it goes on screen.
     * Return (not necessarily the same) cell.
     */
    public decorateCell(cell: ITableViewCell): ITableViewCell
    {
        var agendaCell: IAgendaTableViewCell = <IAgendaTableViewCell> cell;
        var indexPath: IndexPath = cell.indexPath;
        var eventSection: EventSection = this._eventSectionArray[indexPath.section];
        var eventId: string = eventSection.eventIds[indexPath.item];
        if (eventId === undefined)
        {
            // indexPath was invalid
            return cell;
        }
        var eventDict = GlobalInstancesManager.instance.eventsOperationsFacade.getEventById(eventId);

        agendaCell.setToEvent(eventDict);

        // TODO window resizing
        if (UI_isPinned(eventId) || UI_isMain(eventId))
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
        return this._eventSectionArray.length;
    }

    /**
     * The number of items in this section.
     */
    public numberOfItemsInSection(section: number) : number
    {
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
        var indexPath: IndexPath = cell.indexPath;
        var eventId: string = this._eventSectionArray[indexPath.section].eventIds[indexPath.item];
        if (eventId === undefined)
        {
            // indexPath was invalid
            return;
        }
        
        if (!GlobalInstancesManager.instance.eventsOperationsFacade.eventIdIsSelected(eventId))
        {
            GlobalInstancesManager.instance.eventsOperationsFacade.selectEventWithId(eventId);
        }
        else
        {
            // TODO bring event popup into focus - maybe simply by calling select again?
            GlobalInstancesManager.instance.eventsOperationsFacade.selectEventWithId(eventId); // TODO works?
        }

        //var popUp = PopUp_getPopUpByID(eventId);
        //if (popUp === null || popUp === undefined)
        //{
        //    // create the popup
        //    popUp = PopUp_getMainPopUp();
        //    PopUp_setToEventID(popUp, eventId);
        //    // TODO handle success/retry logic. was needed for when popup has uncommitted changes
        //}
        //PopUp_giveFocus(popUp);

        //// update cell selection. deselect any cells no longer relevant
        //$.each(this.view.selectedIndexPaths(), (index: string, indexPath: IndexPath)=>{
        //    var eventId: string = this._eventSectionArray[indexPath.section].eventIds[indexPath.item];
        //    if (!UI_isMain(eventId) && !UI_isPinned(eventId))
        //    {
        //        this.view.deselectCellAtIndexPath(indexPath);
        //    }
        //});
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
