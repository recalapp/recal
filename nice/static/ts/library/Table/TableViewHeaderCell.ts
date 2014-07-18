import IndexPath = require('../Core/IndexPath');
import TableViewCell = require('./TableViewCell');
import TableViewCommon = require('./TableViewCommon');

class TableViewHeaderCell extends TableViewCell
{
    // headers cannot be selected
    get selected() : boolean
    {
        return false;
    }
    set selected(value: boolean)
    {
        return;
    }

    constructor($element: JQuery)
    {
        super($element);
        // opt out of the click/selection functionality
        this._$el.removeClass(TableViewCommon.CellCssClass);
    }
}
export = TableViewHeaderCell;
