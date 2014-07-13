/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');

export var CssClass = 'popup'
export var CssSelector = '.' + CssClass;
export var AllDescendentsSelector = CssSelector + ' *';
export var HeadingCssSelector = '.panel-heading';
export var PanelCssSelector = '.panel';

export var FocusOpacity = 1;
export var BlurOpacity = 0.6;
export var FocusClass = 'panel-primary';
export var BlurClass = 'panel-default';
export enum PopUpType { main, detached };

export function findPopUpFromChild($child: JQuery) : JQuery
{
    while (!$child.hasClass(CssClass))
    {
        if ($child.length === 0)
        {
            // not found
            return null;
        }
        $child = $child.parent();
    }
    return $child;
}
