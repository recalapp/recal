/// <reference path="../../typings/tsd.d.ts" />
/// <amd-dependency path="bootstrap" />

import $ = require('jquery');

import BrowserEvents = require('../Core/BrowserEvents');
import CoreUI = require('./CoreUI');
import GlobalCssClass = require('../Core/GlobalCssClass');
import InvalidActionException = require('../Core/InvalidActionException');
import View = require('./View');

import IFocusableView = CoreUI.IFocusableView;
import IView = CoreUI.IView;

class FocusableView extends View implements IFocusableView
{
    private _hasFocus = false;
    private _popoverView: FocusableView = null;
    
    private get popoverView(): FocusableView
    {
        return this._popoverView;
    }
    private set popoverView(value: FocusableView)
    {
        this._popoverView = value;
    }

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
        this.attachEventHandler(BrowserEvents.keyPress, (ev: JQueryEventObject)=>
        {
            var keyCode = ev.keyCode || ev.which;
            if (keyCode == 13) // enter key
            {
                if (this.hasFocus)
                {
                    this.triggerEvent(BrowserEvents.click, {
                        keyCode: keyCode,
                    });
                }
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
        this.triggerEvent(BrowserEvents.focusableViewDidFocus);
    }
    public didBlur() : void
    {
        this._hasFocus = false;
        this.triggerEvent(BrowserEvents.focusableViewDidBlur);

        // popover
        if (this.popoverView !== null && this.popoverView !== undefined)
        {
            // TODO right now need setTimeout because
            // browser first calls blur, then focus. 
            // so by this time, the popoverView may not
            // have received focus yet. Figure out a better
            // way to do this.
            setTimeout(()=>{
                
                if (!this.popoverView.hasFocus)
                {
                    // focus lost
                    this.hidePopover();
                }
                else
                {
                    // focus lost, but the popover view itself now has focus. we will only call hide when this popover view loses focus
                    this.popoverView.attachEventHandler(BrowserEvents.focusableViewDidBlur, (ev: JQueryEventObject) =>
                    {
                        // timeout handles the case where
                        // the same element is clicked twice.
                        setTimeout(()=>{
                            if (this.popoverView && !this.popoverView.hasFocus)
                            {
                                this.hidePopover();
                            }
                        }, 300);
                    });
                }
            }, 300);
        }
    }

    /**
      * Shows a view as popover originating from this view
      */
    public showViewInPopover(childView: IFocusableView, placement: string = 'auto'): void
    {
        var childViewCasted: FocusableView = <FocusableView> childView;
        this.popoverView = childViewCasted;
        if (this.popoverView !== null && this.popoverView !== undefined)
        {
            this._$el.popover('destroy');
        }
        this._$el.popover({
            template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>', // gets rid of the default title space
            placement: placement,
            html: true,
            content: childViewCasted._$el[0],
            trigger: 'manual',
            // TODO container - needed?
        });
        this._$el.popover('show');
        if (!this.hasFocus)
        {
            this._$el.focus();
        }
    }

    /**
      * Remove the popover element
      */
    public hidePopover(): void
    {
        if (this.popoverView === null || this.popoverView === undefined)
        {
            throw new InvalidActionException('Cannot call hidePopover when there is no popover shown');
        }
        this._$el.popover('hide');
        this.popoverView = null;
        this.attachOneTimeEventHandler(BrowserEvents.bootstrapPopoverHidden, (ev: JQueryEventObject)=>{
            this._$el.popover('destroy');
        });
    }

    /**
      * Brings the view into focus
      */
    public focus(): void
    {
        this._$el.focus();
    }

    /**
      * Brings the view into blur
      */
    public blur(): void
    {
        this._$el.blur();
    }
}
export = FocusableView;
