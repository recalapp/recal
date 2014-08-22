/// <reference path="../../../typings/tsd.d.ts" />

import DateTime = require('../../../library/DateTime/DateTime');
import EncodeDecodeProxy = require('../../../library/Core/EncodeDecodeProxy');
import EventsPopUp = require('./EventsPopUp');
import PopUpView = require('../../../library/PopUp/PopUpView');
import GlobalInstancesManager = require('../GlobalInstancesManager');

import IEventsPopUpView = EventsPopUp.IEventsPopUpView;

declare function EventsMan_getEventByID(id: string): any;
declare var SECTION_MAP: any;
declare var TYPE_MAP: any;

class EventsPopUpView extends PopUpView implements IEventsPopUpView
{
    private _eventId: string = null;
    public get eventId(): string { return this._eventId; }
    public set eventId(value: string)
    {
        if (value !== this._eventId)
        {
            this._eventId = value;
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

    private _section: string = null;
    public get section(): string { return this._section; }
    public set section(value: string)
    {
        if (this._section === value)
        {
            return;
        }
        this._section = value;
        if (this._section === null || this._section === undefined)
        {
            return;
        }
        this.findJQuery('#popup-section').text(SECTION_MAP[this._section]);
    }

    private _eventType: string = null;
    public get eventType(): string { return this._eventType; }
    public set eventType(value: string)
    {
        // TODO to title case
        if (this._eventType === value)
        {
            return;
        }
        this._eventType = value;
        if (this._eventType === null || this._eventType === undefined)
        {
            return;
        }
        this.findJQuery('#popup-type').text(TYPE_MAP[this._eventType]);
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

    private refresh(): void
    {
    }
}

export = EventsPopUpView;
