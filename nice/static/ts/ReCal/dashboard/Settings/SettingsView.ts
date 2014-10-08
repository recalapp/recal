/// <reference path="../../../typings/tsd.d.ts" />

import SegmentedControlMultipleSelectView = require('../../../library/SegmentedControl/SegmentedControlMultipleSelectView');
import SegmentedControlSingleSelectView = require('../../../library/SegmentedControl/SegmentedControlSingleSelectView');
import SegmentedControlOptionalSingleSelectView = require('../../../library/SegmentedControl/SegmentedControlOptionalSingleSelectView');
import Set = require('../../../library/DataStructures/Set');
import View = require('../../../library/CoreUI/View');

class SettingsView extends View
{
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
        this.eventsVisibilityOptionsView.removeAllChildren();
        var eventsVisibilitySegmentedControl = new SegmentedControlSingleSelectView();
        eventsVisibilitySegmentedControl.title = 'Show hidden events';
        eventsVisibilitySegmentedControl.choices = [
            {
                identifier: 'yes',
                displayText: 'Yes',
                selected: true
            },
            {
                identifier: 'no',
                displayText: 'No',
                selected: false
            },
        ];
        this.eventsVisibilityOptionsView.append(eventsVisibilitySegmentedControl);
    }
}

export = SettingsView;