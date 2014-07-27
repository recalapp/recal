import TableViewCell = require('./TableViewCell');
import IndexPath = require('../Core/IndexPath');

interface TableViewDelegate
{
    /**
      * Callback for when a table view cell is deselected
      * Does not get called if the cell is programmatically deselected
      */
    didDeselectCell(cell: TableViewCell): void;

    /**
      * Callback for when a table view cell is selected.
      * Does not get called if the cell is programmatically selected.
      */
    didSelectCell(cell: TableViewCell): void;
}
export = TableViewDelegate;
