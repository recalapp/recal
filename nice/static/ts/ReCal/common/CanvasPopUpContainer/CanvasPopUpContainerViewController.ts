import BrowserEvents = require('../../../library/Core/BrowserEvents');
import CanvasPopUpContainer = require('./CanvasPopUpContainer');
import CoreUI = require('../../../library/CoreUI/CoreUI');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import InvalidActionException = require('../../../library/Core/InvalidActionException');
import PopUp = require('../../../library/PopUp/PopUp');
import PopUpView = require('../../../library/PopUp/PopUpView');
import ReCalCommonBrowserEvents = require('../ReCalCommonBrowserEvents');
import ViewController = require('../../../library/CoreUI/ViewController');

import CanvasPopUpContainerViewControllerDependencies = CanvasPopUpContainer.CanvasPopUpContainerViewControllerDependencies
import ICanvasPopUpContainerViewController = CanvasPopUpContainer.ICanvasPopUpContainerViewController
import IPopUpView = PopUp.IPopUpView;
import IView = CoreUI.IView;

class CanvasPopUpContainerViewController extends ViewController implements ICanvasPopUpContainerViewController
{
    /**
      * Global Browser Events Manager
      */
    private _globalBrowserEventsManager: GlobalBrowserEventsManager = null;
    private get globalBrowserEventsManager(): GlobalBrowserEventsManager { return this._globalBrowserEventsManager; }

    constructor(view: IView, dependencies: CanvasPopUpContainerViewControllerDependencies)
    {
        super(view);
        this._globalBrowserEventsManager = dependencies.globalBrowserEventsManager;
        this.initialize();
    }

    private initialize(): void
    {
        // when popup detaches from sidebar
        this.globalBrowserEventsManager.attachGlobalEventHandler(
                ReCalCommonBrowserEvents.popUpWillDetachFromSidebar,
                (ev: JQueryEventObject, extra: any) => 
                {
                    this.addPopUpView(extra.popUpView);
                });

        // when popup is dropped onto sidebar
        this.view.attachEventHandler(BrowserEvents.sidebarViewDidDrop, 
                PopUpView.cssSelector(), (ev: JQueryEventObject, extra: any) => 
                {
                    var popUpView: IPopUpView = extra.view;
                    popUpView.removeFromParent();
                    this.view.triggerEvent(
                        ReCalCommonBrowserEvents.popUpWasDroppedInSidebar, 
                        {
                            popUpView: popUpView,
                        }
                    );
                });
    }

    /**
      * Add a PopUpView object to the canvas container. PopUpView object
      * must be detached from its previous parent first
      */
    public addPopUpView(popUpView: IPopUpView): void
    {
        if (popUpView.parentView !== null)
        {
            throw new InvalidActionException("PopUpView must be detached before adding to container");
        }
        this.view.append(popUpView);
    }
}

export = CanvasPopUpContainerViewController;
