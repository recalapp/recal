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
}
export = TableViewHeaderCell;
