/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import BrowserEvents = require('../Core/BrowserEvents');
import Dictionary = require('../DataStructures/Dictionary');
import IndexPath = require('../Core/IndexPath');
import InvalidActionException = require('../Core/InvalidActionException');
import TableViewCell = require('./TableViewCell');
import TableViewCommon = require('./TableViewCommon');
import TableViewDataSource = require('./TableViewDataSource');
import TableViewDelegate = require('./TableViewDelegate');
import View = require('../CoreUI/View');

class TableView extends View
{
    private _cellDict = new Dictionary<IndexPath, TableViewCell>();
    private _dataSource: TableViewDataSource = null;
    private _delegate: TableViewDelegate = null;

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
        this.attachEventHandler(BrowserEvents.click, TableViewCommon.CellAllDescendentsSelector, (ev: JQueryEventObject) => 
        {
            var cell = TableViewCommon.findCellFromChild($(ev.target));
            if (cell === null)
            {
                return;
            }
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
        this._cellDict = new Dictionary<IndexPath, TableViewCell>();
        this.removeAllChildren();
        for (var section = 0; section < this.dataSource.numberOfSections(); section++)
        {
            for (var item = 0; item < this.dataSource.numberOfItemsInSection(section); item++)
            {
                var indexPath = new IndexPath(section, item);
                var identifier: string = this.dataSource.identifierForCellAtIndexPath(indexPath);
                var cell: TableViewCell = this.dataSource.createCell(identifier);
                cell.indexPath = indexPath;
                cell = this.dataSource.decorateCell(cell);
                this._cellDict.set(indexPath, cell);
                this.append(cell);
            }
        }
    }

    public cellForIndexPath(indexPath: IndexPath) : TableViewCell
    {
        return this._cellDict.get(indexPath);
    }

    public selectCellAtIndexPath(indexPath: IndexPath)
    {
        var cell = this._cellDict.get(indexPath);
        if (cell === null)
        {
            throw new InvalidActionException('IndexPath ' + indexPath.toString() + ' not in TableView');
        }
        this.selectCell(cell);
    }

    public selectCell(cell: TableViewCell)
    {
        cell.selected = true; // TODO(naphatkrit) what if already true?
    }

    public deselectCellAtIndexPath(indexPath: IndexPath)
    {
        var cell = this._cellDict.get(indexPath);
        if (cell === null)
        {
            throw new InvalidActionException('IndexPath ' + indexPath.toString() + ' not in TableView');
        }
        this.deselectCell(cell);
    }

    public deselectCell(cell: TableViewCell)
    {
        cell.selected = false; // TODO(naphatkrit) what if already false?
    }
}

export = TableView;
