import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import UserProfiles = require('../../common/UserProfiles/UserProfiles');

import IUserProfilesModel = UserProfiles.IUserProfilesModel;


export interface SettingsViewControllerDependencies
{
    globalBrowserEventsManager: GlobalBrowserEventsManager;
    user: IUserProfilesModel;
}