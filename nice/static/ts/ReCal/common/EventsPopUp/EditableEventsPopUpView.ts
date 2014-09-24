import BrowserEvents = require('../../../library/Core/BrowserEvents');
import ClickToEdit = require('../../../library/ClickToEdit/ClickToEdit');
import ComparableResult = require('../../../library/Core/ComparableResult');
import CoreUI = require('../../../library/CoreUI/CoreUI');
import Events = require('../Events/Events');
import EventsModel = require('../Events/EventsModel');
import EventsPopUp = require('./EventsPopUp');
import EventsPopUpView = require('./EventsPopUpView');

import EditableEventsPopUpViewDependencies = EventsPopUp.EditableEventsPopUpViewDependencies;
import IClickToEditViewFactory = ClickToEdit.IClickToEditViewFactory;
import IClickToEditView = ClickToEdit.IClickToEditView;
import IEventsModel = Events.IEventsModel;
import IView = CoreUI.IView;

class EditableEventsPopUpView extends EventsPopUpView
{
    private HIGHLIGHTED_CLASS = 'highlighted';

    private _modifiedEventsModel: IEventsModel = null;
    private get modifiedEventsModel(): IEventsModel { return this._modifiedEventsModel; }
    private set modifiedEventsModel(value: IEventsModel) { this._modifiedEventsModel = value; }

    private _clickToEditViewFactory: IClickToEditViewFactory = null;
    private get clickToEditViewFactory(): IClickToEditViewFactory { return this._clickToEditViewFactory; }
    
    // if overwrite set, must also overwrite get
    public get eventsModel(): IEventsModel { return this._eventsModel; }
    public set eventsModel(value: IEventsModel)
    {
        if (this._eventsModel !== value)
        {
            this._eventsModel = value;
            this.modifiedEventsModel = new EventsModel(this._eventsModel);
            this.refresh();
        }
    }

    constructor(dependencies: EditableEventsPopUpViewDependencies)
    {
        super(dependencies);
        this._clickToEditViewFactory = dependencies.clickToEditViewFactory;
        this.initialize();
    }

    private initialize(): void
    {
        // initialize click to edit
        this.findJQuery('.clickToEdit').each(
                (index: number, element: Element)=>
                {
                    var $element = $(element);
                    var clickToEditView = <IClickToEditView> this.clickToEditViewFactory.createFromJQuery($element);
                });

        // add event handler for click to edit
        this.attachEventHandler(BrowserEvents.clickToEditComplete, 
                (ev: JQueryEventObject, extra: {value: string; view: IView})=>
                {
                    var result = extra.value.trim();
                    var view = extra.view;
                    if (view.is(this.titleJQuery))
                    {
                        this.modifiedEventsModel.title = result;
                    }
                    else if (view.is(this.descriptionJQuery))
                    {
                        this.modifiedEventsModel.description = result;
                    }
                    else if (view.is(this.locationJQuery))
                    {
                        this.modifiedEventsModel.location = result;
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
                    this.refresh();
                });
    }

    public refresh(): void
    {
        this.refreshWithEventsModel(this.modifiedEventsModel);
        if (this.modifiedEventsModel.title !== this.eventsModel.title)
        {
            this.titleJQuery.addClass(this.HIGHLIGHTED_CLASS);
        }
        else
        {
            this.titleJQuery.removeClass(this.HIGHLIGHTED_CLASS);
        }
        if (this.modifiedEventsModel.description !== this.eventsModel.description)
        {
            this.descriptionJQuery.addClass(this.HIGHLIGHTED_CLASS);
        }
        else
        {
            this.descriptionJQuery.removeClass(this.HIGHLIGHTED_CLASS);
        }
        if (this.modifiedEventsModel.location !== this.eventsModel.location)
        {
            this.locationJQuery.addClass(this.HIGHLIGHTED_CLASS);
        }
        else
        {
            this.locationJQuery.removeClass(this.HIGHLIGHTED_CLASS);
        }
        if (this.modifiedEventsModel.sectionId !== this.eventsModel.sectionId)
        {
            this.sectionJQuery.addClass(this.HIGHLIGHTED_CLASS);
        }
        else
        {
            this.sectionJQuery.removeClass(this.HIGHLIGHTED_CLASS);
        }
        if (this.modifiedEventsModel.eventTypeCode !== this.eventsModel.eventTypeCode)
        {
            this.eventTypeJQuery.addClass(this.HIGHLIGHTED_CLASS);
        }
        else
        {
            this.eventTypeJQuery.removeClass(this.HIGHLIGHTED_CLASS);
        }
        if (this.modifiedEventsModel.startDate.compareTo(this.eventsModel.startDate) !== ComparableResult.equal)
        {
        }
        else
        {
        }
        if (this.modifiedEventsModel.endDate.compareTo(this.eventsModel.endDate) !== ComparableResult.equal)
        {
        }
        else
        {
        }
    }


}
export = EditableEventsPopUpView;
