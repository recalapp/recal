import ClickToEdit = require('../../../library/ClickToEdit/ClickToEdit');
import EditableEventsPopUpView = require('./EditableEventsPopUpView');
import EventsPopUp = require('./EventsPopUp');
import CoreUI = require('../../../library/CoreUI/CoreUI');
import UserProfiles = require('../UserProfiles/UserProfiles');

import IClickToEditViewFactory = ClickToEdit.IClickToEditViewFactory;
import IViewTemplateRetriever = CoreUI.IViewTemplateRetriever;
import IUserProfilesModel = UserProfiles.IUserProfilesModel;

class EventsPopUpViewFactory
{
    /**
     * View Template Retriever
     * @type {IViewTemplateRetriever}
     * @private
     */
    private _viewTemplateRetriever: IViewTemplateRetriever = null;
    private get viewTemplateRetriever(): IViewTemplateRetriever { return this._viewTemplateRetriever; }

    /**
     * ClickToEditView Factory
     */
    private _clickToEditViewFactory: IClickToEditViewFactory = null;
    private get clickToEditViewFactory(): IClickToEditViewFactory { return this._clickToEditViewFactory; }

    /**
     * The current logged in user, needed to get the list of sections
     * @type {IUserProfilesModel}
     * @private
     */
    private _user: IUserProfilesModel = null;
    private get user(): IUserProfilesModel { return this._user; }

    constructor(dependencies: EventsPopUp.EventsPopUpViewFactoryDependencies)
    {
        this._clickToEditViewFactory = dependencies.clickToEditViewFactory;
        this._viewTemplateRetriever = dependencies.viewTemplateRetriever;
        this._user = dependencies.user;
    }

    /**
     * Create a new events PopUp
     */
    public createEventsPopUp(): EventsPopUp.IEditableEventsPopUpView
    {
        var eventsPopUpView = new EditableEventsPopUpView(this.viewTemplateRetriever.retrieveTemplate('#popup-template'), EditableEventsPopUpView.cssClass,
            {
                clickToEditViewFactory: this.clickToEditViewFactory
            });
        eventsPopUpView.possibleSections = this.user.enrolledSectionsModels;
        eventsPopUpView.possibleEventTypes = this.user.eventTypes;
        return eventsPopUpView;
    }
}

export = EventsPopUpViewFactory;