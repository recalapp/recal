/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');
import BrowserEvents = require('../Core/BrowserEvents');
import View = require('./View');

class FocusableView extends View
{
    _hasFocus : Boolean = false;

    get hasFocus() : Boolean
    {
        return this._hasFocus;
    }

    focusView() : void
    {
        this.triggerEvent(BrowserEvents.Events.viewWillFocus);
        this._$el.focus();
        this.triggerEvent(BrowserEvents.Events.viewDidFocus);
    }
    blurView() : void
    {
        this.triggerEvent(BrowserEvents.Events.viewWillBlur);
        this._$el.blur();
        this.triggerEvent(BrowserEvents.Events.viewDidBlur);
    }
}
export = FocusableView;
