import CoreUI = require('../../../library/CoreUI/CoreUI');
import ClickToEdit = require('../../../library/ClickToEdit/ClickToEdit');
import Events = require('../Events/Events');
import PopUp = require('../../../library/PopUp/PopUp');
import UserProfiles = require('../UserProfiles/UserProfiles');

import IEventsModel = Events.IEventsModel;
import IPopUpView = PopUp.IPopUpView;
import IUserProfilesModel = UserProfiles.IUserProfilesModel;

export interface EventsPopUpViewDependencies
{
}

export interface EditableEventsPopUpViewDependencies extends EventsPopUpViewDependencies
{
    clickToEditViewFactory: ClickToEdit.IClickToEditViewFactory;
}

export interface EventsPopUpViewFactoryDependencies
{
    viewTemplateRetriever: CoreUI.IViewTemplateRetriever;
    clickToEditViewFactory: ClickToEdit.IClickToEditViewFactory;
    user: IUserProfilesModel;
}

export interface IEventsPopUpView extends IPopUpView
{
    eventsModel: IEventsModel;
}

export interface IEventsPopUpViewFactory
{
    /**
     * Create a new events PopUp
     */
    createEventsPopUp(): IEventsPopUpView;
}
