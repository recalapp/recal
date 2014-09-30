/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import ClickToEditBaseView = require('./ClickToEditBaseView');
import ClickToEditType = require('./ClickToEditType');

class ClickToEditSelectView extends ClickToEditBaseView
{
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
        // don't set the height, use default
        $form.append($input);
        return $input;
    }
}

export = ClickToEditSelectView;