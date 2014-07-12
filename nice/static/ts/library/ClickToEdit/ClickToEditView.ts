/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />
/// <amd-dependency path="jeditable" />

import $ = require('jquery');

import BrowserEvents = require("../Core/BrowserEvents");
import ClickToEditCommon = require('./ClickToEditCommon');
import ClickToEditType = require('./ClickToEditType');
import ClickToEditTypeProvider = require('./ClickToEditTypeProvider');
import FocusableView = require('../CoreUI/FocusableView');
import InvalidArgumentException = require('../Core/InvalidArgumentException');

class ClickToEditView extends FocusableView
{
    private _type = ClickToEditType.text;

    constructor($element: JQuery)
    {
        super($element);
        if (!this._$el.is('p, h1, h2, h3, h4, h5, h6'))
        {
            throw new InvalidArgumentException('ClickToEdit must be p, h1, h2, h3, h4, h5, or h6');
        }
        var type = this._$el.data(ClickToEditCommon.DataType);
        if (type !== null && type !== undefined)
        {
            this._type = parseInt(type);
        }
        this._initializeClickToEdit();
    }

    private _initializeClickToEdit()
    {
        this._$el.editable((value: string, settings: any)=>{
            this.triggerEvent(BrowserEvents.clickToEditComplete, {
                value: value,
            });
            return value;
        }, {
            type: ClickToEditTypeProvider.instance().getTypeString(this._type),
            event: BrowserEvents.clickToEditShouldBegin,
        });
        this.attachEventHandler(BrowserEvents.click, () => {
            this.triggerEvent(BrowserEvents.clickToEditShouldBegin);
        });
    }
    get value() : string
    {
        return this._$el.text();
    }
    set value(text: string)
    {
        this._$el.text(text);
    }

    focusView() : void
    {
        super.focusView();
        this.triggerEvent(BrowserEvents.clickToEditShouldBegin); 
    }
}
export = ClickToEditView;
