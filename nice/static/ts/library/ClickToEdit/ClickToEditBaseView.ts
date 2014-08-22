/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />

import $ = require('jquery');

import BrowserEvents = require("../Core/BrowserEvents");
import FocusableView = require('../CoreUI/FocusableView');
import EncodeDecodeProxy = require("../Core/EncodeDecodeProxy");
import InvalidArgumentException = require('../Core/InvalidArgumentException');
import Set = require('../DataStructures/Set');

class ClickToEditBaseView extends FocusableView
{
    private static _customTypes = new Set();

    /**
      * The unique css class for this class.
      */
    public static get cssClass(): string
    {
        return FocusableView.cssClass + ' clickToEdit';
    }

    constructor($element: JQuery, cssClass: string)
    {
        super($element, cssClass);
        if (!this._$el.is('p, h1, h2, h3, h4, h5, h6'))
        {
            throw new InvalidArgumentException('ClickToEdit must be p, h1, h2, h3, h4, h5, or h6');
        }
        this._initializeClickToEdit();
    }

    private _initializeClickToEdit()
    {
        if (!ClickToEditBaseView._customTypes.contains(this.inputType()))
        {
            // initialize the custom type
            ClickToEditBaseView._customTypes.add(this.inputType());

            // NOTE this = form in the context of functions
            $.editable.addInputType(this.inputType(), {
                element: function(settings, original) {
                    // ok to do this because we assume the view is
                    // already initialized, so the created instance
                    // will be of the correct ClickToEdit type.
                    var view = <ClickToEditBaseView> ClickToEditBaseView.fromJQuery($(original));
                    return view.element($(this), settings);
                },
                content: function(contentString, settings, original){
                    var view = <ClickToEditBaseView> ClickToEditBaseView.fromJQuery($(original));
                    return view.content($(this), contentString, settings);
                },
                plugin: function(settings, original){
                    var view = <ClickToEditBaseView> ClickToEditBaseView.fromJQuery($(original));
                    return view.plugin($(this), settings);
                },
            });
        }
        var options = this.options();
        options.type = this.inputType();
        options.event = BrowserEvents.clickToEditShouldBegin;
        options.onblur = 'submit';
        this._$el.editable((value: string, settings: any)=>{
            var processed = this.processFormValue(value, settings);
            this.triggerEvent(BrowserEvents.clickToEditComplete, {
                value: processed,
            });
            return processed;
        }, options);
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

    public didFocus() : void
    {
        super.didFocus();
        this.triggerEvent(BrowserEvents.clickToEditShouldBegin); 
        // don't allow itself to be tabbed when focused, since the form
        // will receive the tab
        this._$el.attr('tabindex', -1);
    }

    public didBlur() : void
    {
        super.didBlur();
        this._$el.attr('tabindex', 0);
    }

    public options() : any
    {
        return {};
    }

    /**
      * The unique input type identifier associated with this type of input
      */
    public inputType() : string
    {
        return 'text';
    }

    /**
      * Returns the string html value of the form value. Do processing
      * such as converting \n to <br>
      */
    public processFormValue(value: string, settings: any) : string
    {
        return EncodeDecodeProxy.instance.htmlEncode(value);
    }

    /**
      * Create a new input element and attach it to the form. Also return
      * the created element.
      */
    public element($form: JQuery, settings: any) : JQuery
    {
        var $input = $('<input>');
        $form.append($input);
        return $input;
    }

    /**
      * Set the value of the input to match the value of the contentString.
      */
    public content($form: JQuery, contentString: string, settings: any) : void
    {
        var decoded = EncodeDecodeProxy.instance.htmlDecode(contentString);
        $form.find('input').val(decoded);
    }

    /**
      * Call before the value of the form is saved. Not usually needed.
      * Use processFormValue() instead to parse the value of the form
      * back to the appropriate display element.
      */
    public submit($form: JQuery, settings: any) : void
    {
    }

    /**
      * Initialize any plugins here
      */
    public plugin($form: JQuery, settings: any) : void
    {
    }
}
export = ClickToEditBaseView;
