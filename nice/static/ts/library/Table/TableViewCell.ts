import FocusableView = require('../CoreUI/FocusableView');
import IndexPath = require('../Core/IndexPath');
import TableViewCommon = require('./TableViewCommon');

class TableViewCell extends FocusableView
{
    private _indexPath: IndexPath = null;
    private _selected = false;

    get indexPath() : IndexPath
    {
        return this._indexPath;
    }
    set indexPath(newValue: IndexPath) 
    {
        this._indexPath = newValue;
    }

    get selected() : boolean
    {
        return this._selected;
    }
    set selected(value: boolean)
    {
        this._selected = value;
        if (this._selected)
        {
            this.highlight();
        }
        else
        {
            this.unhighlight();
        }
    }

    constructor($element: JQuery)
    {
        super($element);
        this._$el.addClass(TableViewCommon.cellCssClass);
    }

    public highlight() : void
    {
    }

    public unhighlight() : void
    {
    }
}
export = TableViewCell;
