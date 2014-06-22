/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');
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
        this._$el.focus();
    }
    blurView() : void
    {
        this._$el.blur();
    }
}
export = FocusableView;
