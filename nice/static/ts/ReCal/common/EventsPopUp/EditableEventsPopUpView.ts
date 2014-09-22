import BrowserEvents = require('../../../library/Core/BrowserEvents');
import CoreUI = require('../../../library/CoreUI/CoreUI');
import Events = require('../Events/Events');
import EventsModel = require('../Events/EventsModel');
import EventsPopUp = require('./EventsPopUp');
import EventsPopUpView = require('./EventsPopUpView');

import EventsPopUpViewDependencies = EventsPopUp.EventsPopUpViewDependencies;
import IEventsModel = Events.IEventsModel;
import IView = CoreUI.IView;

class EditableEventsPopUpView extends EventsPopUpView
{
    private _modifiedEventsModel: IEventsModel = null;
    private get modifiedEventsModel(): IEventsModel { return this._modifiedEventsModel; }
    private set modifiedEventsModel(value: IEventsModel) { this._modifiedEventsModel = value; }

    public set eventsModel(value: IEventsModel)
    {
        if (this._eventsModel !== value)
        {
            this._eventsModel = value;
            this.modifiedEventsModel = new EventsModel(this._eventsModel);
            this.refresh();
        }
    }

    constructor(dependencies: EventsPopUpViewDependencies)
    {
        super(dependencies);
        this.initialize();
    }

    private initialize(): void
    {
        this.attachEventHandler(BrowserEvents.clickToEditComplete, 
                (ev: JQueryEventObject, extra: {value: string; view: IView})=>
                {
                    var result = extra.value.trim();
                    var view = extra.view;
                    if (view.is(this.titleJQuery))
                    {
                    }
                    else if (view.is(this.descriptionJQuery))
                    {
                    }
                    else if (view.is(this.locationJQuery))
                    {
                    }
                    else if (view.is(this.sectionJQuery))
                    {
                    }
                    else if (view.is(this.eventTypeJQuery))
                    {
                    }
                    else if (view.is(this.dateJQuery))
                    {
                    }
                    else if (view.is(this.startTimeJQuery))
                    {
                    }
                    else if (view.is(this.endTimeJQuery))
                    {
                    }
                });
    }

    public refresh(): void
    {
        this.refreshWithEventsModel(this.modifiedEventsModel);
        if (this.modifiedEventsModel.title !== this.eventsModel.title)
        {
        }
        if (this.modifiedEventsModel.description !== this.eventsModel.description)
        {
        }
        if (this.modifiedEventsModel.sectionId !== this.eventsModel.sectionId)
        {
        }
        if (this.modifiedEventsModel.eventTypeCode !== this.eventsModel.eventTypeCode)
        {
        }
        if (this.modifiedEventsModel.startDate !== this.eventsModel.startDate)
        {
        }
        if (this.modifiedEventsModel.endDate !== this.eventsModel.endDate)
        {
        }
    }
}
export = EditableEventsPopUpView;
