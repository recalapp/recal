import Table = require('./Table');
import View = require('../CoreUI/View');

import ITableViewHeaderView = Table.ITableViewHeaderView;

class TableViewHeaderView extends View implements ITableViewHeaderView
{
    private _section: Number = null;

    /**
      * The unique css class for this class.
      */
    public static get cssClass(): string
    {
        return View.cssClass + ' tableViewHeaderView';
    }

    get section() : Number
    {
        return this._section;
    }
    set section(newValue: Number) 
    {
        this._section = newValue;
    }
}
export = TableViewHeaderView;
