/************************************************************************
  * This class is responsible for managing the sidebar in ReCal. In particular,
  * it is responsible for listening to the following events:
  * 1. When a PopUp view is supposed to go into the sidebar.
  * 2. When a notification view is supposed to be shown.
  * 3. When a similar event is found.
  * 4. When a set of events is supposed to be show in the full sidebar view.
  **********************************************************************/

import ClickToEdit = require('../../../library/ClickToEdit/ClickToEdit');
import CoreUI = require('../../../library/CoreUI/CoreUI');
import Events = require('../../common/Events/Events');
import EventsPopUp = require('../../common/EventsPopUp/EventsPopUp');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import PopUp = require('../../../library/PopUp/PopUp');
import UserProfiles = require('../../common/UserProfiles/UserProfiles');

import IEventsOperationsFacade = Events.IEventsOperationsFacade;
import IViewController = CoreUI.IViewController;
import IPopUpView = PopUp.IPopUpView;
import IUserProfilesModel = UserProfiles.IUserProfilesModel;

export interface ReCalSidebarViewControllerDependencies
{
    eventsOperationsFacade: IEventsOperationsFacade;
    eventsPopUpViewFactory: EventsPopUp.IEventsPopUpViewFactory;
    globalBrowserEventsManager: GlobalBrowserEventsManager;
    user: IUserProfilesModel;
}

export interface IReCalSidebarViewController extends IViewController
{
}

