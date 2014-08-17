/// <reference path="../../typings/tsd.d.ts" />
/// <amd-dependency path="bootstrap" />

import $ = require('jquery');

import BrowserEvents = require('../Core/BrowserEvents');
import GlobalCssClass = require('../Core/GlobalCssClass');
import CoreUI = require('./CoreUI');
import View = require('./View');

import IFocusableView = CoreUI.IFocusableView;
import IView = CoreUI.IView;

class FocusableView extends View implements IFocusableView
{
    private _hasFocus = false;
    
    /**
      * The unique css class for this class.
      */
    public static get cssClass(): string
    {
        return View.cssClass + ' focusableView';
    }

    constructor($element: JQuery, cssClass: string)
    {
        super($element, cssClass);
        this._$el.attr('tabindex', 0);
        this._$el.removeClass(GlobalCssClass.invisibleFocus);
        this._$el.find('*').each((index: number, child: any) => 
        {
            var $child = $(child);
            if ($child.attr('tabindex') === undefined || $child.attr('tabindex') === null)
            {
                $child.attr('tabindex', -1); // this allows the child to be focused but not be in the tab order
                $child.addClass(GlobalCssClass.invisibleFocus);
                // TODO add to css: { outline-color: transparent; outline-style: none; }
            }
        });
        this.attachEventHandler(BrowserEvents.focusIn, (ev : JQueryEventObject) => 
        {
            if (this.containsJQueryElement($(document.activeElement)))
            {
                this.didFocus();
            }
        });
        this.attachEventHandler(BrowserEvents.focusOut, (ev : JQueryEventObject) => 
        {
            if (!this.containsJQueryElement($(document.activeElement)))
            {
                this.didBlur();
            }
        });
    }
    get hasFocus() : boolean
    {
        return this._hasFocus;
    }

    public didFocus() : void
    {
        this._hasFocus = true;
    }
    public didBlur() : void
    {
        this._hasFocus = false;
    }

    /**
      * Shows a view as popover originating from this view
      */
    public showViewInPopover(childView: IView, placement: string = 'auto'): void
    {
        var childViewCasted: View = <View> childView;
        this._$el.popover('destroy');
        this._$el.popover({
            template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>', // gets rid of the default title space
            placement: placement,
            html: true,
            content: childViewCasted._$el[0],
            trigger: 'focus',
            // TODO container - needed?
        });
        this._$el.focus();
    }
}
export = FocusableView;
