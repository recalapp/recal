/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');
import moment = require('moment');

import TableViewCell = require('../../library/Table/TableViewCell');
import ViewTemplateRetriever = require('../../library/CoreUI/ViewTemplateRetriever');

declare var SECTION_MAP: any;
declare var SECTION_COLOR_MAP: any;

class AgendaTableViewCell extends TableViewCell
{
    private static _templateSelector = '#agenda-template';
    private _eventId: number;

    public get eventId(): number
    {
        return this._eventId;
    }

    constructor()
    {
        super(ViewTemplateRetriever.instance().retrieveTemplate(AgendaTableViewCell._templateSelector));
    }

    public highlight(): void
    {
        var courseColor = this._$el.data('course-color');
        if (courseColor === undefined)
        {
            courseColor = "#000000";
        }
        this._$el.find('#agenda-section').css('color', courseColor);
        this._$el.find('#agenda-title').css('color', courseColor);
        this._$el.addClass('panel-primary').removeClass('panel-default').css('border-color', courseColor);
    }

    public unhighlight(): void
    {
        var borderColor = this._$el.data('default-border-color');
        var defaultTextColor = this._$el.data('default-text-color');
        if (borderColor === undefined)
        {
        }
        this._$el.addClass("panel-default").removeClass("panel-primary").css('border-color', borderColor);;
        this._$el.find('#agenda-section').css('color', borderColor);
        this._$el.find('#agenda-title').css('color', defaultTextColor);
        this._$el.find('#agenda-section').css('color', defaultTextColor);
    }

    public setToEvent(eventDict: any): void
    {
        // TODO timezone
        // TODO theme
        this._eventId = eventDict.event_id;
        this._$el.find('.panel-body').find('h4').text(eventDict.event_title);
        this._$el.find('#agenda-section').text(SECTION_MAP[eventDict.section_id]);

        var start = moment.unix(eventDict.event_start);
        var timeText = start.calendar();
        this._$el.find('#agenda-time').text(timeText);

        this._setColorForEvent(eventDict);
    }
    private _setColorForEvent(eventDict: any): void
    {
        var agendaColorClass = 'course-color-' + eventDict.course_id;
        var courseColor = SECTION_COLOR_MAP[eventDict.section_id]['color'];
        this._$el.find('.agenda-tag').addClass(agendaColorClass).css('background-color', courseColor);
        this._$el.data('course-color', courseColor);

        var oldColor = this._$el.css('border-color');
        this._$el.data('default-border-color', oldColor);

        // TODO theme
        var darkerColor = 'rgba(0,0,0,0.4)';

        this._$el.data('default-text-color', darkerColor);
        this._$el.find('#agenda-section').addClass(agendaColorClass).css('color', darkerColor);
        this._$el.find('#agenda-title').addClass(agendaColorClass).css('color', darkerColor);
        // TODO special case for hidden events
    }
}

export = AgendaTableViewCell;
