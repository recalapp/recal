/************************************************************************
  * This module represents the canvas for PopUps. That is, it is the place
  * where the PopUpView objects live once they have been dragged away from
  * the sidebar.
  **********************************************************************/

import ClickToEdit = require('../../../library/ClickToEdit/ClickToEdit');
import CoreUI = require('../../../library/CoreUI/CoreUI');
import Events = require('../../common/Events/Events');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import PopUp = require('../../../library/PopUp/PopUp');

import IClickToEditViewFactory = ClickToEdit.IClickToEditViewFactory;
import IEventsOperationsFacade = Events.IEventsOperationsFacade;
import IPopUpView = PopUp.IPopUpView;
import IView = CoreUI.IView;
import IViewController = CoreUI.IViewController;

export interface CanvasPopUpContainerViewControllerDependencies
{
    clickToEditViewFactory: IClickToEditViewFactory;
    eventsOperationsFacade: IEventsOperationsFacade;
    globalBrowserEventsManager: GlobalBrowserEventsManager;
    /**
      * The actual view in which the popups are appended to. Does not have
      * to be the same view as the view managed by controller.
      */
    canvasView: IView;
}

export interface ICanvasPopUpContainerViewController extends IViewController
{
    
}
