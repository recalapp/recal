import Events = require('../../common/Events/Events');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import UserProfiles = require('../../common/UserProfiles/UserProfiles');

import IEventsOperationsFacade = Events.IEventsOperationsFacade;
import IUserProfilesModel = UserProfiles.IUserProfilesModel;

export interface SettingsViewControllerDependencies
{
    eventsOperationsFacade: IEventsOperationsFacade;
    globalBrowserEventsManager: GlobalBrowserEventsManager;
    user: IUserProfilesModel;
}