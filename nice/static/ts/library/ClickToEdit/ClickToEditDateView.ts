/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import BrowserEvents = require('../Core/BrowserEvents');
import ClickToEditBaseView = require('./ClickToEditBaseView');
import ClickToEditType = require('./ClickToEditType');
import Date = require('../DateTime/Date');
import DateTime = require('../DateTime/DateTime');
import DateInputView = require('../CustomInputs/DateInputView');

class ClickToEditTimeView extends ClickToEditBaseView
{
    private _displayFormat: string = 'MMMM D, YYYY';
    public get displayFormat(): string { return this._displayFormat; }
    public set displayFormat(value: string) { this._displayFormat = value; }

    private _dateInputView: DateInputView = null;
    private get dateInputView(): DateInputView { return this._dateInputView; }
    private set dateInputView(value: DateInputView) { this._dateInputView = value; }

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
        return ClickToEditType.date;
    }

    public element($form: JQuery, settings: any): JQuery
    {
        var $input = $('<input>').addClass('form-control');
        $input.height(settings.height);
        $form.append($input);
        this.dateInputView = <DateInputView> DateInputView.fromJQuery($input);
        return $input;
    }

    /**
     * Set the value of the input to match the value of the contentString.
     */
    public content($form: JQuery, contentString: string, settings: any): void
    {
        this.dateInputView.value = this._$el.data("logical_value") || this.dateInputView.value;
    }

    /**
     * Returns the string html value of the form value. Do processing
     * such as converting \n to <br>
     */
    public processFormValue(value: string, settings: any): string
    {
        var logicalValue: Date = this.dateInputView.value;
        this._$el.data('logical_value', logicalValue);
        this.dateInputView = null;
        return this.encodeDecodeProxy.htmlEncode(logicalValue.format(this.displayFormat));
    }
}

export = ClickToEditTimeView;