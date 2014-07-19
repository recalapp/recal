define(["require", "exports", '../Core/InvalidArgumentException', './TableViewCell'], function(require, exports, InvalidArgumentException, TableViewCell) {
    var TableViewCommon = (function () {
        function TableViewCommon() {
        }
        TableViewCommon.findCellFromChild = function ($child) {
            var $cell = TableViewCommon.findCellElementFromChild($child);
            if ($cell === null) {
                return null;
            }
            return TableViewCell.fromJQuery($cell);
        };
        TableViewCommon.findCellElementFromChild = function ($child) {
            if ($child.length !== 1) {
                throw new InvalidArgumentException('Child jQuery element must have exactly one element');
            }
            while (!$child.is(TableViewCommon.cellSelector)) {
                if ($child.length === 0) {
                    return null;
                }
                $child = $child.parent();
            }
            return $child;
        };
        TableViewCommon.cellCssClass = 'tableViewCell';
        TableViewCommon.cellSelector = '.' + TableViewCommon.cellCssClass;
        TableViewCommon.cellAllDescendentsSelector = TableViewCommon.cellSelector + ' *';
        return TableViewCommon;
    })();
    
    return TableViewCommon;
});
