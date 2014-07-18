define(["require", "exports", '../Core/InvalidArgumentException', './TableViewCell'], function(require, exports, InvalidArgumentException, TableViewCell) {
    exports.CellCssClass = 'tableViewCell';
    exports.CellSelector = '.' + exports.CellCssClass;
    exports.CellAllDescendentsSelector = exports.CellSelector + ' *';

    function findCellElementFromChild($child) {
        if ($child.length !== 1) {
            throw new InvalidArgumentException('Child jQuery element must have exactly one element');
        }
        while (!$child.is(exports.CellSelector)) {
            if ($child.length === 0) {
                return null;
            }
            $child = $child.parent();
        }
        return $child;
    }
    exports.findCellElementFromChild = findCellElementFromChild;

    function findCellFromChild($child) {
        var $cell = exports.findCellElementFromChild($child);
        if ($cell === null) {
            return null;
        }
        return TableViewCell.fromJQuery($cell);
    }
    exports.findCellFromChild = findCellFromChild;
});
