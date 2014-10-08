/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import BrowserEvents = require('../../../library/Core/BrowserEvents');
import ClickToEdit = require('../../../library/ClickToEdit/ClickToEdit');
import CoreUI = require('../../../library/CoreUI/CoreUI');
import Events = require('../../common/Events/Events');
import EventsPopUp = require('../EventsPopUp/EventsPopUp');
import EditableEventsPopUpView = require('../EventsPopUp/EditableEventsPopUpView');
import EventsPopUpView = require('../EventsPopUp/EventsPopUpView');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import ReCalCommonBrowserEvents = require('../ReCalCommonBrowserEvents');
import ReCalSidebar = require('./ReCalSidebar');
import Sidebar = require('../../../library/Sidebar/Sidebar');
import ViewController = require('../../../library/CoreUI/ViewController');

import IClickToEditViewFactory = ClickToEdit.IClickToEditViewFactory;
import IEventsModel = Events.IEventsModel;
import IEventsOperationsFacade = Events.IEventsOperationsFacade;
import IEventsPopUpView = EventsPopUp.IEventsPopUpView
import IEventsPopUpViewFactory = EventsPopUp.IEventsPopUpViewFactory;
import IReCalSidebarViewController = ReCalSidebar.IReCalSidebarViewController;
import ISidebarView = Sidebar.ISidebarView;
import IViewTemplateRetriever = CoreUI.IViewTemplateRetriever;

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

    /**
     * Global Browser Events Manager
     */
    private _globalBrowserEventsManager: GlobalBrowserEventsManager = null;
    private get globalBrowserEventsManager(): GlobalBrowserEventsManager { return this._globalBrowserEventsManager; }

    /**
     * Events Operations Facade
     */
    private _eventsOperationsFacade: IEventsOperationsFacade = null;
    private get eventsOperationsFacade(): IEventsOperationsFacade { return this._eventsOperationsFacade; }

    private _eventsPopUpViewFactory: IEventsPopUpViewFactory = null;
    private get eventsPopUpViewFactory(): IEventsPopUpViewFactory { return this._eventsPopUpViewFactory; }

    constructor(sidebarView: ISidebarView, dependencies: ReCalSidebar.ReCalSidebarViewControllerDependencies)
    {
        super(sidebarView);
        this._eventsPopUpViewFactory = dependencies.eventsPopUpViewFactory;
        this._globalBrowserEventsManager = dependencies.globalBrowserEventsManager;
        this._eventsOperationsFacade = dependencies.eventsOperationsFacade;
        this.initializePopUp();
    }

    public get view(): ISidebarView
    {
        return <ISidebarView> this._view;
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
            var boundingRect = popUpView.boundingRect;
            var width = popUpView.width;
            var height = popUpView.height;
            this.removePopUpView(popUpView, false);
            this.view.triggerEvent(ReCalCommonBrowserEvents.popUpWillDetachFromSidebar, {
                popUpView: popUpView,
                boundingRect: boundingRect,
                width: width,
                height: height
            });
            // now also update the event selection state by pinning the event
            this.eventsOperationsFacade.pinEventWithId(popUpView.eventsModel.eventId);

        });

        // register popup as a droppable object
        this.view.registerDroppable(EventsPopUpView.cssSelector());

        // add listener for when PopUpView object was dropped into sidebar
        this.globalBrowserEventsManager.attachGlobalEventHandler(
            ReCalCommonBrowserEvents.popUpWasDroppedInSidebar,
            (ev: JQueryEventObject, extra: any) =>
            {
                var popUpView: IEventsPopUpView = <IEventsPopUpView> extra.popUpView;
                var oldId = null;
                if (this.currentPopUpView)
                {
                    oldId = this.currentPopUpView.eventsModel.eventId;
                }
                this.addPopUpView(popUpView);
                // update event selection state
                this.eventsOperationsFacade.unpinEventWithId(popUpView.eventsModel.eventId);
                if (oldId !== null)
                {
                    this.eventsOperationsFacade.deselectEventWithId(oldId);
                }
            });

        // add listener for when event selection state changes
        this.globalBrowserEventsManager.attachGlobalEventHandler(
            ReCalCommonBrowserEvents.eventSelectionChanged,
            (ev: JQueryEventObject, extra: any) =>
            {
                if (extra === null || extra === undefined || extra.eventIds === null || extra.eventIds === undefined)
                {
                    // can't tell anything. must check everything.
                    return;
                }
                var eventIds = extra.eventIds;
                var mainEventId = null;
                for (var i = 0; i < eventIds.length; ++i)
                {
                    if (this.eventsOperationsFacade.eventIdIsMain(eventIds[i]))
                    {
                        mainEventId = eventIds[i];
                        break;
                    }
                }
                if (mainEventId !== null)
                {
                    // this event is supposed to be main
                    if (this.currentPopUpView === null || this.currentPopUpView === undefined)
                    {
                        // create the popup view
                        var newPopUpView = this.eventsPopUpViewFactory.createEventsPopUp();
                        // set events model
                        newPopUpView.eventsModel = this.eventsOperationsFacade.getEventById(mainEventId);
                        this.addPopUpView(newPopUpView);
                    }
                    else
                    {
                        // set events model
                        var eventsModel = this.eventsOperationsFacade.getEventById(mainEventId);
                        if (this.currentPopUpView.eventsModel.eventId !== eventsModel.eventId)
                        {
                            var oldId = this.currentPopUpView.eventsModel.eventId;
                            this.currentPopUpView.eventsModel = eventsModel;
                            this.eventsOperationsFacade.deselectEventWithId(oldId);
                        }
                    }
                    this.currentPopUpView.focus();
                }
                else
                {
                    // event is no longer main. if it matches our current
                    // popup, then remove the popup
                    if (this.currentPopUpView && eventIds.contains(this.currentPopUpView.eventsModel.eventId))
                    {
                        // everything in eventIds is not main, so we can safely remove this main popup
                        this.removePopUpView(this.currentPopUpView, true);
                    }
                }
            });
        // when popup needs to close
        this.view.attachEventHandler(
            ReCalCommonBrowserEvents.popUpShouldClose,
            EventsPopUpView.cssSelector(), (ev: JQueryEventObject, extra: any)=>
            {
                this.eventsOperationsFacade.deselectEventWithId(extra.view.eventsModel.eventId);
                this.removePopUpView(extra.view, true);
            });
        this.view.attachEventHandler(
            ReCalCommonBrowserEvents.editablePopUpDidSave,
            EventsPopUpView.cssSelector(), (ev: JQueryEventObject, extra: { modifiedEventsModel: IEventsModel }) =>
            {
                var modifiedEventsModel = extra.modifiedEventsModel;
                this.eventsOperationsFacade.commitModifiedEvent(modifiedEventsModel);
            });
        this.view.attachEventHandler(ReCalCommonBrowserEvents.eventShouldHide,
            EventsPopUpView.cssSelector(), (ev: JQueryEventObject, extra: { view: EventsPopUpView })=>{
                this.eventsOperationsFacade.hideEventWithId(extra.view.eventsModel.eventId);
                this.removePopUpView(extra.view, true);
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
            this.removePopUpView(this.currentPopUpView, false);
        }
        this.currentPopUpView = popUpView;
        this.view.pushStackViewWithIdentifier(this.currentPopUpView,
            this.getIdentifierForPopUpView(this.currentPopUpView));
    }

    /**
     * Remove the popup from sidebar
     */
    private removePopUpView(popUpView: IEventsPopUpView, animated: boolean): void
    {
        if (this.currentPopUpView === popUpView)
        {
            this.currentPopUpView = null;
        }
        if (this.view.containsStackViewWithIdentifier(this.getIdentifierForPopUpView(popUpView)))
        {
            this.view.popStackViewWithIdentifier(this.getIdentifierForPopUpView(popUpView), animated);
        }
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
