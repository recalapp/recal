import CoreUI = require('../../../library/CoreUI/CoreUI');
import Events = require('../Events/Events');
import PopUp = require('../../../library/PopUp/PopUp');

import IEventsModel = Events.IEventsModel;
import IPopUpView = PopUp.IPopUpView;

export interface EventsPopUpViewDependencies
{
    viewTemplateRetriever: CoreUI.IViewTemplateRetriever
}

export interface IEventsPopUpView extends IPopUpView
{
    eventsModel: IEventsModel;
}
