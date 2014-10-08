import CoreUI = require('../../../library/CoreUI/CoreUI');
import Events = require('../../common/Events/Events');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import Indicators = require('../../../library/Indicators/Indicators');
import Table = require('../../../library/Table/Table');
import UserProfiles = require('../../Common/UserProfiles/UserProfiles');

import IEventsModel = Events.IEventsModel;
import IEventsOperationsFacade = Events.IEventsOperationsFacade;
import IIndicatorsManager = Indicators.IIndicatorsManager;
import ITableViewCell = Table.ITableViewCell;
import ITableViewHeaderView = Table.ITableViewHeaderView;
import IUserProfilesModel = UserProfiles.IUserProfilesModel;
import IViewTemplateRetriever = CoreUI.IViewTemplateRetriever;

export interface AgendaTableViewControllerDependencies
{
    eventsOperationsFacade: IEventsOperationsFacade;
    indicatorsManager: IIndicatorsManager;
    globalBrowserEventsManager: GlobalBrowserEventsManager;
    viewTemplateRetriever: IViewTemplateRetriever;
    user: IUserProfilesModel;
}

export interface IAgendaTableViewCell extends ITableViewCell
{
    eventId: string;

    setToEvent(eventsModel: IEventsModel): void;
}

export interface IAgendaTableViewHeaderView extends ITableViewHeaderView
{
    setTitle(text: string): void;
}
