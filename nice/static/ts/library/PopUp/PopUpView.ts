/// <reference path="../../typings/tsd.d.ts" />
/// <amd-dependency path="bootstrap" />
/// <amd-dependency path="jqueryui" />
// imports
import $ = require('jquery');
import BrowserEvents = require('../Core/BrowserEvents');
import FocusableView = require('../CoreUI/FocusableView');
import PopUpCommon = require('./PopUpCommon');

// aliases
import PopUpType = PopUpCommon.PopUpType;

var oldMouseStart = (<any>$.ui).draggable.prototype._mouseStart;
(<any>$.ui).draggable.prototype._mouseStart = function (event, overrideHandle, noActivation) {
        this._trigger("beforeStart", event, this._uiHash());
        oldMouseStart.apply(this, [event, overrideHandle, noActivation]);
    };

class PopUpView extends FocusableView
{
    private _popUpId : number;
    get popUpId() : number { return this._popUpId; }
    set popUpId(newValue: number) { this._popUpId = newValue; }

    private _color : String;
    get color() : String { return this._color; }
    set color(newValue : String) { this._color = newValue; this._updateColor(); }

    private _type : PopUpType = PopUpType.main;
    get isMain() : Boolean
    {
        return this._type === PopUpType.main;
    }

    constructor(view : JQuery)
    {
        super(view);
        // TODO handle main/not main difference
        this._makeDraggable();
        this.attachEventHandler(BrowserEvents.Events.popUpWillDetach, (ev, eventData) =>
                {
                    var popUpView = <PopUpView> eventData.view;
                    popUpView._makeResizable();
                });
        // TODO support for shift-click
        // TODO WONTFIX max height - in subclass
        // TODO initialize as needed
        // TODO tool tip - separate module
        this._$el.find('.withtooltip').tooltip({});
        // TODO theme - separate module
        // NOTE extra initialization can be done by overriding the constructor
    }

    private _makeDraggable() : void
    {
        this._$el.draggable({
            handle: '.panel > .panel-heading',
            containment: '#content_bounds',
            scroll: false,
            appendTo: 'body',
            zIndex: 2000,
            beforeStart: (ev, ui) => {
                if (this.isMain)
                {
                    this._type = PopUpType.detached;
                    // TODO handle main/pinned
                    // TODO WONTFIX see if bounding rect logic is needed - do that in a subclass
                    this.triggerEvent(BrowserEvents.Events.popUpWillDetach);
                    // needed because when first move, we move to a different
                    // parent. maybe should expose as an event
                }
            },
        });
    }
    private _makeResizable() : void
    {
        this._$el.find(PopUpCommon.PanelCssSelector).resizable({
            stop: (ev, ui) => {
                this._$el.css("height", ui.size.height);
                this._$el.css('width', ui.size.width);
                // TODO setbodywidth
            },
        });
    }

    public removeFromParent() : void
    {
        super.removeFromParent();
        // TODO WONTFIX handle PopUp_close() logic - subclass
    }

    public focusView() : void
    {
        this._$el.css('z-index', '200');

        var $panel = this._$el.find(PopUpCommon.PanelCssSelector);
        $panel.addClass(PopUpCommon.FocusClass).removeClass(PopUpCommon.BlurClass);
        // TODO color and opacity
    }

    public blurView() : void
    {
        // TODO PopUp_loseFocus()
        this._$el.css('z-index', '100');
        var $panel = this._$el.find(PopUpCommon.PanelCssSelector);
        $panel.addClass(PopUpCommon.BlurClass).removeClass(PopUpCommon.FocusClass);
    }

    private _updateColor() : void
    {
        // TODO make color a class
        var $heading = this._$el.find(PopUpCommon.HeadingCssSelector);
        var opacity : number = this.hasFocus ? PopUpCommon.FocusOpacity : PopUpCommon.BlurOpacity;
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
