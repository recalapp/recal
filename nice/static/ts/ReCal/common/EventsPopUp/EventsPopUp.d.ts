import PopUp = require('../../../library/PopUp/PopUp');

import IPopUpView = PopUp.IPopUpView;

export interface IEventsPopUpView extends IPopUpView
{
    eventId: string;
}
