/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import BrowserEvents = require('../../../library/Core/BrowserEvents');
import EventsPopUp = require('../EventsPopUp/EventsPopUp');
import EventsPopUpView = require('../EventsPopUp/EventsPopUpView');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import GlobalInstancesManager = require('../GlobalInstancesManager');
import ReCalCommonBrowserEvents = require('../ReCalCommonBrowserEvents');
import ReCalSidebar = require('./ReCalSidebar');
import Sidebar = require('../../../library/Sidebar/Sidebar');
import ViewController = require('../../../library/CoreUI/ViewController');

import IEventsPopUpView = EventsPopUp.IEventsPopUpView
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
    private static SIDEBAR_POPUP_PREFIX = 'sidebar_popup_';
    private _currentPopUpView: IEventsPopUpView = null;
    private get currentPopUpView(): IEventsPopUpView
    {
        return this._currentPopUpView;
    }
    private set currentPopUpView(value: IEventsPopUpView)
    {
        this._currentPopUpView = value;
    }

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
            var popUpView: IEventsPopUpView = <IEventsPopUpView> extra.view;
            // when we begin dragging, we remove from sidebar and trigger this 
            // event, allowing other controllers to add this PopUpView to their 
            // view
            this.removePopUpView(popUpView);
            this.view.triggerEvent(ReCalCommonBrowserEvents.popUpWillDetachFromSidebar, {
                popUpView: popUpView,
            });
            // now also update the event selection state by pinning the event
            GlobalInstancesManager.instance.eventsOperationsFacade.pinEventWithId(popUpView.eventsModel.eventId);

        });

        // register popup as a droppable object
        this.view.registerDroppable(EventsPopUpView.cssSelector());

        // add listener for when PopUpView object was dropped into sidebar
        GlobalBrowserEventsManager.instance.attachGlobalEventHandler(
                ReCalCommonBrowserEvents.popUpWasDroppedInSidebar, 
                (ev: JQueryEventObject, extra: any) => 
                {
                    var popUpView: IEventsPopUpView = <IEventsPopUpView> extra.popUpView;
                    this.addPopUpView(popUpView);
                    // update event selection state
                    GlobalInstancesManager.instance.eventsOperationsFacade.unpinEventWithId(popUpView.eventsModel.eventId);
                });

        // add listener for when event selection state changes
        GlobalBrowserEventsManager.instance.attachGlobalEventHandler(
                ReCalCommonBrowserEvents.eventSelectionChanged,
                (ev: JQueryEventObject, extra: any) =>
                {
                    var eventId = extra.eventId;
                    if (eventId === null || eventId === undefined)
                    {
                        // TODO get the main popup, then do stuffs
                        return;
                    }
                    if (GlobalInstancesManager.instance.eventsOperationsFacade.eventIdIsMain(eventId))
                    {
                        // this event is supposed to be main
                        if (this.currentPopUpView === null || this.currentPopUpView === undefined)
                        {
                            // create the popup view
                            this.currentPopUpView = new EventsPopUpView();
                            // TODO set events model
                            // this.currentPopUpView.eventsModel =
                            this.addPopUpView(this.currentPopUpView);
                        }
                    }
                    else
                    {
                        // event is no longer main. if it matches our current 
                        // popup, then remove the popup
                        if (this.currentPopUpView && this.currentPopUpView.eventsModel.eventId === eventId)
                        {
                            this.removePopUpView(this.currentPopUpView);
                        }
                    }
                });
        
    }

    /**
      * Add a PopUpView object to the Sidebar. PopUpView object
      * must be detached from its previous parent first. If there is an
      * existing PopUpView object, it is removed first and replaced.
      */
    private addPopUpView(popUpView: IEventsPopUpView): void
    {
        // ensure there is only one main popup (for now)
        if (this.currentPopUpView !== null)
        {
            this.removePopUpView(this.currentPopUpView);
        }
        this.currentPopUpView = popUpView;
        this.view.pushStackViewWithIdentifier(this.currentPopUpView, this.getIdentifierForPopUpView(this.currentPopUpView));
    }

    /**
      * Remove the popup from sidebar
      */
    private removePopUpView(popUpView: IEventsPopUpView): void
    {
        if (this.currentPopUpView === popUpView)
        {
            this.currentPopUpView = null;
        }
        this.view.popStackViewWithIdentifier(this.getIdentifierForPopUpView(popUpView));
    }

    /**
      * Get the stack view identifier for this popUpView. 
      * TODO make unique if we want to support multiple popups in sidebar
      */
    private getIdentifierForPopUpView(popUpView: IEventsPopUpView)
    {
        return ReCalSidebarViewController.SIDEBAR_POPUP_PREFIX;
    }
}
export = ReCalSidebarViewController;
