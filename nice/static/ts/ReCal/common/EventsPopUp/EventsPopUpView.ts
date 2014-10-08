/// <reference path="../../../typings/tsd.d.ts" />

import BrowserEvents = require('../../../library/Core/BrowserEvents');
import CoreUI = require('../../../library/CoreUI/CoreUI');
import Courses = require('../Courses/Courses');
import DateTime = require('../../../library/DateTime/DateTime');
import Dictionary = require('../../../library/DataStructures/Dictionary');
import EncodeDecodeProxy = require('../../../library/Core/EncodeDecodeProxy');
import Events = require('../Events/Events');
import EventsPopUp = require('./EventsPopUp');
import FocusableView = require('../../../library/CoreUI/FocusableView');
import PopUpView = require('../../../library/PopUp/PopUpView');
import ReCalCommonBrowserEvents = require('../ReCalCommonBrowserEvents');

import EventsPopUpViewDependencies = EventsPopUp.EventsPopUpViewDependencies;
import IEventsModel = Events.IEventsModel;
import IEventsPopUpView = EventsPopUp.IEventsPopUpView;
import ISectionsModel = Courses.ISectionsModel;

class EventsPopUpView extends PopUpView implements IEventsPopUpView
{
    private _encodeDecodeProxy: EncodeDecodeProxy = new EncodeDecodeProxy();
    private get encodeDecodeProxy(): EncodeDecodeProxy { return this._encodeDecodeProxy; }

    public _possibleSections: ISectionsModel[] = [];
    public get possibleSections(): ISectionsModel[] { return this._possibleSections; }
    public set possibleSections(value: ISectionsModel[]) { this._possibleSections = value; }

    public _possibleEventTypes: Dictionary<string, string> = new Dictionary<string, string>();
    public get possibleEventTypes(): Dictionary<string, string> { return this._possibleEventTypes; }
    public set possibleEventTypes(value: Dictionary<string, string>) { this._possibleEventTypes = value; }

    public _eventsModel: IEventsModel = null;
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
        this.titleJQuery.text(this._title);
    }
    private _titleJQuery: JQuery = null;
    public get titleJQuery(): JQuery 
    {
        if (!this._titleJQuery)
        {
            this._titleJQuery = this.findJQuery('#popup-title');
        }
        return this._titleJQuery;
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
        this.descriptionJQuery.html(this.encodeDecodeProxy.newLinesToBr(this.encodeDecodeProxy.htmlEncode(this._description)));
    }
    private _descriptionJQuery: JQuery = null;
    public get descriptionJQuery(): JQuery
    {
        if (!this._descriptionJQuery)
        {
            this._descriptionJQuery = this.findJQuery('#popup-desc');
        }
        return this._descriptionJQuery;
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
        this.locationJQuery.text(this._location);
    }
    private _locationJQuery: JQuery = null;
    public get locationJQuery(): JQuery
    {
        if (!this._locationJQuery)
        {
            this._locationJQuery = this.findJQuery('#popup-loc');
        }
        return this._locationJQuery;
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
        // TODO improve logic. this assumes possibleSections already set
        var sections = this.possibleSections.filter((sectionsModel: ISectionsModel)=>{
            return sectionsModel.sectionId === this._sectionId;
        });
        if (sections.length > 0)
        {
            var section = sections[0];
            this.sectionJQuery.text(section.coursesModel.primaryListing + " - "
                + section.title);
            this.sectionJQuery.data("logical_value", section.sectionId);
        }
    }
    private _sectionJQuery: JQuery = null;
    public get sectionJQuery(): JQuery
    {
        if (!this._sectionJQuery)
        {
            this._sectionJQuery = this.findJQuery('#popup-section');
        }
        return this._sectionJQuery
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
        this.eventTypeJQuery.text(this.possibleEventTypes.getOrCreate(this._eventTypeCode, this._eventTypeCode));
        this.eventTypeJQuery.data('logical_value', this._eventTypeCode);
    }
    private _eventTypeJQuery: JQuery = null;
    public get eventTypeJQuery(): JQuery 
    {
        if (!this._eventTypeJQuery)
        {
            this._eventTypeJQuery = this.findJQuery('#popup-type');
        }
        return this._eventTypeJQuery;
    }

    private _startDate: DateTime = null;
    public get startDate(): DateTime { return this._startDate; }
    public set startDate(value: DateTime)
    {
        if (this._startDate && this._startDate.equals(value))
        {
            return;
        }
        this._startDate = new DateTime(value);
        if (this._startDate === null || this._startDate === undefined)
        {
            return;
        }
        this.dateJQuery.text(this._startDate.format('MMMM D, YYYY'));
        this.dateJQuery.data('logical_value', this._startDate);
        this.startTimeJQuery.text(this._startDate.format('h:mm A'));
        this.startTimeJQuery.data('logical_value', this._startDate);
    }
    private _dateJQuery: JQuery = null;
    public get dateJQuery(): JQuery 
    {
        if (!this._dateJQuery)
        {
            this._dateJQuery = this.findJQuery('#popup-date');
        }
        return this._dateJQuery;
    }
    private _startTimeJQuery: JQuery = null;
    public get startTimeJQuery(): JQuery
    {
        if (!this._startTimeJQuery)
        {
            this._startTimeJQuery = this.findJQuery('#popup-time-start');
        }
        return this._startTimeJQuery;
    }

    private _endDate: DateTime = null;
    public get endDate(): DateTime { return this._endDate; }
    public set endDate(value: DateTime)
    {
        if (this._endDate && this._endDate.equals(value))
        {
            return;
        }
        this._endDate = new DateTime(value);
        if (this._endDate === null || this._endDate === undefined)
        {
            return;
        }
        this.endTimeJQuery.text(this._endDate.format('h:mm A'));
        this.endTimeJQuery.data('logical_value', this._endDate);
    }
    private _endTimeJQuery: JQuery = null;
    public get endTimeJQuery(): JQuery 
    {
        if (!this._endTimeJQuery)
        {
            this._endTimeJQuery = this.findJQuery('#popup-time-end');
        }
        return this._endTimeJQuery;
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
        this.lastEditedJQuery.text(this._lastEdited.format('MM/DD/YYYY'));
    }
    private _lastEditedJQuery: JQuery = null;
    public get lastEditedJQuery(): JQuery
    {
        if (!this._lastEditedJQuery)
        {
            this._lastEditedJQuery = this.findJQuery('#popup-last-edited-time');
        }
        return this._lastEditedJQuery;
    }

    public static get cssClass(): string
    {
        return PopUpView.cssClass + ' eventsPopUpView';
    }

    private _closeButton: FocusableView = null;
    public get closeButton(): FocusableView { return this._closeButton; }

    private _hideButton: FocusableView = null;
    public get hideButton(): FocusableView { return this._hideButton; }

    constructor($element: JQuery, cssClass: string)
    {
        super($element, cssClass);

        // TODO set up buttons 
        // set up close button
        this._closeButton = <FocusableView> FocusableView.fromJQuery(this.findJQuery('#close-button'));
        this.closeButton.attachEventHandler(BrowserEvents.click, (ev: JQueryEventObject)=>{
            ev.preventDefault(); // prevent from going to recal.io/#, which goes to the top of the page
            // lambda forces a context change
            this.handleCloseButtonClick(ev);
        });

        // set up hide button
        this._hideButton = <FocusableView> FocusableView.fromJQuery(this.findJQuery('#hide-button'));
        this.hideButton.attachEventHandler(BrowserEvents.click, (ev: JQueryEventObject)=>{
            ev.preventDefault(); // prevent from going to recal.io/#

            this.handleHideButtonClick(ev);
        })
    }

    public handleCloseButtonClick(ev: JQueryEventObject)
    {
        this.triggerEvent(ReCalCommonBrowserEvents.popUpShouldClose);
    }

    public handleHideButtonClick(ev: JQueryEventObject)
    {
        this.triggerEvent(ReCalCommonBrowserEvents.eventShouldHide);
    }

    public refresh(): void
    {
        this.refreshWithEventsModel(this.eventsModel);
    }

    // can be overridden in subclasses
    public refreshWithEventsModel(eventsModel: IEventsModel): void
    {
        if (eventsModel === null || eventsModel === undefined)
        {
            return;
        }

        this.title = eventsModel.title;
        this.location = eventsModel.location;
        this.description = eventsModel.description;
        this.sectionId = eventsModel.sectionId;
        this.eventTypeCode = eventsModel.eventTypeCode;
        this.startDate = eventsModel.startDate;
        this.endDate = eventsModel.endDate;
        this.lastEdited = eventsModel.lastEdited;
        this.color = eventsModel.sectionColor;
    }
}

export = EventsPopUpView;
