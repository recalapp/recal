import ITableView = require('./ITableView');
import TableViewDataSource = require('./TableViewDataSource');
import TableViewDelegate = require('./TableViewDelegate');
import IViewController = require('../CoreUI/IViewController');

interface ITableViewController extends IViewController, TableViewDataSource, TableViewDelegate
{
    view: ITableView;
}

export = ITableViewController;
