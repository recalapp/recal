/// <reference path="../../../typings/tsd.d.ts" />

import BrowserEvents = require('../../../library/Core/BrowserEvents');
import Courses = require('../../common/Courses/Courses');
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
    private _possibleEventTypes: Set<string> = null;
    public get possibleEventTypes(): string[]
    {
        if (!this._possibleEventTypes)
        {
            this._possibleEventTypes = new Set<string>();
        }
        return this._possibleEventTypes.toArray();
    }
    public set possibleEventTypes(value: string[])
    {
        if (value === null || value === undefined)
        {
            value = [];
        }
        this._possibleEventTypes = new Set<string>(value);
    }

    private _agendaSelectedEventTypes: Set<string> = null;
    public get agendaSelectedEventTypes(): string[]
    {
        if (!this._agendaSelectedEventTypes)
        {
            this._agendaSelectedEventTypes = new Set<string>();
        }
        return this._agendaSelectedEventTypes.toArray();
    }
    public set agendaSelectedEventTypes(value: string[])
    {
        if (value === null || value === undefined)
        {
            value = [];
        }
        this._agendaSelectedEventTypes = new Set<string>(value);
    }

    private _calendarSelectedEventTypes: Set<string> = null;
    public get calendarSelectedEventTypes(): string[]
    {
        if (!this._calendarSelectedEventTypes)
        {
            this._calendarSelectedEventTypes = new Set<string>();
        }
        return this._calendarSelectedEventTypes.toArray();
    }
    public set calendarSelectedEventTypes(value: string[])
    {
        if (value === null || value === undefined)
        {
            value = [];
        }
        this._calendarSelectedEventTypes = new Set<string>(value);
    }

    private _eventsHidden = false;
    public get eventsHidden(): boolean { return this._eventsHidden; }
    public set eventsHidden(value: boolean) { this._eventsHidden = value; this.renderEventsVisibilityOptions(); }

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
            this.visibleCourses = this.possibleCourses.filter((course: ICoursesModel)=>{
                return choices.filter((choice)=>{
                    return choice.identifier === course.courseId && choice.selected;
                }).length !== 0;
            });
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