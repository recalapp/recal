/// <reference path="../../typings/tsd.d.ts" />
/// <amd-dependency path="bootstrap" />
/// <amd-dependency path="jqueryui" />
// imports
import $ = require('jquery');
import BrowserEvents = require('../Core/BrowserEvents');
import ClickToEditBaseView = require('../ClickToEdit/ClickToEditBaseView');
import FocusableView = require('../CoreUI/FocusableView');
import PopUp = require('./PopUp');
import PopUpCommon = require('./PopUpCommon');
import PopUpType = require('./PopUpType');

// aliases
import IPopUpView = PopUp.IPopUpView;

var oldMouseStart = (<any>$.ui).draggable.prototype._mouseStart;
(<any>$.ui).draggable.prototype._mouseStart = function (event, overrideHandle, noActivation) {
        this._trigger("beforeStart", event, this._uiHash());
        oldMouseStart.apply(this, [event, overrideHandle, noActivation]);
    };

class PopUpView extends FocusableView implements IPopUpView
{
    private _popUpId: string;
    public  get popUpId(): string { return this._popUpId; }
    public set popUpId(newValue: string) { this._popUpId = newValue; }

    private _color: string;
    public get color(): string { return this._color; }
    public set color(newValue: string) { this._color = newValue; this._updateColor(); }

    private _type: PopUpType = PopUpType.pinned;
    public get type(): PopUpType { return this._type; }
    public set type(value: PopUpType) { this._type = value; }

    /**
      * The unique css class for this class.
      */
    public static get cssClass(): string
    {
        return FocusableView.cssClass + ' ' + PopUpCommon.cssClass;
    }

    constructor($element : JQuery, cssClass: string)
    {
        super($element, cssClass);
        // TODO handle main/not main difference
        this.makeDraggable();
        this.attachEventHandler(BrowserEvents.popUpWillDetach, (ev, eventData) =>
                {
                    var popUpView = <PopUpView> eventData.view;
                    popUpView.makeResizable();
                });
        this.attachEventHandler(BrowserEvents.mouseDown, (ev: JQueryEventObject)=>
        {
            // don't prevent default, the default behavior causes other elements
            // to lose focus
            var $targetView = $(ev.target);
            if (!$targetView.is(ClickToEditBaseView.cssSelector()))
            {
                $targetView.focus();
            }
        });
        // TODO support for shift-click
        // TODO WONTFIX max height - in subclass
        // TODO initialize as needed
        // TODO tool tip - separate module - maybe in View base
        // this._$el.find('.withtooltip').tooltip({});
        // TODO theme - separate module
        // NOTE extra initialization can be done by overriding the constructor
    }

    public makeDraggable() : void
    {
        this._$el.draggable({
            handle: '.panel > .panel-heading',
            containment: '#content_bounds',
            scroll: false,
            appendTo: 'body',
            zIndex: 2000,
            beforeStart: (ev, ui) => {
                if (this.type !== PopUpType.detached)
                {
                    this.type = PopUpType.detached;
                    // TODO handle main/pinned
                    // TODO WONTFIX see if bounding rect logic is needed - do that in a subclass
                    this.triggerEvent(BrowserEvents.popUpWillDetach);
                    // needed because when first move, we move to a different
                    // parent. maybe should expose as an event
                }
            },
        });
    }
    public makeResizable() : void
    {
        this._$el.find(PopUpCommon.panelCssSelector).resizable({
            stop: (ev, ui) => {
                this._$el.css("height", ui.size.height);
                this._$el.css('width', ui.size.width);
                // TODO setbodywidth
            },
        });
    }

    public didFocus() : void
    {
        super.didFocus();
        this.highlight();
    }

    public didBlur() : void
    {
        super.didBlur();
        this.unhighlight();
    }

    public highlight() : void
    {
        this._$el.css('z-index', '200');

        var $panel = this._$el.find(PopUpCommon.panelCssSelector);
        $panel.addClass(PopUpCommon.focusClass).removeClass(PopUpCommon.blurClass);
        // TODO color and opacity
    }

    public unhighlight() : void
    {
        // TODO PopUp_loseFocus()
        this._$el.css('z-index', '100');
        var $panel = this._$el.find(PopUpCommon.panelCssSelector);
        $panel.addClass(PopUpCommon.blurClass).removeClass(PopUpCommon.focusClass);

    }

    private _updateColor() : void
    {
        // TODO make color a class
        var $heading = this._$el.find(PopUpCommon.headingCssSelector);
        var opacity : number = this.hasFocus ? PopUpCommon.focusOpacity : PopUpCommon.blurOpacity;
        $heading.css({
            'background-color': this.color,
            'border-color': this.color,
            opacity: opacity,
        });
    }
    /*
       Not implemented:
       PopUp_getMainPopUp()
       PopUp_makeMain()
       _PopUp_setBodyHeight()
       PopUp_updateSize()
       listeners

       in PopUpContainerViewController:
       PopUp_map()
       PopUp_getPopUpByID()
       */
}

export = PopUpView;
