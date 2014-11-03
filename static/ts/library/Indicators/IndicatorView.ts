/// <reference path="../../typings/tsd.d.ts" />

import JQuery = require('jquery');

import View = require('../CoreUI/View');

class IndicatorView extends View
{
    private _identifier: string = null;
    public get identifier(): string { return this._identifier; }

    public static get cssClass(): string
    {
        return View.cssClass + ' indicatorView';
    }

    constructor($element: JQuery, cssClass: string, identifier: string)
    {
        super($element, cssClass);
        this._identifier = identifier;
    }
}

export = IndicatorView;