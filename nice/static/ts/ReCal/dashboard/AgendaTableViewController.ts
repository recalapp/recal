/// <reference path="../../typings/tsd.d.ts" />

// TODO(naphatkrit) add moment js to config file
import $ = require('jquery');
import moment = require('moment');

import AgendaTableViewCell = require('./AgendaTableViewCell');
import AgendaTableViewHeaderView = require('./AgendaTableViewHeaderView');
import IndexPath = require('../../library/Core/IndexPath');
import TableViewCell = require('../../library/Table/TableViewCell');
import TableViewController = require('../../library/Table/TableViewController');
import TableViewHeaderView = require('../../library/Table/TableViewHeaderView');

declare function EventsMan_addUpdateListener(callBack: ()=>void): void;
declare function EventsMan_getEventByID(id: number): any;
declare function EventsMan_getEventIDForRange(start: number, end: number): number[];
declare function LO_hideLoading(message: string): void;
declare function LO_showLoading(message: string): void;
declare function PopUp_addCloseListener(callBack: (eventId: number)=>void): void;
declare function PopUp_getMainPopUp(): any;
declare function PopUp_getPopUpByID(popUpId: number): any;
declare function PopUp_giveFocus(popUp: any): void;
declare function PopUp_setToEventID(popUp: any, popUpId: number): void;
declare function UI_isMain(eventId: number): boolean;
declare function UI_isPinned(eventId: number): boolean;
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
        PopUp_addCloseListener((eventId: number)=>{
            // TODO get cell based on eventId and unhighlight it
        });

        // reload
        this.reload();
    }

    public reload() : void
    {
        // TODO handle timezone and separate time logic into a datetime module
        // TODO don't expose momentjs
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
        var curDate = moment();
        var startDate = moment().date(curDate.date() - 1).hours(0).minutes(0).seconds(0);
        var endDate = moment().date(curDate.date()).hours(0).minutes(0).seconds(0);
        var eventIds: number[] = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
        if (eventIds.length > 0)
        {
            this._eventSectionArray.push(new EventSection('Yesterday', eventIds));
        }

        // today to midnight
        startDate = endDate;
        endDate = moment().date(curDate.date() + 1).hours(0).minutes(0).seconds(0);
        eventIds = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
        if (eventIds.length > 0)
        {
            this._eventSectionArray.push(new EventSection('Today', eventIds));
        }

        // this week
        startDate = endDate;
        endDate = moment().date(curDate.date() + 7).hours(0).minutes(0).seconds(0);
        eventIds = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
        if (eventIds.length > 0)
        {
            this._eventSectionArray.push(new EventSection('This Week', eventIds));
        }

        // this month
        startDate = endDate;
        endDate = moment().month(curDate.month() + 1).date(0).hours(0).minutes(0).seconds(0);
        eventIds = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
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
    public createCell(identifier: string) : TableViewCell
    {
        return new AgendaTableViewCell();
    }

    /**
      * Create a new table view header view for the given identifier
      */
    public createHeaderView(identifier: string) : TableViewHeaderView
    {
        return new AgendaTableViewHeaderView();
    }

    /**
     * Make any changes to the cell before it goes on screen.
     * Return (not necessarily the same) cell.
     */
    public decorateCell(cell: TableViewCell) : TableViewCell
    {
        var agendaCell: AgendaTableViewCell = <AgendaTableViewCell> cell;
        var indexPath: IndexPath = cell.indexPath;
        var eventSection: EventSection = this._eventSectionArray[indexPath.section];
        var eventId: number = eventSection.eventIds[indexPath.item];
        if (eventId === undefined)
        {
            // indexPath was invalid
            return cell;
        }
        var eventDict = EventsMan_getEventByID(eventId);

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
    public decorateHeaderView(headerView: TableViewHeaderView) : TableViewHeaderView
    {
        var agendaHeaderView: AgendaTableViewHeaderView = <AgendaTableViewHeaderView> headerView;
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
    public didSelectCell(cell: TableViewCell): void
    {
        var indexPath: IndexPath = cell.indexPath;
        var eventId: number = this._eventSectionArray[indexPath.section].eventIds[indexPath.item];
        if (eventId === undefined)
        {
            // indexPath was invalid
            return;
        }
        
        var popUp = PopUp_getPopUpByID(eventId);
        if (popUp === null || popUp === undefined)
        {
            // create the popup
            popUp = PopUp_getMainPopUp();
            PopUp_setToEventID(popUp, eventId);
            // TODO handle success/retry logic. was needed for when popup has uncommitted changes
        }
        PopUp_giveFocus(popUp);

        // update cell selection. deselect any cells no longer relevant
        $.each(this.view.selectedIndexPaths(), (index: number, indexPath: IndexPath)=>{
            var eventId: number = this._eventSectionArray[indexPath.section].eventIds[indexPath.item];
            if (!UI_isMain(eventId) && !UI_isPinned(eventId))
            {
                this.view.deselectCellAtIndexPath(indexPath);
            }
        });
    }
}

class EventSection
{
    constructor(private _sectionName: string, private _eventIds: number[])
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

    public get eventIds(): number[]
    {
        return this._eventIds;
    }
    public set eventIds(value: number[])
    {
        this._eventIds = value;
    }
}

export = AgendaTableViewController;
