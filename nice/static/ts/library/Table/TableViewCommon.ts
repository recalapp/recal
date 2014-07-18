/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');

import InvalidArgumentException = require('../Core/InvalidArgumentException');
import TableViewCell = require('./TableViewCell');

export var CellCssClass = 'tableViewCell';
export var CellSelector = '.' + CellCssClass;
export var CellAllDescendentsSelector = CellSelector + ' *';

export function findCellElementFromChild($child: JQuery) : JQuery
{
    if ($child.length !== 1)
    {
        throw new InvalidArgumentException('Child jQuery element must have exactly one element');
    }
    while (!$child.is(CellSelector))
    {
        if ($child.length === 0)
        {
            return null; // not found
        }
        $child = $child.parent();
    }
    return $child;
}

export function findCellFromChild($child: JQuery) : TableViewCell
{
    var $cell = findCellElementFromChild($child);
    if ($cell === null)
    {
        return null;
    }
    return <TableViewCell> TableViewCell.fromJQuery($cell);
}
