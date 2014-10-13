/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');

import InvalidArgumentException = require('../Core/InvalidArgumentException');
import TableViewCell = require('./TableViewCell');

class TableViewCommon
{
    public static cellCssClass = 'tableViewCell';
    public static cellSelector = '.' + TableViewCommon.cellCssClass;
    public static cellAllDescendentsSelector = TableViewCommon.cellSelector + ' *, ' + TableViewCommon.cellSelector;
    public static findCellFromChild($child: JQuery) : TableViewCell
    {
        var $cell = TableViewCommon.findCellElementFromChild($child);
        if ($cell === null)
        {
            return null;
        }
        return <TableViewCell> TableViewCell.fromJQuery($cell);
    }
    public static findCellElementFromChild($child: JQuery) : JQuery
    {
        if ($child.length !== 1)
        {
            throw new InvalidArgumentException('Child jQuery element must have exactly one element');
        }
        while (!$child.is(TableViewCommon.cellSelector))
        {
            if ($child.length === 0)
            {
                return null; // not found
            }
            $child = $child.parent();
        }
        return $child;
    }
}
export = TableViewCommon;
