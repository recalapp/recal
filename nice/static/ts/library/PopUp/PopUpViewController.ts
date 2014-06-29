/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');
import BrowserEvents = require('../Core/BrowserEvents');
import ViewController = require('../CoreUI/ViewController');
import PopUpView = require('PopUpView');

enum PopUpType { main, detached };

class PopUpViewController extends ViewController
{
    // ID logic should be here? makes more sense

    private _popUpId : Number = null;

    private _type : PopUpType;



    get popUpId() : Number
    {
        return this._popUpId;
    }
    set popUpId(newValue : Number)
    {
        this._popUpId = newValue;
    }

    get isMain() : Boolean
    {
        return this._type == PopUpType.main;
    }

    constructor(view : PopUpView)
    {
        super(view);
        // TODO theme - separate module
        this.view.attachEventHandler(BrowserEvents.Events.mouseDown, (ev: JQueryEventObject) =>
                {
                    this.giveFocus();
                });
    }

    /**
     * Give focus to its PopUpView and cause all other PopUps to lose focus
     */
    public giveFocus() : void
    {
        (<PopUpView> this.view).focusView();
        // find a way to get all popups
    }
}
