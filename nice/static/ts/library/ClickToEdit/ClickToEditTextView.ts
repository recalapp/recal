/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />
/// <amd-dependency path="jeditable" />

import $ = require('jquery');

import ClickToEditBaseView = require('./ClickToEditBaseView');

class ClickToEditTextView extends ClickToEditBaseView
{
    /**
      * The unique css class for this class.
      */
    public static get cssClass(): string
    {
        return ClickToEditBaseView.cssClass + ' clickToEditTextView';
    }

    /**
      * The unique input type identifier associated with this type of input
      */
    public inputType() : string
    {
        return 'CTE_Text';
    }

    /**
      * Create a new input element and attach it to the form. Also return
      * the created element.
      */
    public element($form: JQuery, settings: any) : JQuery
    {
        var $input = $('<input>').addClass('form-control');
        $form.append($input);
        return $input;
    }
}
export = ClickToEditTextView;
