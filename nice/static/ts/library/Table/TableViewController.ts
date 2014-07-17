import AbstractMethodException = require('../Core/AbstractMethodException');
import IndexPath = require('../Core/IndexPath');
import TableView = require('./TableView');
import TableViewCell = require('./TableViewCell');
import TableViewDataSource = require('./TableViewDataSource');
import TableViewDelegate = require('./TableViewDelegate');
import ViewController = require('../CoreUI/ViewController');

class TableViewController extends ViewController implements TableViewDataSource, TableViewDelegate
{
    constructor(view : TableView)
    {
        super(view);
        this.view.dataSource = this;
        
    }

    get view() : TableView
    {
        return <TableView>this._view;
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
      * Make any changes to the cell before it goes on screen.
      * Return (not necessarily the same) cell.
      */
    public decorateCell(cell: TableViewCell) : TableViewCell
    {
        throw new AbstractMethodException();
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
    didDeselectCell(cell: TableViewCell): void
    {
    }
}

export = TableViewController;
