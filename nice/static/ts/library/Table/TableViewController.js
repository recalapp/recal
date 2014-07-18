var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Core/AbstractMethodException', '../CoreUI/ViewController'], function(require, exports, AbstractMethodException, ViewController) {
    var TableViewController = (function (_super) {
        __extends(TableViewController, _super);
        function TableViewController(view) {
            _super.call(this, view);
            this.view.dataSource = this;
            this.view.delegate = this;
        }
        Object.defineProperty(TableViewController.prototype, "view", {
            get: function () {
                return this._view;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Return a unique identifier for cell at the given index path.
        * Useful for when there are more than one types of cells in
        * a table view
        */
        TableViewController.prototype.identifierForCellAtIndexPath = function (indexPath) {
            throw new AbstractMethodException();
        };

        /**
        * Create a new table view cell for the given identifier
        */
        TableViewController.prototype.createCell = function (identifier) {
            throw new AbstractMethodException();
        };

        /**
        * Make any changes to the cell before it goes on screen.
        * Return (not necessarily the same) cell.
        */
        TableViewController.prototype.decorateCell = function (cell) {
            throw new AbstractMethodException();
        };

        /**
        * The number of sections in this table view.
        */
        TableViewController.prototype.numberOfSections = function () {
            throw new AbstractMethodException();
        };

        /**
        * The number of items in this section.
        */
        TableViewController.prototype.numberOfItemsInSection = function (section) {
            throw new AbstractMethodException();
        };

        /**
        * Callback for when a table view cell is selected
        */
        TableViewController.prototype.didSelectCell = function (cell) {
            // allowed to be an empty implementation. Just doesn't do anything
        };

        /**
        * Callback for when a table view cell is deselected
        */
        TableViewController.prototype.didDeselectCell = function (cell) {
        };
        return TableViewController;
    })(ViewController);

    
    return TableViewController;
});
