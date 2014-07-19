/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');

export var cssClass = 'popup'
export var cssSelector = '.' + cssClass;
export var allDescendentsSelector = cssSelector + ' *';
export var headingCssSelector = '.panel-heading';
export var panelCssSelector = '.panel';

export var focusOpacity = 1;
export var blurOpacity = 0.6;
export var focusClass = 'panel-primary';
export var blurClass = 'panel-default';
export enum PopUpType { main, detached };

export function findPopUpElementFromChild($child: JQuery) : JQuery
{
    while (!$child.hasClass(cssClass))
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
