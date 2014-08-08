import ITableViewHeaderView = require('./ITableViewHeaderView');
import View = require('../CoreUI/View');

class TableViewHeaderView extends View implements ITableViewHeaderView
{
    private _section: Number = null;

    /**
      * The unique css class for this class.
      */
    public cssClass(): string
    {
        return super.cssClass() + ' tableViewHeaderView';
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
