/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');
import moment = require('moment');

import Agenda = require('./Agenda');
import TableViewHeaderView = require('../../../library/Table/TableViewHeaderView');

import IAgendaTableViewHeaderView = Agenda.IAgendaTableViewHeaderView;

class AgendaTableViewHeaderView extends TableViewHeaderView implements IAgendaTableViewHeaderView
{
    public static templateSelector = '#agenda-header-template';

    public setTitle(text: string): void
    {
        this._$el.find('#agenda-header-text').text(text);
    }
}

export = AgendaTableViewHeaderView;
