/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import ClickToEditType = require('./ClickToEditType');
import FocusableView = require('../CoreUI/FocusableView');
import InvalidArgumentException = require('../Core/InvalidArgumentException');

class ClickToEditView extends FocusableView
{
    private _type: ClickToEditType = ClickToEditType.input;
    // TODO handle focus/blur
    // TODO initialize
    constructor($element: JQuery)
    {
        super($element);
        if (!this._$el.is('p, h1, h2, h3, h4, h5, h6'))
        {
            throw new InvalidArgumentException('ClickToEdit must be p, h1, h2, h3, h4, h5, or h6');
        }
        this._initializeClickToEdit();
    }

    private _initializeClickToEdit()
    {
    }
    // TODO update value
    get value() : String
    {
        return this._$el.text();
    }
    // TODO get value
    set value(text: String)
    {
        this._$el.text(<string>text);
    }
    // TODO notify when update
}
export = ClickToEditView;
