import View = require('../CoreUI/View');

class TableViewHeaderView extends View
{
    private _section: Number = null;
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
