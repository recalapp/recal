/// <reference path="../../typings/tsd.d.ts" />

import IndexPath = require('../DataStructures/IndexPath');
import ITableViewCell = require('./ITableViewCell');
import TableViewDataSource = require('./TableViewDataSource');
import TableViewDelegate = require('./TableViewDelegate');
import IView = require('../CoreUI/IView');

interface ITableView extends IView
{
    dataSource: TableViewDataSource;
    delegate: TableViewDelegate;

    refresh() : void;

    cellForIndexPath(indexPath: IndexPath) : ITableViewCell;

    selectedIndexPaths(): IndexPath[];

    selectCellAtIndexPath(indexPath: IndexPath): void;
    selectCell(cell: ITableViewCell): void;
    deselectCellAtIndexPath(indexPath: IndexPath): void;
    deselectCell(cell: ITableViewCell): void;
}

export = ITableView;
