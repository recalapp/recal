/// <reference path="../../typings/tsd.d.ts" />

import BrowserEvents = require('../Core/BrowserEvents');
import FocusableView = require('../CoreUI/FocusableView');
import IndexPath = require('../DataStructures/IndexPath');
import ITableViewCell = require('./ITableViewCell');
import TableViewCommon = require('./TableViewCommon');

class TableViewCell extends FocusableView implements ITableViewCell
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
        if (this._selected === value)
        {
            return;
        }
        this._selected = value;
        if (this.selected)
        {
            this.highlight();
        }
        else
        {
            this.unhighlight();
        }
        this.triggerEvent(BrowserEvents.tableViewCellSelectionChanged);
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
