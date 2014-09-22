import CoreUI = require('../../../library/CoreUI/CoreUI');
import ClickToEdit = require('../../../library/ClickToEdit/ClickToEdit');
import Events = require('../Events/Events');
import PopUp = require('../../../library/PopUp/PopUp');

import IEventsModel = Events.IEventsModel;
import IPopUpView = PopUp.IPopUpView;

export interface EventsPopUpViewDependencies
{
    viewTemplateRetriever: CoreUI.IViewTemplateRetriever;
    clickToEditViewFactory: ClickToEdit.IClickToEditViewFactory;
}

export interface IEventsPopUpView extends IPopUpView
{
    eventsModel: IEventsModel;
}
