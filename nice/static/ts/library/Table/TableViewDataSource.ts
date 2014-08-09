import IndexPath = require('../DataStructures/IndexPath');
import Table = require('./Table');

import ITableViewCell = Table.ITableViewCell;
import ITableViewHeaderView = Table.ITableViewHeaderView;

interface TableViewDataSource
{
    /**
      * Returns true if a cell should be deselected
      * when it is selected and clicked on again.
      */
    shouldToggleSelection(): boolean;

    /**
      * Return a unique identifier for cell at the given index path.
      * Useful for when there are more than one types of cells in
      * a table view
      */
    identifierForCellAtIndexPath(indexPath: IndexPath) : string;
    
    /**
      * Create a new table view cell for the given identifier
      */
    createCell(identifier: string) : ITableViewCell;

    /**
      * Return a unique identifier for the header at the given index path.
      * Useful for when there are more than one types of header in
      * a table view
      */
    identifierForHeaderViewAtSection(section: number) : string;

    /**
      * Create a new table view header view for the given identifier
      */
    createHeaderView(identifier: string) : ITableViewHeaderView;
    
    /**
      * Make any changes to the cell before it goes on screen.
      * Return (not necessarily the same) cell.
      */
    decorateCell(cell: ITableViewCell) : ITableViewCell;

    /**
      * Make any changes to the header before it goes on screen.
      * Return (not necessarily the same) header.
      */
    decorateHeaderView(cell: ITableViewHeaderView) : ITableViewHeaderView;
    
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
