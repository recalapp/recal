/// <reference path="../../../typings/tsd.d.ts" />

import DateTime = require('../../../library/DateTime/DateTime');
import EncodeDecodeProxy = require('../../../library/Core/EncodeDecodeProxy');
import Events = require('../Events/Events');
import EventsPopUp = require('./EventsPopUp');
import PopUpView = require('../../../library/PopUp/PopUpView');
import GlobalInstancesManager = require('../GlobalInstancesManager');

import IEventsModel = Events.IEventsModel;
import IEventsPopUpView = EventsPopUp.IEventsPopUpView;

declare function EventsMan_getEventByID(id: string): any;
declare var SECTION_MAP: any;
declare var TYPE_MAP: any;

class EventsPopUpView extends PopUpView implements IEventsPopUpView
{
    private _eventsModel: IEventsModel = null;
    public get eventsModel(): IEventsModel { return this._eventsModel; }
    public set eventsModel(value: IEventsModel) 
    {
        if (this._eventsModel !== value)
        {
            this._eventsModel = value; 
            this.refresh();
        }
    }

    private _title: string = null;
    public get title(): string { return this._title; }
    public set title(value: string)
    {
        if (this._title === value)
        {
            return;
        }
        this._title = value;
        if (this._title === null || this._title === undefined)
        {
            return;
        }
        this.findJQuery('#popup-title').text(this._title);
    }

    private _description: string = null;
    public get description(): string { return this._description; }
    public set description(value: string)
    {
        if (this._description === value)
        {
            return;
        }
        this._description = value;
        if (this._description === null || this._description === undefined)
        {
            return;
        }
        var proxy = EncodeDecodeProxy.instance;
        this.findJQuery('#popup-desc').html(proxy.newLinesToBr(proxy.htmlEncode(this._description)));
    }

    private _location: string = null;
    public get location(): string { return this._location; }
    public set location(value: string)
    {
        if (this._location === value)
        {
            return;
        }
        this._location = value;
        if (this._location === null || this._location === undefined)
        {
            return;
        }
        this.findJQuery('#popup-loc').text(this._location);
    }

    private _sectionId: string = null;
    public get sectionId(): string { return this._sectionId; }
    public set sectionId(value: string)
    {
        if (this._sectionId === value)
        {
            return;
        }
        this._sectionId = value;
        if (this._sectionId === null || this._sectionId === undefined)
        {
            return;
        }
        this.findJQuery('#popup-section').text(SECTION_MAP[this._sectionId]);
    }

    private _eventTypeCode: string = null;
    public get eventTypeCode(): string { return this._eventTypeCode; }
    public set eventTypeCode(value: string)
    {
        // TODO to title case
        if (this._eventTypeCode === value)
        {
            return;
        }
        this._eventTypeCode = value;
        if (this._eventTypeCode === null || this._eventTypeCode === undefined)
        {
            return;
        }
        this.findJQuery('#popup-type').text(TYPE_MAP[this._eventTypeCode]);
    }

    private _startDate: DateTime = null;
    public get startDate(): DateTime { return this._startDate; }
    public set startDate(value: DateTime)
    {
        if (this._startDate && this._startDate.equals(value))
        {
            return;
        }
        this._startDate = value;
        if (this._startDate === null || this._startDate === undefined)
        {
            return;
        }
        this.findJQuery('#popup-date').text(this._startDate.format('MMMM D, YYYY'));
        this.findJQuery('#popup-time-start').text(this._startDate.format('h:mm A'));
    }

    private _endDate: DateTime = null;
    public get endDate(): DateTime { return this._endDate; }
    public set endDate(value: DateTime)
    {
        if (this._endDate && this._endDate.equals(value))
        {
            return;
        }
        this._endDate = value;
        if (this._endDate === null || this._endDate === undefined)
        {
            return;
        }
        this.findJQuery('#popup-time-end').text(this._endDate.format('h:mm A'));
    }

    private _lastEdited: DateTime = null;
    public get lastEdited(): DateTime { return this._lastEdited; }
    public set lastEdited(value: DateTime)
    {
        if (this._lastEdited && this._lastEdited.equals(value))
        {
            return;
        }
        this._lastEdited = value;
        if (this._lastEdited === null || this._lastEdited === undefined)
        {
            return;
        }
        this.findJQuery('#popup-last-edited-time').text(this._lastEdited.format('MM/DD/YYYY'));
    }


    public static get cssClass(): string
    {
        return PopUpView.cssClass + ' eventsPopUpView';
    }

    constructor()
    {
        super(GlobalInstancesManager.instance.viewTemplateRetriever.retrieveTemplate('#popup-template'), EventsPopUpView.cssClass);

        // TODO set up buttons 
    }

    // can be overridden in subclasses
    public refresh(): void
    {
        if (this.eventsModel === null || this.eventsModel === undefined)
        {
            return;
        }

        this.title = this.eventsModel.title;
        this.description = this.eventsModel.description;
        this.sectionId = this.eventsModel.sectionId;
        this.eventTypeCode = this.eventsModel.eventTypeCode;
        this.startDate = this.eventsModel.startDate;
        this.endDate = this.eventsModel.endDate;
        this.lastEdited = this.eventsModel.lastEdited;
    }
}

export = EventsPopUpView;
