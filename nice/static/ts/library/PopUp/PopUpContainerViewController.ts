/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');
import BrowserEvents = require('../Core/BrowserEvents');
import CoreUI = require('../CoreUI/CoreUI');
import GlobalBrowserEventsManager = require('../Core/GlobalBrowserEventsManager');
import PopUp = require('./PopUp');
import PopUpCommon = require('./PopUpCommon');
import PopUpView = require('./PopUpView');
import ViewController = require('../CoreUI/ViewController');

import IPopUpContainerViewController = PopUp.IPopUpContainerViewController;
import IPopUpView = PopUp.IPopUpView;
import IView = CoreUI.IView;

class PopUpContainerViewController extends ViewController implements IPopUpContainerViewController
{
    /**
      * Returns all the PopUpViews in this container.
      */
    public get popUpViews(): IPopUpView[]
    {
        return <IPopUpView[]> $.grep(this.view.children, (childView : IView, index: number) => {
            return childView.is(PopUpView.cssSelector());
        });
    }

    /**
      * Get the PopUpView with the specified ID.
      */
    public getPopUpById(popUpId: string): IPopUpView
    {
        var ret = null;
        $.each(this.popUpViews, (index: number, popUpView : IPopUpView) => {
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
