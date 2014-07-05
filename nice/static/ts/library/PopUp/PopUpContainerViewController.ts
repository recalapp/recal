/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');
import BrowserEvents = require('../Core/BrowserEvents');
import GlobalBrowserEventsManager = require('../Core/GlobalBrowserEventsManager');
import PopUpCommon = require('./PopUpCommon');
import PopUpView = require('./PopUpView');
import View = require('../CoreUI/View');
import ViewController = require('../CoreUI/ViewController');

class PopUpContainerViewController extends ViewController
{
    constructor(view)
    {
        super(view);
        GlobalBrowserEventsManager.instance().attachGlobalEventHandler(BrowserEvents.Events.mouseDown, PopUpCommon.AllDescendentsSelector, (ev: JQueryEventObject) =>
                {
                    ev.preventDefault();
                    var $popUpElement = PopUpCommon.findPopUpFromChild($(ev.target));
                    var popUpView : PopUpView = <PopUpView> PopUpView.fromJQuery($popUpElement);
                    this.giveFocus(popUpView);
                });
    }

    private _tryGetMainPopUp() : PopUpView
    {
        var ret = null;
        this.map((popUpView : PopUpView) => {
            if (popUpView.isMain)
            {
                ret = popUpView;
                return false;
            }
        });
        return ret;
    }

    public hasMain() : Boolean
    {
        return this._tryGetMainPopUp() !== null;
    }

    /**
     * Give focus to its PopUpView and cause all other PopUps to lose focus
     */
    public giveFocus(toBeFocused : PopUpView) : void
    {
        // find a way to get all popups
        this.map((popUpView : PopUpView) => {
            popUpView === toBeFocused ? popUpView.focusView() : popUpView.blurView();
        });
    }

    public map(apply : (popUpView : PopUpView) => any) : void
    {
        // TODO must be overridden to support sidebar
        $.each(this.view.children, (index : number, childView : View) => {
            if (childView instanceof PopUpView)
            {
                return apply(<PopUpView>childView);
            }
        });
    }

    public getPopUpById(popUpId : number) : PopUpView
    {
        var ret = null;
        this.map((popUpView : PopUpView) => {
            if (popUpView.popUpId === popUpId)
            {
                ret = popUpView;
                return false;
            }
        });
        return ret;
    }
}
export = PopUpContainerViewController;
