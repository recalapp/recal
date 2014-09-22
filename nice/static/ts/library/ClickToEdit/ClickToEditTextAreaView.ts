/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />

import $ = require('jquery');

import ClickToEditBaseView = require('./ClickToEditBaseView');
import ClickToEditType = require('./ClickToEditType');
import EncodeDecodeProxy = require("../Core/EncodeDecodeProxy");

class ClickToEditTextAreaView extends ClickToEditBaseView
{

    /**
      * The unique css class for this class.
      */
    public static get cssClass(): string
    {
        return ClickToEditBaseView.cssClass + ' clickToEditTextAreaView';
    }

    /**
      * The unique input type identifier associated with this type of input
      */
    public get inputType() : string
    {
        return ClickToEditType.textArea;
    }

    /**
      * Returns the string html value of the form value. Do processing
      * such as converting \n to <br>
      */
    public processFormValue(value: string, settings: any) : string
    {
        var encoded = this.encodeDecodeProxy.htmlEncode(value);
        encoded = this.encodeDecodeProxy.newLinesToBr(encoded);
        return encoded;
    }

    /**
      * Create a new input element and attach it to the form. Also return
      * the created element.
      */
    public element($form: JQuery, settings: any) : JQuery
    {
        var $input = $('<textarea>').addClass('form-control');
        $input.height(settings.height);
        $form.append($input);
        return $input;
    }

    /**
      * Set the value of the input to match the value of the contentString.
      */
    public content($form: JQuery, contentString: string, settings: any) : void
    {
        var decoded = this.encodeDecodeProxy.brToNewLines(contentString);
        decoded = this.encodeDecodeProxy.htmlDecode(decoded);
        $form.find('textarea').val(decoded);
    }
}
export = ClickToEditTextAreaView;
