/************************************************************************
  * This class is responsible for managing the sidebar in ReCal. In particular,
  * it is responsible for listening to the following events:
  * 1. When a PopUp view is supposed to go into the sidebar.
  * 2. When a notification view is supposed to be shown.
  * 3. When a similar event is found.
  * 4. When a set of events is supposed to be show in the full sidebar view.
  **********************************************************************/

import CoreUI = require('../../../library/CoreUI/CoreUI');
import PopUp = require('../../../library/PopUp/PopUp');

import IViewController = CoreUI.IViewController;
import IPopUpView = PopUp.IPopUpView;

export interface IReCalSidebarViewController extends IViewController
{
    /**
      * Add a PopUpView object to the Sidebar. PopUpView object
      * must be detached from its previous parent first. If there is an
      * existing PopUpView object, it is removed first and replaced.
      */
    addPopUpView(popUpView: IPopUpView): void;
}

