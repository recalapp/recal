var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../library/Table/TableViewCell', '../../library/Table/TableViewController'], function(require, exports, TableViewCell, TableViewController) {
    var AgendaTableViewController = (function (_super) {
        __extends(AgendaTableViewController, _super);
        function AgendaTableViewController() {
            _super.apply(this, arguments);
        }
        /*******************************************************************
        * Table View Data Source
        *****************************************************************/
        /**
        * Return a unique identifier for cell at the given index path.
        * Useful for when there are more than one types of cells in
        * a table view
        */
        AgendaTableViewController.prototype.identifierForCellAtIndexPath = function (indexPath) {
            return 'agenda';
        };

        /**
        * Create a new table view cell for the given identifier
        */
        AgendaTableViewController.prototype.createCell = function (identifier) {
            return new TableViewCell($('<div>'));
        };

        /**
        * Make any changes to the cell before it goes on screen.
        * Return (not necessarily the same) cell.
        */
        AgendaTableViewController.prototype.decorateCell = function (cell) {
            return cell;
        };

        /**
        * The number of sections in this table view.
        */
        AgendaTableViewController.prototype.numberOfSections = function () {
            return 1;
        };

        /**
        * The number of items in this section.
        */
        AgendaTableViewController.prototype.numberOfItemsInSection = function (section) {
            return 10;
        };
        return AgendaTableViewController;
    })(TableViewController);

    
    return AgendaTableViewController;
});
