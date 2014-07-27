/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');
import moment = require('moment');

import TableViewHeaderView = require('../../library/Table/TableViewHeaderView');
import ViewTemplateRetriever = require('../../library/CoreUI/ViewTemplateRetriever');

class AgendaTableViewHeaderView extends TableViewHeaderView
{
    private static _templateSelector = '#agenda-header-template';

    constructor()
    {
        super(ViewTemplateRetriever.instance().retrieveTemplate(AgendaTableViewHeaderView._templateSelector));
    }

    public setTitle(text: string): void
    {
        this._$el.find('#agenda-header-text').text(text);
    }
}

export = AgendaTableViewHeaderView;
