/// <reference path="../../typings/tsd.d.ts" />

import BrowserEvents = require('../Core/BrowserEvents');
import CustomInputs = require('./CustomInputs');
import DateTime = require('../DateTime/DateTime');
import FocusableView = require('../CoreUI/FocusableView');
import InvalidArgumentException = require('../Core/InvalidArgumentException');
import Time = require('../DateTime/Time');

import ITimeInputView = CustomInputs.ITimeInputView;

class TimeInputView extends FocusableView implements ITimeInputView
{
    private _value: Time = null;
    public get value(): Time { return this._value; }

    public set value(value: Time)
    {
        this._value = value;
        this.refresh();
    }

    private _timeFormat: string = "H:mm A";
    public get timeFormat(): string { return this._timeFormat; }
    public set timeFormat(value: string)
    {
        this._timeFormat = value;
        this.refresh();
    }


    constructor($element: JQuery, cssClass: string)
    {
        super($element, cssClass);
        if (!$element.is('input'))
        {
            throw new InvalidArgumentException(
                "TimeInputView can only be constructed from a HTML input element."
            );
        }
        this._value = this._$el.data("logical_value") || DateTime.fromUnix(0);
        this.attachEventHandler(BrowserEvents.keyPress, (ev: JQueryEventObject)=>{
            ev.preventDefault();
        });
        this.refresh();
    }

    private refresh(): void
    {
        this._$el.val(this.value.format(this.timeFormat));
        this._$el.data("logical_value", this.value);
    }
}

export = TimeInputView;