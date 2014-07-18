import IndexPath = require('../../library/Core/IndexPath');
import TableViewCell = require('../../library/Table/TableViewCell');
import TableViewController = require('../../library/Table/TableViewController');

class AgendaTableViewController extends TableViewController
{
    /*******************************************************************
      * Table View Data Source
      *****************************************************************/
    /**
      * Return a unique identifier for cell at the given index path.
      * Useful for when there are more than one types of cells in
      * a table view
      */
    public identifierForCellAtIndexPath(indexPath: IndexPath) : string
    {
        return 'agenda';
    }
    
    /**
      * Create a new table view cell for the given identifier
      */
    public createCell(identifier: string) : TableViewCell
    {
        return new TableViewCell($('<div>'));
    }
    
    /**
      * Make any changes to the cell before it goes on screen.
      * Return (not necessarily the same) cell.
      */
    public decorateCell(cell: TableViewCell) : TableViewCell
    {
        return cell;
    }
    
    /**
      * The number of sections in this table view.
      */
    public numberOfSections() : number
    {
        return 1;
    }
    
    /**
      * The number of items in this section.
      */
    public numberOfItemsInSection(section: number) : number
    {
        return 10;
    }
}

export = AgendaTableViewController;
