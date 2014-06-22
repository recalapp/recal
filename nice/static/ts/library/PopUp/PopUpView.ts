/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');
import FocusableView = require('../CoreUI/FocusableView');

class PopUpView extends FocusableView
{
    
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
        // NOTE extra initialization can be done by overriding the constructor
    }

    private _makeResizable() : void
    {
        // TODO PopUp_makeResizable
    }

    removeFromParent() : void
    {
        super.removeFromParent();
        // TODO handle PopUp_close() logic
    }

    focusView() : void
    {
        // TODO handle focus (appearance only, not logic)
    }

    blurView() : void
    {
        // TODO PopUp_loseFocus()
    }

    setColor(color : string) : void
    {
        // TODO make color a class
        // TODO PopUp_setColor
    }
    /*
       Not implemented:
       PopUp_getMainPopUp()
       PopUp_getPopUpByID()
       PopUp_makeMain()
       PopUp_map()
       _PopUp_setBodyHeight()
       PopUp_updateSize()
       listeners
       */
}

export = PopUpView;
