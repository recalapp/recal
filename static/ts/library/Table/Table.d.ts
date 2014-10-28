/// <reference path="../../typings/tsd.d.ts" />

import CoreUI = require('../CoreUI/CoreUI');
import IndexPath = require('../DataStructures/IndexPath');
import TableViewDataSource = require('./TableViewDataSource');
import TableViewDelegate = require('./TableViewDelegate');

import IFocusableView = CoreUI.IFocusableView;
import IView = CoreUI.IView;
import IViewController = CoreUI.IViewController;

export interface ITableView extends IView
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

export interface ITableViewCell extends IFocusableView
{
    indexPath: IndexPath;
    selected: boolean;

    highlight(): void;

    unhighlight(): void;
}

export interface ITableViewHeaderView extends IView
{
    section: Number;
}

export interface ITableViewController extends IViewController, TableViewDataSource, TableViewDelegate
{
    view: ITableView;
}
