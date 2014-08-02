import ITableViewHeaderView = require('../../../library/Table/ITableViewHeaderView');

interface IAgendaTableViewHeaderView extends ITableViewHeaderView
{
    setTitle(text: string): void;
}

export = IAgendaTableViewHeaderView;
