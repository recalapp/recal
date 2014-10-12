import BrowserEvents = require('../../../library/Core/BrowserEvents');
import ClickToEdit = require('../../../library/ClickToEdit/ClickToEdit');
import CanvasPopUpContainer = require('./CanvasPopUpContainer');
import CoreUI = require('../../../library/CoreUI/CoreUI');
import Events = require('../../common/Events/Events');
import EventsPopUp = require('../EventsPopUp/EventsPopUp');
import EventsPopUpView = require('../EventsPopUp/EventsPopUpView');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import InvalidActionException = require('../../../library/Core/InvalidActionException');
import PopUp = require('../../../library/PopUp/PopUp');
import PopUpView = require('../../../library/PopUp/PopUpView');
import ReCalCommonBrowserEvents = require('../ReCalCommonBrowserEvents');
import UserProfiles = require('../UserProfiles/UserProfiles');
import ViewController = require('../../../library/CoreUI/ViewController');

import CanvasPopUpContainerViewControllerDependencies = CanvasPopUpContainer.CanvasPopUpContainerViewControllerDependencies
import ICanvasPopUpContainerViewController = CanvasPopUpContainer.ICanvasPopUpContainerViewController
import IClickToEditViewFactory = ClickToEdit.IClickToEditViewFactory;
import IEventsModel = Events.IEventsModel;
import IEditableEventsPopUpView = EventsPopUp.IEditableEventsPopUpView;
import IEventsOperationsFacade = Events.IEventsOperationsFacade;
import IEventsPopUpView = EventsPopUp.IEventsPopUpView;
import IPopUpView = PopUp.IPopUpView;
import IUserProfilesModel = UserProfiles.IUserProfilesModel;
import IView = CoreUI.IView;

class CanvasPopUpContainerViewController extends ViewController implements ICanvasPopUpContainerViewController
{
    /**
     * Global Browser Events Manager
     */
    private _globalBrowserEventsManager: GlobalBrowserEventsManager = null;
    private get globalBrowserEventsManager(): GlobalBrowserEventsManager { return this._globalBrowserEventsManager; }

    private _canvasView: IView = null;
    private get canvasView(): IView { return this._canvasView; }

    /**
     * ClickToEditView Factory
     */
    private _clickToEditViewFactory: IClickToEditViewFactory = null;
    private get clickToEditViewFactory(): IClickToEditViewFactory { return this._clickToEditViewFactory; }

    /**
     * Events Operations Facade
     */
    private _eventsOperationsFacade: IEventsOperationsFacade = null;
    private get eventsOperationsFacade(): IEventsOperationsFacade { return this._eventsOperationsFacade; }

    /**
     * The current logged in user, needed to get the list of sections
     * @type {IUserProfilesModel}
     * @private
     */
    private _user: IUserProfilesModel = null;
    private get user(): IUserProfilesModel { return this._user; }

    constructor(view: IView, dependencies: CanvasPopUpContainerViewControllerDependencies)
    {
        super(view);
        this._globalBrowserEventsManager = dependencies.globalBrowserEventsManager;
        this._canvasView = dependencies.canvasView;
        this._clickToEditViewFactory = dependencies.clickToEditViewFactory;
        this._eventsOperationsFacade = dependencies.eventsOperationsFacade;
        this._user = dependencies.user;
        this.initialize();
    }

    private initialize(): void
    {
        // when popup detaches from sidebar
        this.globalBrowserEventsManager.attachGlobalEventHandler(
            ReCalCommonBrowserEvents.popUpWillDetachFromSidebar,
            (ev: JQueryEventObject, extra: any) =>
            {
                var popUpView: IEditableEventsPopUpView = extra.popUpView;
                this.addPopUpView(popUpView);
                popUpView.css({
                    top: extra.boundingRect.top,
                    left: extra.boundingRect.left
                });
                popUpView.width = extra.width;
                popUpView.height = extra.height;
                popUpView.focus(); // focus must be called after the positions are set
            });

        // when popup is dropped onto sidebar
        this.canvasView.attachEventHandler(BrowserEvents.sidebarViewDidDrop,
            EventsPopUpView.cssSelector(), (ev: JQueryEventObject, extra: any) =>
            {
                var popUpView: IEditableEventsPopUpView = extra.view;
                this.removePopUpView(popUpView);
                this.canvasView.triggerEvent(
                    ReCalCommonBrowserEvents.popUpWasDroppedInSidebar,
                    {
                        popUpView: popUpView,
                    }
                );
            });
        // when popup needs to close
        this.canvasView.attachEventHandler(
            ReCalCommonBrowserEvents.popUpShouldClose,
            EventsPopUpView.cssSelector(), (ev: JQueryEventObject, extra: any)=>
            {
                if (extra.view.parentView !== this.canvasView)
                {
                    return;
                }
                // if sidebar is also a child of canvas view, we may
                // want to check where the popup actually is in DOM
                this.eventsOperationsFacade.deselectEventWithId(extra.view.eventsModel.eventId);
                this.removePopUpView(extra.view);
            });
        this.canvasView.attachEventHandler(
            ReCalCommonBrowserEvents.editablePopUpDidSave,
            EventsPopUpView.cssSelector(),
            (ev: JQueryEventObject, extra: { modifiedEventsModel: IEventsModel; view: IView }) =>
            {
                if (extra.view.parentView !== this.canvasView)
                {
                    return;
                }
                this.eventsOperationsFacade.commitModifiedEvent(extra.modifiedEventsModel);
                // in case this is a new event, in which case it would not have been selected before
                this.eventsOperationsFacade.selectEventWithId(extra.modifiedEventsModel.eventId);
            });
        this.canvasView.attachEventHandler(
            ReCalCommonBrowserEvents.eventShouldHide,
            EventsPopUpView.cssSelector(),
            (ev: JQueryEventObject, extra: { view: EventsPopUpView }) =>
            {
                if (extra.view.parentView !== this.canvasView)
                {
                    return;
                }
                this.eventsOperationsFacade.hideEventWithId(extra.view.eventsModel.eventId);
                this.eventsOperationsFacade.deselectEventWithId(extra.view.eventsModel.eventId);
                this.removePopUpView(extra.view);
            });
        this.view.attachEventHandler(ReCalCommonBrowserEvents.eventShouldUnhide,
            EventsPopUpView.cssSelector(),
            (ev: JQueryEventObject, extra: { view: IEventsPopUpView })=>
            {
                if (extra.view.parentView !== this.canvasView)
                {
                    return;
                }
                this.eventsOperationsFacade.unhideEventWithId(extra.view.eventsModel.eventId);
            });
    }

    /**
     * Add a PopUpView object to the canvas container. PopUpView object
     * must be detached from its previous parent first
     */
    private addPopUpView(popUpView: IEventsPopUpView): void
    {
        if (popUpView.parentView !== null)
        {
            throw new InvalidActionException("PopUpView must be detached before adding to container");
        }
        popUpView.addCssClass('in-canvas');
        this.canvasView.append(popUpView);
    }

    private removePopUpView(popUpView: IEventsPopUpView): void
    {
        if (popUpView.parentView !== this.canvasView)
        {
            throw new InvalidActionException('PopUpView is not in canvas to begin with');
        }
        popUpView.removeCssClass('in-canvas');
        popUpView.removeFromParent();
    }
}

export = CanvasPopUpContainerViewController;
