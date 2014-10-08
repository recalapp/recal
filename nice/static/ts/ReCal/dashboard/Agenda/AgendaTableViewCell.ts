/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import Agenda = require('./Agenda');
import Color = require('../../../library/Color/Color');
import Courses = require('../../common/Courses/Courses');
import DateTime = require('../../../library/DateTime/DateTime');
import Events = require('../../common/Events/Events');
import TableViewCell = require('../../../library/Table/TableViewCell');

import IAgendaTableViewCell = Agenda.IAgendaTableViewCell;
import IEventsModel = Events.IEventsModel;
import ISectionsModel = Courses.ISectionsModel;

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
            this._color = this.defaultBorderColor;
        }
        return this._color;
    }
    private set color(value: Color) { this._color = value; }

    private _eventId: string = null;
    public get eventId(): string
    {
        return this._eventId;
    }

    public _possibleSections: ISectionsModel[] = [];
    public get possibleSections(): ISectionsModel[] { return this._possibleSections; }
    public set possibleSections(value: ISectionsModel[]) { this._possibleSections = value; }

    public highlight(): void
    {
        this.findJQuery('.agenda-item').addClass('panel-primary').removeClass('panel-default');
        this.updateColor();
    }

    public unhighlight(): void
    {
        this.findJQuery('.agenda-item').addClass("panel-default").removeClass("panel-primary");
        this.updateColor();
    }

    private updateColor(): void
    {
        if (this.selected)
        {
            this.findJQuery('#agenda-section').css('color',
                this.color.hexValue);
            this.findJQuery('#agenda-title').css('color', this.color.hexValue);
            this.findJQuery('.agenda-item').css('border-color',
                this.color.hexValue);
        }
        else
        {
            this.findJQuery('#agenda-section').css('color',
                this.defaultTextColor.hexValue);
            this.findJQuery('#agenda-title').css('color', this.defaultTextColor.hexValue);
            this.findJQuery('.agenda-item').css('border-color',
                this.defaultBorderColor.hexValue);
        }
        this.findJQuery('.agenda-tag').css('background-color', this.color.hexValue);
    }

    public setToEvent(eventsModel: IEventsModel): void
    {
        this._eventId = eventsModel.eventId;
        this._$el.find('.panel-body').find('h4').text(eventsModel.title);
        var sections = this.possibleSections.filter((sectionsModel: ISectionsModel)=>{
            return sectionsModel.sectionId === eventsModel.sectionId;
        });
        if (sections.length > 0)
        {
            this._$el.find('#agenda-section').text(
                    sections[0].coursesModel.primaryListing +
                    ' - ' + sections[0].title);
        }
        var timeText = eventsModel.startDate.calendar();
        this._$el.find('#agenda-time').text(timeText);
        this.color = eventsModel.sectionColor;
        this.updateColor();
    }
}

export = AgendaTableViewCell;
