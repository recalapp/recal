import Events = require('../../common/Events/Events');

import IEventsOperationsFacade = Events.IEventsOperationsFacade;
export interface DashboardCalendarViewControllerDependencies
{
    eventsOperationsFacade: IEventsOperationsFacade;
}
