/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import TableViewCell = require('../../library/Table/TableViewCell');
import ViewTemplateRetriever = require('../../library/CoreUI/ViewTemplateRetriever');

class AgendaTableViewCell extends TableViewCell
{
    private static _templateSelector = '#agenda-template';
    constructor()
    {
        super(ViewTemplateRetriever.instance().retrieveTemplate(AgendaTableViewCell._templateSelector));
    }

    public hightlight() : void
    {
        var courseColor = this._$el.data('course-color');
        this._$el.find('#agenda-section').css('color', courseColor);
        this._$el.find('#agenda-title').css('color', courseColor);
        this._$el.addClass('panel-primary').removeClass('panel-default').css('border-color', courseColor);
    }

    public unhighlight() : void
    {
        var borderColor = this._$el.data('default-border-color');
        var defaultTextColor = this._$el.data('default-text-color');
        this._$el.addClass("panel-default").removeClass("panel-primary").css('border-color', borderColor);;
        this._$el.find('#agenda-section').css('color', borderColor);
        this._$el.find('#agenda-title').css('color', defaultTextColor);
        this._$el.find('#agenda-section').css('color', defaultTextColor);
    }
}

export = AgendaTableViewCell;
