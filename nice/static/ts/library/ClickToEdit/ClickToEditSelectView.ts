/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import ClickToEditBaseView = require('./ClickToEditBaseView');
import ClickToEditType = require('./ClickToEditType');

class ClickToEditSelectView extends ClickToEditBaseView
{

    private _selectOptions: { value: string; displayText: string;}[] = [];
    public get selectOptions(): { value: string; displayText: string;}[] { return this._selectOptions; }
    public set selectOptions(value: { value: string; displayText: string;}[]) { this._selectOptions = value; }

    /**
     * The unique css class for this class.
     */
    public static get cssClass(): string
    {
        return ClickToEditBaseView.cssClass + ' clickToEditSelectView';
    }

    /**
     * The unique input type identifier associated with this type of input
     */
    public get inputType(): string
    {
        return ClickToEditType.select;
    }

    public element($form: JQuery, settings: any): JQuery
    {
        // TODO need a list of values and display texts
        var $input = $('<select class="form-control">');
        this.selectOptions.map((option: { value: string; displayText: string;}, index: number)=>{
            var $option = $('<option>');
            $option.attr('value', option.value);
            $option.text(option.displayText);
            $input.append($option);
        });
        // don't set the height, use default
        $form.append($input);
        return $input;
    }
}

export = ClickToEditSelectView;