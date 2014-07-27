import AbstractMethodException = require('../Core/AbstractMethodException');
import IndexPath = require('../Core/IndexPath');
import TableView = require('./TableView');
import TableViewCell = require('./TableViewCell');
import TableViewDataSource = require('./TableViewDataSource');
import TableViewDelegate = require('./TableViewDelegate');
import TableViewHeaderView = require('./TableViewHeaderView');
import ViewController = require('../CoreUI/ViewController');

class TableViewController extends ViewController implements TableViewDataSource, TableViewDelegate
{
    constructor(view : TableView)
    {
        super(view);
        this.view.dataSource = this;
        this.view.delegate = this;
    }

    get view() : TableView
    {
        return <TableView>this._view;
    }

    /*******************************************************************
      * Table View Data Source
      *****************************************************************/

    /**
      * Returns true if a cell should be deselected
      * when it is selected and clicked on again.
      */
    public shouldToggleSelection(): boolean
    {
        return true;
    }


    /**
      * Return a unique identifier for cell at the given index path.
      * Useful for when there are more than one types of cells in
      * a table view
      */
    public identifierForCellAtIndexPath(indexPath: IndexPath) : string
    {
        throw new AbstractMethodException();
    }
    
    /**
      * Create a new table view cell for the given identifier
      */
    public createCell(identifier: string) : TableViewCell
    {
        throw new AbstractMethodException();
    }
    
    /**
      * Return a unique identifier for the header at the given index path.
      * Useful for when there are more than one types of header in
      * a table view
      */
    public identifierForHeaderViewAtSection(section: number) : string
    {
        // optional method
        return null;
    }

    /**
      * Create a new table view cell for the given identifier
      */
    public createHeaderView(identifier: string) : TableViewHeaderView
    {
        // optional method
        return null;
    }

    /**
      * Make any changes to the cell before it goes on screen.
      * Return (not necessarily the same) cell.
      */
    public decorateCell(cell: TableViewCell) : TableViewCell
    {
        throw new AbstractMethodException();
    }

    /**
      * Make any changes to the cell before it goes on screen.
      * Return (not necessarily the same) cell.
      */
    public decorateHeaderView(headerView: TableViewHeaderView) : TableViewHeaderView
    {
        // optional
        return headerView;
    }
    
    /**
      * The number of sections in this table view.
      */
    public numberOfSections() : number
    {
        throw new AbstractMethodException();
    }
    
    /**
      * The number of items in this section.
      */
    public numberOfItemsInSection(section: number) : number
    {
        throw new AbstractMethodException();
    }

    /*******************************************************************
      * Table View Delegate
      *****************************************************************/

    /**
      * Callback for when a table view cell is selected
      */
    public didSelectCell(cell: TableViewCell): void
    {
        // allowed to be an empty implementation. Just doesn't do anything
    }

    /**
      * Callback for when a table view cell is deselected
      */
    public didDeselectCell(cell: TableViewCell): void
    {
    }
}

export = TableViewController;
