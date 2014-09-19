import CoreUI = require('../../../library/CoreUI/CoreUI');
import Events = require('../../common/Events/Events');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import Table = require('../../../library/Table/Table');

import IEventsModel = Events.IEventsModel;
import IEventsOperationsFacade = Events.IEventsOperationsFacade;
import ITableViewCell = Table.ITableViewCell;
import ITableViewHeaderView = Table.ITableViewHeaderView;
import IViewTemplateRetriever = CoreUI.IViewTemplateRetriever;

export interface AgendaTableViewControllerDependencies
{
    eventsOperationsFacade: IEventsOperationsFacade;
    globalBrowserEventsManager: GlobalBrowserEventsManager;
    viewTemplateRetriever: IViewTemplateRetriever;
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
