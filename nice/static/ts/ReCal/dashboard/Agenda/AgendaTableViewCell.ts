/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import Agenda = require('./Agenda');
import DateTime = require('../../../library/DateTime/DateTime');
import Events = require('../../common/Events/Events');
import TableViewCell = require('../../../library/Table/TableViewCell');

import IAgendaTableViewCell = Agenda.IAgendaTableViewCell;
import IEventsModel = Events.IEventsModel;

declare var SECTION_MAP: any;
declare var SECTION_COLOR_MAP: any;

class AgendaTableViewCell extends TableViewCell implements IAgendaTableViewCell
{
    public static templateSelector = '#agenda-template';
    private _eventId: string;

    public get eventId(): string
    {
        return this._eventId;
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
        this._$el.find('.agenda-item').addClass('panel-primary').removeClass('panel-default').css('border-color', courseColor);
    }

    public unhighlight(): void
    {
        var borderColor = this._$el.data('default-border-color');
        var defaultTextColor = this._$el.data('default-text-color');
        if (borderColor === undefined)
        {
        }
        this._$el.find('.agenda-item').addClass("panel-default").removeClass("panel-primary").css('border-color', borderColor);;
        this._$el.find('#agenda-section').css('color', borderColor);
        this._$el.find('#agenda-title').css('color', defaultTextColor);
        this._$el.find('#agenda-section').css('color', defaultTextColor);
    }

    public setToEvent(eventsModel: IEventsModel): void
    {
        // TODO timezone
        // TODO theme
        this._eventId = eventsModel.eventId;
        this._$el.find('.panel-body').find('h4').text(eventsModel.title);
        this._$el.find('#agenda-section').text(SECTION_MAP[eventsModel.sectionId]);

        var timeText = eventsModel.startDate.calendar();
        this._$el.find('#agenda-time').text(timeText);

        this._setColorForEvent(eventsModel);
    }
    private _setColorForEvent(eventsModel: IEventsModel): void
    {
        var agendaColorClass = 'course-color-' + eventsModel.courseId;
        var courseColor = SECTION_COLOR_MAP[eventsModel.sectionId]['color'];
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
