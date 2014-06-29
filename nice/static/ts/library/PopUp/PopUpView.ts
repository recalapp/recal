/// <reference path="../../typings/tsd.d.ts" />
// imports
import $ = require('jquery');
import FocusableView = require('../CoreUI/FocusableView');
import PopUpCommon = require('./PopUpCommon');

// aliases
import PopUpType = PopUpCommon.PopUpType;

class PopUpView extends FocusableView
{
    private _popUpId : number;
    get popUpId() : number { return this._popUpId; }
    set popUpId(newValue: number) { this._popUpId = newValue; }

    private _color : String;
    get color() : String { return this._color; }
    set color(newValue : String) { this._color = newValue; this._updateColor(); }

    private _type : PopUpType;
    get isMain() : Boolean
    {
        return this._type === PopUpType.main;
    }

    constructor(view : JQuery)
    {
        super(view);
        // TODO handle main/not main difference
        // TODO make draggable
        // TODO make resizable
        // TODO handle mousedown (should be in view controller?)
        // TODO support for shift-click
        // TODO max height (maybe should be in css? or some other location)
        // TODO initialize as needed
        // TODO activate tool tip - separate module
        // TODO theme - separate module
        // NOTE extra initialization can be done by overriding the constructor
    }

    private _makeResizable() : void
    {
        // TODO PopUp_makeResizable
    }

    public removeFromParent() : void
    {
        super.removeFromParent();
        // TODO handle PopUp_close() logic
    }

    public focusView() : void
    {
        // TODO handle focus (appearance only, not logic)
    }

    public blurView() : void
    {
        // TODO PopUp_loseFocus()
    }

    private _updateColor() : void
    {
        // TODO make color a class
        // TODO PopUp_setColor
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
