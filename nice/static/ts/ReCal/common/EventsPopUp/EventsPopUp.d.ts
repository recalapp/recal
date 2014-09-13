import Events = require('../Events/Events');
import PopUp = require('../../../library/PopUp/PopUp');

import IEventsModel = Events.IEventsModel;
import IPopUpView = PopUp.IPopUpView;

export interface IEventsPopUpView extends IPopUpView
{
    eventsModel: IEventsModel;
}
