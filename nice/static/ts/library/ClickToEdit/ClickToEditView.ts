/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />
/// <amd-dependency path="jeditable" />

import $ = require('jquery');

import BrowserEvents = require("../Core/BrowserEvents");
import ClickToEditType = require('./ClickToEditType');
import FocusableView = require('../CoreUI/FocusableView');
import InvalidArgumentException = require('../Core/InvalidArgumentException');

$.editable.addInputType('RCText', {
    element: function(settings, original){
        var $input = $('<input>').addClass('form-control');
        $(this).append($input);
        return $input;
    },
});
$.editable.addInputType('RCTextArea', {
    element: function(settings, original){
        var $input = $('<textarea>').addClass('form-control');
        $(this).append($input);
        return $input;
    },
});

class ClickToEditView extends FocusableView
{
    private _type: ClickToEditType = ClickToEditType.input;
    // TODO handle focus/blur
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
        this._$el.editable((value: string, settings: any)=>{
            this.triggerEvent(BrowserEvents.Events.clickToEditComplete, {
                value: value,
            });
            return value;
        }, {
            type: 'RCText',
        });
    }
    get value() : String
    {
        return this._$el.text();
    }
    set value(text: String)
    {
        this._$el.text(<string>text);
    }
}
export = ClickToEditView;
