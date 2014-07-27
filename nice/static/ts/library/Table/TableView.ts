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
import TableViewHeaderCell = require('./TableViewHeaderCell');
import View = require('../CoreUI/View');

class TableView extends View
{
    private _cellDict = new Dictionary<IndexPath, TableViewCell>();
    private _dataSource: TableViewDataSource = null;
    private _delegate: TableViewDelegate = null;
    private _busy = false;

    get dataSource() : TableViewDataSource
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

    get delegate() : TableViewDelegate
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
        this.attachEventHandler(BrowserEvents.click, TableViewCommon.cellAllDescendentsSelector, (ev: JQueryEventObject) => 
        {
            var cell = TableViewCommon.findCellFromChild($(ev.target));
            // TODO(naphatkrit) find a way to make sure that cell is not a header cell
            if (cell === null)
            {
                return;
            }
            ev.stopPropagation();
            // TODO(naphatkrit) handle single selection. multiple selection supported by default
            if (cell.selected)
            {
                this.deselectCell(cell);
                if (this.delegate !== null)
                {
                    this.delegate.didDeselectCell(cell);
                }
            }
            else
            {
                this.selectCell(cell);
                if (this.delegate !== null)
                {
                    this.delegate.didSelectCell(cell);
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
            toBeDeleted.remove(new IndexPath(section, -1));
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

        // render cells on screen
        var prevCell: TableViewCell = null;
        for (var section = 0; section < this.dataSource.numberOfSections(); section++)
        {
            var headerCell: TableViewHeaderCell = this._getOrCreateHeaderCellForSection(section);
            if (headerCell !== null)
            {
                headerCell = this.dataSource.decorateHeaderCell(headerCell);
                if (headerCell.parentView === null)
                {
                    if (prevCell !== null)
                    {
                        headerCell.insertAfter(prevCell);
                    }
                    else
                    {
                        this.append(headerCell);
                    }
                }
                prevCell = headerCell;
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
    private _getOrCreateCellForIndexPath(indexPath): TableViewCell
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
    private _getOrCreateHeaderCellForSection(section): TableViewHeaderCell
    {
        var indexPath = new IndexPath(section, -1);
        var cell: TableViewHeaderCell = this._cellDict.get(indexPath);
        if (cell !== null && cell !== undefined)
        {
            return cell;
        }
        var identifier: string = this.dataSource.identifierForHeaderCellAtIndexPath(indexPath);
        cell = this.dataSource.createHeaderCell(identifier);
        if (cell === null || cell === undefined)
        {
            return null;
        }
        cell.indexPath = indexPath;
        this._cellDict.set(indexPath, cell);

        return cell;
    }

    public cellForIndexPath(indexPath: IndexPath) : TableViewCell
    {
        return this._cellDict.get(indexPath);
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
