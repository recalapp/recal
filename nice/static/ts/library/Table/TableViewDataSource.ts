import TableViewCell = require('./TableViewCell');
import TableViewHeaderCell = require('./TableViewHeaderCell');
import IndexPath = require('../Core/IndexPath');

interface TableViewDataSource
{
    /**
      * Return a unique identifier for cell at the given index path.
      * Useful for when there are more than one types of cells in
      * a table view
      */
    identifierForCellAtIndexPath(indexPath: IndexPath) : string;
    
    /**
      * Create a new table view cell for the given identifier
      */
    createCell(identifier: string) : TableViewCell;

    /**
      * Return a unique identifier for the header at the given index path.
      * Useful for when there are more than one types of header in
      * a table view
      */
    identifierForHeaderCellAtIndexPath(indexPath: IndexPath) : string;

    /**
      * Create a new table view cell for the given identifier
      */
    createHeaderCell(identifier: string) : TableViewHeaderCell;
    
    /**
      * Make any changes to the cell before it goes on screen.
      * Return (not necessarily the same) cell.
      */
    decorateCell(cell: TableViewCell) : TableViewCell;

    /**
      * Make any changes to the cell before it goes on screen.
      * Return (not necessarily the same) cell.
      */
    decorateHeaderCell(cell: TableViewHeaderCell) : TableViewCell;
    
    /**
      * The number of sections in this table view.
      */
    numberOfSections() : number;
    
    /**
      * The number of items in this section.
      */
    numberOfItemsInSection(section: number) : number;
}
export = TableViewDataSource;
