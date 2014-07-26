/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import AgendaTableViewController = require('../AgendaTableViewController');
import TableView = require('../../../library/Table/TableView');

var tableView: TableView = <TableView> TableView.fromJQuery($('#agenda'));
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
