/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import AgendaTableViewController = require('../Agenda/AgendaTableViewController');
import TableView = require('../../../library/Table/TableView');

import ITableView = require('../../../library/Table/ITableView');

var tableView: ITableView = <TableView> TableView.fromJQuery($('#agenda'));
var agendaTableVC: AgendaTableViewController;

function Agenda_init()
{
    agendaTableVC = new AgendaTableViewController(tableView);
}
function Agenda_reload()
{
    agendaTableVC.reload();
}

(<any>window).Agenda_init = Agenda_init;
(<any>window).Agenda_reload = Agenda_reload;

Agenda_init();
