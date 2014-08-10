/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import View = require('../CoreUI/View');

class SidebarFullViewContainer extends View
{
    constructor($element: JQuery)
    {
        super($element);
        this.removeAllChildren();
    }
}

export = SidebarFullViewContainer;
