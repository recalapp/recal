/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import Agenda = require('./Agenda');
import Color = require('../../../library/Color/Color');
import DateTime = require('../../../library/DateTime/DateTime');
import Events = require('../../common/Events/Events');
import TableViewCell = require('../../../library/Table/TableViewCell');

import IAgendaTableViewCell = Agenda.IAgendaTableViewCell;
import IEventsModel = Events.IEventsModel;

declare var SECTION_MAP: any;
declare var SECTION_COLOR_MAP: any;

class AgendaTableViewCell extends TableViewCell implements IAgendaTableViewCell
{
    private _defaultBorderColor: Color = null;
    private get defaultBorderColor(): Color
    {
        if (!this._defaultBorderColor)
        {
            this._defaultBorderColor = Color.fromHex("#ddd");
        }
        return this._defaultBorderColor;
    }

    private _defaultTextColor: Color = null;
    private get defaultTextColor(): Color
    {
        if (!this._defaultTextColor)
        {
            this._defaultTextColor = Color.fromHex("#666");
        }
        return this._defaultTextColor;
    }

    public static templateSelector = '#agenda-template';

    private _color: Color = null;
    private get color(): Color
    {
        if (!this._color)
        {
            this._color = this._defaultBorderColor;
        }
        return this._color;
    }
    private set color(value: Color) { this._color = value; }

    private _eventId: string = null;
    public get eventId(): string
    {
        return this._eventId;
    }

    public highlight(): void
    {
        this._$el.find('#agenda-section').css('color', this.color.hexValue);
        this._$el.find('#agenda-title').css('color', this.color.hexValue);
        this._$el.find('.agenda-item').addClass('panel-primary').removeClass('panel-default').css('border-color',
            this.color.hexValue);
    }

    public unhighlight(): void
    {
        this._$el.find('.agenda-item').addClass("panel-default").removeClass("panel-primary").css('border-color',
            this.defaultBorderColor.hexValue);
        ;
        this._$el.find('#agenda-section').css('color', this.defaultBorderColor.hexValue);
        this._$el.find('#agenda-title').css('color', this.defaultTextColor.hexValue);
        this._$el.find('#agenda-section').css('color', this.defaultTextColor.hexValue);
    }

    public setToEvent(eventsModel: IEventsModel): void
    {
        this._eventId = eventsModel.eventId;
        this._$el.find('.panel-body').find('h4').text(eventsModel.title);
        this._$el.find('#agenda-section').text(SECTION_MAP[eventsModel.sectionId]);

        var timeText = eventsModel.startDate.calendar();
        this._$el.find('#agenda-time').text(timeText);
    }
}

export = AgendaTableViewCell;
