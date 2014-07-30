/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import BrowserEvents = require('../Core/BrowserEvents');
import Dictionary = require('../DataStructures/Dictionary');
import IndexPath = require('../Core/IndexPath');
import InvalidActionException = require('../Core/InvalidActionException');
import Set = require('../DataStructures/Set');
import TableViewCell = require('./TableViewCell');
import TableViewCommon = require('./TableViewCommon');
import TableViewDataSource = require('./TableViewDataSource');
import TableViewDelegate = require('./TableViewDelegate');
import TableViewHeaderView = require('./TableViewHeaderView');
import View = require('../CoreUI/View');

class TableView extends View
{
    private _cellDict = new Dictionary<IndexPath, TableViewCell>();
    private _headerDict = new Dictionary<Number, TableViewHeaderView>();
    private _dataSource: TableViewDataSource = null;
    private _delegate: TableViewDelegate = null;
    private _busy = false;

    get dataSource(): TableViewDataSource
    {
        return this._dataSource;
    }
    set dataSource(value: TableViewDataSource)
    {
        if (value != this._dataSource)
        {
            this._dataSource = value;
            this.refresh();
        }
    }

    get delegate(): TableViewDelegate
    {
        return this._delegate;
    }
    set delegate(value: TableViewDelegate)
    {
        this._delegate = value;
    }
    
    constructor($element: JQuery)
    {
        super($element);
        this.removeAllChildren();
        this.attachEventHandler(BrowserEvents.click, TableViewCommon.cellAllDescendentsSelector, (ev: JQueryEventObject) => 
        {
            var cell = TableViewCommon.findCellFromChild($(ev.target));
            if (cell === null)
            {
                return;
            }
            ev.stopPropagation();
            // TODO(naphatkrit) handle single selection. multiple selection supported by default
            if (!cell.selected)
            {
                this.selectCell(cell);
                if (this.delegate !== null)
                {
                    this.delegate.didSelectCell(cell);
                }
            }
            else 
            {
                if (this.dataSource === null || this.dataSource.shouldToggleSelection())
                {
                    // toggle selection on - deselect the cell
                    this.deselectCell(cell);
                    if (this.delegate !== null)
                    {
                        this.delegate.didDeselectCell(cell);
                    }
                }
                else
                {
                    // if toggle selection is off, then second click is the same as selecting again
                    if (this.delegate !== null)
                    {
                        this.delegate.didSelectCell(cell);
                    }
                }
            }
        });
    }

    public refresh() : void
    {
        if (this.dataSource === null)
        {
            return;
        }
        if (this._busy)
        {
            return;
        }
        this._busy = true;

        // delete old cells
        var toBeDeleted: Set<IndexPath> = new Set(this._cellDict.allKeys());
        for (var section = 0; section < this.dataSource.numberOfSections(); section++)
        {
            for (var item = 0; item < this.dataSource.numberOfItemsInSection(section); item++)
            {
                toBeDeleted.remove(new IndexPath(section, item));
            }
        }
        $.each(toBeDeleted.toArray(), (index: number, indexPath: IndexPath) =>{
            var cell = this._cellDict.unset(indexPath);
            cell.removeFromParent();
            // TODO recycle cell
        })
        // delete old headers
        var toBeDeletedHeader: Set<Number> = new Set(this._headerDict.allKeys());
        for (var section = 0; section < this.dataSource.numberOfSections(); section++)
        {
            toBeDeletedHeader.remove(section);
        }
        $.each(toBeDeletedHeader.toArray(), (index: number, section: Number) =>{
            var headerView = this._headerDict.unset(section);
            headerView.removeFromParent();
            // TODO recycle cell
        })

        // render cells on screen
        var prevCell: View = null;
        for (var section = 0; section < this.dataSource.numberOfSections(); section++)
        {
            var headerView: TableViewHeaderView = this._getOrCreateHeaderViewForSection(section);
            if (headerView !== null)
            {
                headerView = this.dataSource.decorateHeaderView(headerView);
                this._headerDict.set(section, headerView)
                if (headerView.parentView === null)
                {
                    if (prevCell !== null)
                    {
                        headerView.insertAfter(prevCell);
                    }
                    else
                    {
                        this.append(headerView);
                    }
                }
                prevCell = headerView;
            }

            for (var item = 0; item < this.dataSource.numberOfItemsInSection(section); item++)
            {
                var indexPath = new IndexPath(section, item);
                var cell: TableViewCell = this._getOrCreateCellForIndexPath(indexPath);
                cell = this.dataSource.decorateCell(cell);
                if (cell.parentView === null)
                {
                    if (prevCell !== null)
                    {
                        cell.insertAfter(prevCell);
                    }
                    else
                    {
                        this.append(cell);
                    }
                }
                prevCell = cell;
            }
        }
        this._busy = false;
    }

    /**
      * Does not append to table view
      */
    private _getOrCreateCellForIndexPath(indexPath: IndexPath): TableViewCell
    {
        var cell: TableViewCell = this._cellDict.get(indexPath);
        if (cell !== null && cell !== undefined)
        {
            return cell;
        }
        var identifier: string = this.dataSource.identifierForCellAtIndexPath(indexPath);
        cell = this.dataSource.createCell(identifier);
        cell.indexPath = indexPath;
        this._cellDict.set(indexPath, cell);

        return cell;
    }


    /**
      * Does not append to table view
      */
    private _getOrCreateHeaderViewForSection(section: Number): TableViewHeaderView
    {
        var headerView: TableViewHeaderView = this._headerDict.get(section);
        if (headerView !== null && headerView !== undefined)
        {
            return headerView;
        }
        var identifier: string = this.dataSource.identifierForHeaderViewAtSection(<number> section);
        headerView = this.dataSource.createHeaderView(identifier);
        if (headerView === null || headerView === undefined)
        {
            return null;
        }
        headerView.section = section;
        this._headerDict.set(section, headerView);

        return headerView;
    }

    public cellForIndexPath(indexPath: IndexPath) : TableViewCell
    {
        return this._cellDict.get(indexPath);
    }

    public selectedIndexPaths(): Array<IndexPath>
    {
        return $.grep(this._cellDict.allKeys(), (indexPath: IndexPath, index: number)=> {
            return this._cellDict.get(indexPath).selected;
        });
    }

    public selectCellAtIndexPath(indexPath: IndexPath) : void
    {
        var cell = this._cellDict.get(indexPath);
        if (cell === null)
        {
            throw new InvalidActionException('IndexPath ' + indexPath.toString() + ' not in TableView');
        }
        this.selectCell(cell);
    }

    public selectCell(cell: TableViewCell) : void
    {
        cell.selected = true; 
    }

    public deselectCellAtIndexPath(indexPath: IndexPath) : void
    {
        var cell = this._cellDict.get(indexPath);
        if (cell === null)
        {
            throw new InvalidActionException('IndexPath ' + indexPath.toString() + ' not in TableView');
        }
        this.deselectCell(cell);
    }

    public deselectCell(cell: TableViewCell) : void
    {
        cell.selected = false; 
    }
}

export = TableView;
