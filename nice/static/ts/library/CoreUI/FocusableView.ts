/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');
import BrowserEvents = require('../Core/BrowserEvents');
import View = require('./View');

class FocusableView extends View
{
    private _hasFocus = false;
    constructor($element: JQuery)
    {
        super($element);
        this._$el.attr('tabindex', 0);
        this.attachEventHandler(BrowserEvents.focusIn, (ev : JQueryEventObject) => {
            if (this.containsJQueryElement($(document.activeElement)))
            {
                this.focusView();
            }
        });
        this.attachEventHandler(BrowserEvents.focusOut, (ev : JQueryEventObject) => {
            if (!this.containsJQueryElement($(document.activeElement)))
            {
                this.blurView();
            }
        });
    }
    get hasFocus() : boolean
    {
        return this._hasFocus;
    }

    public focusView() : void
    {
        this._hasFocus = true;
    }
    public blurView() : void
    {
        this._hasFocus = false;
    }
}
export = FocusableView;
