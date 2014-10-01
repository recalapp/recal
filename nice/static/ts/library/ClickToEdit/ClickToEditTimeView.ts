/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import BrowserEvents = require('../Core/BrowserEvents');
import ClickToEditBaseView = require('./ClickToEditBaseView');
import ClickToEditType = require('./ClickToEditType');
import FocusableView = require('../CoreUI/FocusableView');

class ClickToEditTimeView extends ClickToEditBaseView
{

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
        var inputView = <FocusableView> FocusableView.fromJQuery($input);
        inputView.attachEventHandler(BrowserEvents.keyPress, (ev: JQueryEventObject)=>{
            ev.preventDefault();
            // TODO custom logic
        });
        $form.append($input);
        return $input;
    }

    /**
     * Set the value of the input to match the value of the contentString.
     */
    public content($form: JQuery, contentString: string, settings: any): void
    {
    }

    /**
     * Returns the string html value of the form value. Do processing
     * such as converting \n to <br>
     */
    public processFormValue(value: string, settings: any): string
    {
        return this.encodeDecodeProxy.htmlEncode(value);
    }
}

export = ClickToEditTimeView;