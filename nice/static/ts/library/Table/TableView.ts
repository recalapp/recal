/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import Dictionary = require('../DataStructures/Dictionary');
import IndexPath = require('../Core/IndexPath');
import TableViewCell = require('./TableViewCell');
import TableViewDataSource = require('./TableViewDataSource');
import View = require('../CoreUI/View');

class TableView extends View
{
    private _cellDict = new Dictionary<IndexPath, TableViewCell>();
    private _dataSource = null;

    get dataSource() : TableViewDataSource
    {
        return this._dataSource;
    }
    
    constructor($element: JQuery, dataSource: TableViewDataSource)
    {
        super($element);
        this._dataSource = dataSource;
        this.refresh();
    }

    public refresh() : void
    {
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
                this._cellDict.set(indexPath, cell);
                this.append(cell);
            }
        }
    }

    public cellForIndexPath(indexPath: IndexPath) : TableViewCell
    {
        return this._cellDict.get(indexPath);
    }
}

export = TableView;
