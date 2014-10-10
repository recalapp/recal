/// <reference path="../../../typings/tsd.d.ts" />

import BrowserEvents = require('../../../library/Core/BrowserEvents');
import Courses = require('../../common/Courses/Courses');
import Dictionary = require('../../../library/DataStructures/Dictionary');
import SegmentedControlMultipleSelectView = require('../../../library/SegmentedControl/SegmentedControlMultipleSelectView');
import SegmentedControlSingleSelectView = require('../../../library/SegmentedControl/SegmentedControlSingleSelectView');
import Set = require('../../../library/DataStructures/Set');
import View = require('../../../library/CoreUI/View');

import ICoursesModel = Courses.ICoursesModel;

class SettingsView extends View
{
    /***************************************************************************
     * Settings options
     **************************************************************************/
    private _possibleEventTypes: Dictionary<string, string> = null;
    public get possibleEventTypes(): Dictionary<string, string>
    {
        if (!this._possibleEventTypes)
        {
            this._possibleEventTypes = new Dictionary<string, string>();
        }
        return this._possibleEventTypes;
    }
    public set possibleEventTypes(value: Dictionary<string, string>)
    {
        if (value === null || value === undefined)
        {
            value = new Dictionary<string, string>();
        }
        this._possibleEventTypes = value;
        this.renderAgendaOptionsView();
        this.renderCalendarOptionsView();
    }

    private _agendaSelectedEventTypes: Set<string> = null;
    private get agendaSelectedEventTypesSet(): Set<string>
    {
        if (!this._agendaSelectedEventTypes)
        {
            this._agendaSelectedEventTypes = new Set<string>();
        }
        return this._agendaSelectedEventTypes;
    }
    public get agendaSelectedEventTypes(): string[]
    { return this.agendaSelectedEventTypesSet.toArray(); }
    public set agendaSelectedEventTypes(value: string[])
    {
        if (value === null || value === undefined)
        {
            value = [];
        }
        this._agendaSelectedEventTypes = new Set<string>(value);
        this.renderAgendaOptionsView();
    }

    private _calendarSelectedEventTypes: Set<string> = null;
    private get calendarSelectedEventTypesSet(): Set<string>
    {
        if (!this._calendarSelectedEventTypes)
        {
            this._calendarSelectedEventTypes = new Set<string>();
        }
        return this._calendarSelectedEventTypes;
    }
    public get calendarSelectedEventTypes(): string[]
    {
        return this.calendarSelectedEventTypesSet.toArray();
    }
    public set calendarSelectedEventTypes(value: string[])
    {
        if (value === null || value === undefined)
        {
            value = [];
        }
        this._calendarSelectedEventTypes = new Set<string>(value);
        this.renderCalendarOptionsView();
    }

    private _eventsHidden = false;
    public get eventsHidden(): boolean { return this._eventsHidden; }
    public set eventsHidden(value: boolean) { this._eventsHidden = value; this.renderEventsVisibilityOptions(); }

    private _isLocalTimezone = false;
    public get isLocalTimezone(): boolean { return this._isLocalTimezone; }
    public set isLocalTimezone(value: boolean)
    {
        value = value || false;
        this._isLocalTimezone = value;
    }

    private _possibleCourses: Set<ICoursesModel> = null;
    public get possibleCourses(): ICoursesModel[]
    {
        if (!this._possibleCourses)
        {
            this._possibleCourses = new Set<ICoursesModel>();
        }
        return this._possibleCourses.toArray();
    }
    public set possibleCourses(value: ICoursesModel[])
    {
        value = value || [];
        this._possibleCourses = new Set<ICoursesModel>(value);
        this.renderCourseOptionsView();
    }

    private _visibleCourses: Set<ICoursesModel> = null;
    private get visibleCoursesSet(): Set<ICoursesModel>
    {
        if (!this._visibleCourses)
        {
            this._visibleCourses = new Set<ICoursesModel>();
        }
        return this._visibleCourses;
    }
    public get visibleCourses(): ICoursesModel[]
    {
        return this.visibleCoursesSet.toArray();
    }
    public set visibleCourses(value: ICoursesModel[])
    {
        value = value || [];
        this._visibleCourses = new Set<ICoursesModel>(value);
        this.renderCourseOptionsView();
    }

    /***************************************************************************
     * Subviews
     **************************************************************************/
    private _agendaOptionsView: View = null;
    private get agendaOptionsView(): View
    {
        if (!this._agendaOptionsView)
        {
            this._agendaOptionsView = View.fromJQuery(this.findJQuery('#agenda-options'))
        }
        return this._agendaOptionsView;
    }

    private _calendarOptionsView: View = null;
    private get calendarOptionsView(): View
    {
        if (!this._calendarOptionsView)
        {
            this._calendarOptionsView = View.fromJQuery(this.findJQuery('#calendar-options'));
        }
        return this._calendarOptionsView;
    }

    private _timezoneOptionsView: View = null;
    private get timezoneOptionsView(): View
    {
        if (!this._timezoneOptionsView)
        {
            this._timezoneOptionsView = View.fromJQuery(this.findJQuery('#timezone-options'));
        }
        return this._timezoneOptionsView;
    }

    private _courseOptionsView: View = null;
    private get courseOptionsView(): View
    {
        if (!this._courseOptionsView)
        {
            this._courseOptionsView = View.fromJQuery(this.findJQuery('#course-options'));
        }
        return this._courseOptionsView;
    }

    private _eventsVisibilityOptionsView: View = null;
    private get eventsVisibilityOptionsView(): View
    {
        if (!this._eventsVisibilityOptionsView)
        {
            this._eventsVisibilityOptionsView = View.fromJQuery(this.findJQuery('#hidden-options'));
        }
        return this._eventsVisibilityOptionsView;
    }

    /***************************************************************************
     * Methods
     **************************************************************************/
    constructor($element: JQuery, cssClass: string)
    {
        super($element, cssClass);
        this.render();
    }

    private render(): void
    {
        this.renderCourseOptionsView();
        this.renderEventsVisibilityOptions();
        this.renderAgendaOptionsView();
        this.renderCalendarOptionsView();
        this.renderTimezoneOptionsView();
    }


    private renderTimezoneOptionsView()
    {
        this.timezoneOptionsView.removeAllChildren();
        var timezoneSegmentedControl = new SegmentedControlSingleSelectView();
        timezoneSegmentedControl.title = "Timezone";
        timezoneSegmentedControl.choices = [
            {
                identifier: 'princeton',
                displayText: 'Princeton\'s Timezone',
                selected: !this.isLocalTimezone
            },
            {
                identifier: 'local',
                displayText: 'Local Timezone',
                selected: this.isLocalTimezone
            }
        ];
        timezoneSegmentedControl.attachEventHandler(BrowserEvents.segmentedControlSelectionChange, (ev: JQueryEventObject)=>{
            var choice = timezoneSegmentedControl.choices.reduce((selected, choice)=>{
                if (selected === null && choice.selected)
                {
                    return choice;
                }
                return selected;
            }, null);
            this.isLocalTimezone = choice.identifier === 'local';
        });
        this.timezoneOptionsView.append(timezoneSegmentedControl);
    }
    private renderCalendarOptionsView()
    {
        this.calendarOptionsView.removeAllChildren();
        var calendarVisibilitySegmentedControl = new SegmentedControlMultipleSelectView();
        calendarVisibilitySegmentedControl.title = "Show these in calendar:";
        calendarVisibilitySegmentedControl.choices = this.possibleEventTypes.allKeys().map((eventTypeCode: string)=>{
            return {
                identifier: eventTypeCode,
                displayText: this.possibleEventTypes.get(eventTypeCode),
                selected: this.calendarSelectedEventTypesSet.contains(eventTypeCode),
            };
        });
        calendarVisibilitySegmentedControl.attachEventHandler(BrowserEvents.segmentedControlSelectionChange, (ev: JQueryEventObject)=>{
            var choices = calendarVisibilitySegmentedControl.choices;
            this._calendarSelectedEventTypes = choices.reduce((selected: Set<string>, choice)=>{
                if (choice.selected)
                {
                    selected.add(choice.identifier);
                }
                return selected;
            }, new Set<string>());
        });
        this.calendarOptionsView.append(calendarVisibilitySegmentedControl);
    }

    private renderAgendaOptionsView()
    {
        this.agendaOptionsView.removeAllChildren();
        var agendaVisibilitySegmentedControl = new SegmentedControlMultipleSelectView();
        agendaVisibilitySegmentedControl.title = "Show these in agenda:";
        agendaVisibilitySegmentedControl.choices = this.possibleEventTypes.allKeys().map((eventTypeCode: string)=>{
            return {
                identifier: eventTypeCode,
                displayText: this.possibleEventTypes.get(eventTypeCode),
                selected: this.agendaSelectedEventTypesSet.contains(eventTypeCode),
            };
        });
        agendaVisibilitySegmentedControl.attachEventHandler(BrowserEvents.segmentedControlSelectionChange, (ev: JQueryEventObject)=>{
            var choices = agendaVisibilitySegmentedControl.choices;
            this._agendaSelectedEventTypes = choices.reduce((selected: Set<string>, choice)=>{
                if (choice.selected)
                {
                    selected.add(choice.identifier);
                }
                return selected;
            }, new Set<string>());
        });
        this.agendaOptionsView.append(agendaVisibilitySegmentedControl);
    }

    private renderCourseOptionsView()
    {
        this.courseOptionsView.removeAllChildren();
        var courseVisibilitySegmentedControl = new SegmentedControlMultipleSelectView();
        courseVisibilitySegmentedControl.title = 'Visible Courses';
        courseVisibilitySegmentedControl.choices = this.possibleCourses.map((course: ICoursesModel)=>{
            return {
                identifier: course.courseId,
                displayText: course.primaryListing,
                selected: this.visibleCoursesSet.contains(course),
            };
        });
        courseVisibilitySegmentedControl.attachEventHandler(BrowserEvents.segmentedControlSelectionChange, (ev: JQueryEventObject, extra: any)=>{
            var choices = courseVisibilitySegmentedControl.choices;
            this._visibleCourses = new Set<string>(this.possibleCourses.filter((course: ICoursesModel)=>{
                return choices.filter((choice)=>{
                    return choice.identifier === course.courseId && choice.selected;
                }).length !== 0;
            })
            );
        });
        this.courseOptionsView.append(courseVisibilitySegmentedControl);
    }

    private renderEventsVisibilityOptions()
    {
        this.eventsVisibilityOptionsView.removeAllChildren();
        var eventsVisibilitySegmentedControl = new SegmentedControlSingleSelectView();
        eventsVisibilitySegmentedControl.title = 'Show hidden events';
        eventsVisibilitySegmentedControl.choices = [
            {
                identifier: 'yes',
                displayText: 'Yes',
                selected: this.eventsHidden
            },
            {
                identifier: 'no',
                displayText: 'No',
                selected: !this.eventsHidden
            },
        ];
        eventsVisibilitySegmentedControl.attachEventHandler(BrowserEvents.segmentedControlSelectionChange, (ev: JQueryEventObject, extra: any)=>{
            eventsVisibilitySegmentedControl.choices.filter((choice)=>{return choice.selected;}).map((choice)=>{
                this.eventsHidden = (choice.identifier === 'yes');
            });
        });
        this.eventsVisibilityOptionsView.append(eventsVisibilitySegmentedControl);
    }
}

export = SettingsView;