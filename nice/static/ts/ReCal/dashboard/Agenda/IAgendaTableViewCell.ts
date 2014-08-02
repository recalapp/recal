/// <reference path="../../../typings/tsd.d.ts" />

import ITableViewCell = require('../../../library/Table/ITableViewCell');

interface IAgendaTableViewCell extends ITableViewCell
{
    eventId: number;

    setToEvent(eventDict: any): void;
}

export = IAgendaTableViewCell;
