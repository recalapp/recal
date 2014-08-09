import Table = require('../../../library/Table/Table');

import ITableViewCell = Table.ITableViewCell;
import ITableViewHeaderView = Table.ITableViewHeaderView;

export interface IAgendaTableViewCell extends ITableViewCell
{
    eventId: number;

    setToEvent(eventDict: any): void;
}

export interface IAgendaTableViewHeaderView extends ITableViewHeaderView
{
    setTitle(text: string): void;
}
