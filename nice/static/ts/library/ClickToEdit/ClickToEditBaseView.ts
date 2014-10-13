/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />

import $ = require('jquery');

import ClickToEdit = require('./ClickToEdit');
import BrowserEvents = require("../Core/BrowserEvents");
import FocusableView = require('../CoreUI/FocusableView');
import EncodeDecodeProxy = require("../Core/EncodeDecodeProxy");
import InvalidArgumentException = require('../Core/InvalidArgumentException');
import Set = require('../DataStructures/Set');
import View = require('../CoreUI/View');

class ClickToEditBaseView extends FocusableView implements ClickToEdit.IClickToEditView
{
    private logicalValue: string = null;

    private static _encodeDecodeProxy: EncodeDecodeProxy = null;
    public get encodeDecodeProxy(): EncodeDecodeProxy
    {
        if (!ClickToEditBaseView._encodeDecodeProxy)
        {
            ClickToEditBaseView._encodeDecodeProxy = new EncodeDecodeProxy();
        }
        return ClickToEditBaseView._encodeDecodeProxy;
    }

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
        if (!this._$el.is('p, h1, h2, h3, h4, h5, h6, span'))
        {
            throw new InvalidArgumentException('ClickToEdit must be p, h1, h2, h3, h4, h5, h6, or span');
        }
        this._initializeClickToEdit();
    }

    private _initializeClickToEdit()
    {
        var options = this.options();
        options.type = this.inputType;
        options.event = BrowserEvents.clickToEditShouldBegin;
        options.onblur = 'submit';
        options.callback = (value: string, settings: any)=>{
            this.triggerEvent(BrowserEvents.clickToEditComplete, {
                value: this.logicalValue,
            });
        };
        this._$el.editable((value: string, settings: any)=>
        {
            var processed = this.processFormValue(value, settings);
            this.logicalValue = value;
            return processed;
        }, options);
        this.attachEventHandler(BrowserEvents.click, () =>
        {
            this.triggerEvent(BrowserEvents.clickToEditShouldBegin);
        });
    }

    get value(): string
    {
        return this._$el.text();
    }

    set value(text: string)
    {
        this._$el.text(text);
    }

    public didFocus(): void
    {
        super.didFocus();
        this.triggerEvent(BrowserEvents.clickToEditShouldBegin);
        // don't allow itself to be tabbed when focused, since the form
        // will receive the tab
        this._$el.attr('tabindex', -1);
    }

    public didBlur(): void
    {
        super.didBlur();
        this._$el.attr('tabindex', 0);
    }

    public options(): any
    {
        return {};
    }

    /**
     * The unique input type identifier associated with this type of input
     */
    public get inputType(): string
    {
        return 'text';
    }

    /**
     * Returns the string html value of the form value. Do processing
     * such as converting \n to <br>
     */
    public processFormValue(value: string, settings: any): string
    {
        return this.encodeDecodeProxy.htmlEncode(value);
    }

    /**
     * Create a new input element and attach it to the form. Return part of the
     * created element meant to hold the value of the input
     */
    public element($form: JQuery, settings: any): JQuery
    {
        var $input = $('<input>');
        $form.append($input);
        return $input;
    }

    /**
     * Set the value of the input to match the value of the contentString.
     */
    public content($form: JQuery, contentString: string, settings: any): void
    {
        var decoded = this.encodeDecodeProxy.htmlDecode(contentString);
        $form.find('input').val(decoded);
    }

    /**
     * Call before the value of the form is saved. Not usually needed.
     * Use processFormValue() instead to parse the value of the form
     * back to the appropriate display element.
     */
    public submit($form: JQuery, settings: any): void
    {
    }

    /**
     * Initialize any plugins here
     */
    public plugin($form: JQuery, settings: any): void
    {
    }
}
export = ClickToEditBaseView;
