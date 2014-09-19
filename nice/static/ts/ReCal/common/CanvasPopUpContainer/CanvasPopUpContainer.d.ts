/************************************************************************
  * This module represents the canvas for PopUps. That is, it is the place
  * where the PopUpView objects live once they have been dragged away from
  * the sidebar.
  **********************************************************************/

import CoreUI = require('../../../library/CoreUI/CoreUI');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import PopUp = require('../../../library/PopUp/PopUp');

import IViewController = CoreUI.IViewController;
import IPopUpView = PopUp.IPopUpView;

export interface CanvasPopUpContainerViewControllerDependencies
{
    globalBrowserEventsManager: GlobalBrowserEventsManager;
}

export interface ICanvasPopUpContainerViewController extends IViewController
{
}
