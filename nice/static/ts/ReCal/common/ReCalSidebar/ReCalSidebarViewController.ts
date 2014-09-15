/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import BrowserEvents = require('../../../library/Core/BrowserEvents');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import ReCalCommonBrowserEvents = require('../ReCalCommonBrowserEvents');
import ReCalSidebar = require('./ReCalSidebar');
import PopUp = require('../../../library/PopUp/PopUp');
import PopUpView = require('../../../library/PopUp/PopUpView');
import Sidebar = require('../../../library/Sidebar/Sidebar');
import ViewController = require('../../../library/CoreUI/ViewController');

import IPopUpView = PopUp.IPopUpView;
import IReCalSidebarViewController = ReCalSidebar.IReCalSidebarViewController;
import ISidebarView = Sidebar.ISidebarView;

/************************************************************************
  * This class is responsible for managing the sidebar in ReCal. In particular,
  * it is responsible for listening to the following events:
  * 1. When a PopUp view is supposed to go into the sidebar.
  * 2. When a notification view is supposed to be shown.
  * 3. When a similar event is found.
  * 4. When a set of events is supposed to be show in the full sidebar view.
  **********************************************************************/
class ReCalSidebarViewController extends ViewController implements IReCalSidebarViewController
{
    constructor(sidebarView: ISidebarView)
    {
        super(sidebarView)
    }

    public get view(): ISidebarView
    {
        return <ISidebarView> this._view;
    }

    /**
      * Do any initialization needed. Better than overriding constructor
      * because this gives the option of not calling super.initialize();
      */
    public initialize(): void
    {
        this.initializePopUp();
    }

    /**
      * This initializes all the operations related to PopUp
      */
    private initializePopUp(): void
    {
        // add listener for when PopUpView objects begin dragging.
        this.view.attachEventHandler(BrowserEvents.popUpWillDrag, (ev: JQueryEventObject, extra: any) => 
        {
            var popUpView: IPopUpView = <IPopUpView> extra.view;
            // when we begin dragging, we remove from sidebar and trigger this 
            // event, allowing other controllers to add this PopUpView to their 
            // view
            popUpView.removeFromParent(); 
            this.view.triggerEvent(ReCalCommonBrowserEvents.popUpWillDetachFromSidebar, {
                popUpView: popUpView,
            });
        });

        // register popup as a droppable object
        this.view.registerDroppable(PopUpView.cssSelector());

        // add listenter for when PopUpView object was dropped into sidebar
        GlobalBrowserEventsManager.instance.attachGlobalEventHandler(
                ReCalCommonBrowserEvents.popUpWillDetachFromSidebar, 
                (ev: JQueryEventObject, extra: any) => 
                {
                    var popUpView: IPopUpView = <IPopUpView> extra.popUpView;
                    this.addPopUpView(popUpView);
                });
        
    }

    /**
      * Add a PopUpView object to the Sidebar. PopUpView object
      * must be detached from its previous parent first. If there is an
      * existing PopUpView object, it is removed first and replaced.
      */
    public addPopUpView(popUpView: IPopUpView): void
    {
        // TODO ensure there is only one main popup (for now)
    }
}
export = ReCalSidebarViewController;
