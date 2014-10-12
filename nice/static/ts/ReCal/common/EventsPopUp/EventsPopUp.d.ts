import CoreUI = require('../../../library/CoreUI/CoreUI');
import ClickToEdit = require('../../../library/ClickToEdit/ClickToEdit');
import Courses = require('../Courses/Courses');
import Dictionary = require('../../../library/DataStructures/Dictionary');
import Events = require('../Events/Events');
import PopUp = require('../../../library/PopUp/PopUp');
import UserProfiles = require('../UserProfiles/UserProfiles');

import IEventsModel = Events.IEventsModel;
import IPopUpView = PopUp.IPopUpView;
import ISectionsModel = Courses.ISectionsModel;
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
    possibleSections: ISectionsModel[];
    possibleEventTypes: Dictionary<string, string>;
}

export interface IEditableEventsPopUpView extends IEventsPopUpView
{
    isModified: boolean;
}

export interface IEventsPopUpViewFactory
{
    /**
     * Create a new events PopUp
     */
    createEventsPopUp(): IEditableEventsPopUpView;
}
