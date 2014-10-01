/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import BrowserEvents = require('../Core/BrowserEvents');
import ClickToEditBaseView = require('./ClickToEditBaseView');
import ClickToEditType = require('./ClickToEditType');
import DateTime = require('../DateTime/DateTime');
import Time = require('../DateTime/Time');
import TimeInputView = require('../CustomInputs/TimeInputView');

class ClickToEditTimeView extends ClickToEditBaseView
{
    private _displayFormat: string = "h:mm A";
    public get displayFormat(): string { return this._displayFormat; }
    public set displayFormat(value: string) { this._displayFormat = value; }

    private _timeInputView: TimeInputView = null;
    private get timeInputView(): TimeInputView { return this._timeInputView; }
    private set timeInputView(value: TimeInputView) { this._timeInputView = value; }

    /**
     * The unique css class for this class.
     */
    public static get cssClass(): string
    {
        return ClickToEditBaseView.cssClass + ' clickToEditTimeView';
    }

    /**
     * The unique input type identifier associated with this type of input
     */
    public get inputType(): string
    {
        return ClickToEditType.time;
    }

    public element($form: JQuery, settings: any): JQuery
    {
        var $input = $('<input>').addClass('form-control');
        $input.height(settings.height);
        $form.append($input);
        this.timeInputView = <TimeInputView> TimeInputView.fromJQuery($input);
        return $input;
    }

    /**
     * Set the value of the input to match the value of the contentString.
     */
    public content($form: JQuery, contentString: string, settings: any): void
    {
        this.timeInputView.value = this._$el.data("logical_value") || this.timeInputView.value;
        this.timeInputView.timeFormat = this.displayFormat;
    }

    /**
     * Returns the string html value of the form value. Do processing
     * such as converting \n to <br>
     */
    public processFormValue(value: string, settings: any): string
    {
        this.timeInputView = null;
        return this.encodeDecodeProxy.htmlEncode(value);
    }
}

export = ClickToEditTimeView;