import TableViewCell = require('./TableViewCell');
import IndexPath = require('../Core/IndexPath');

interface TableViewDelegate
{
    /**
      * Callback for when a table view cell is selected
      */
    didSelectCell(cell: TableViewCell): void;

    /**
      * Callback for when a table view cell is deselected
      */
    didDeselectCell(cell: TableViewCell): void;
}
export = TableViewDelegate;
