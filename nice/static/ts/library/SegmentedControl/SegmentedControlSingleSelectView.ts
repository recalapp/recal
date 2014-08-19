/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import BrowserEvents = require('../Core/BrowserEvents');
import FocusableView = require('../CoreUI/FocusableView');
import InvalidActionException = require('../Core/InvalidActionException');
import SegmentedControl = require('./SegmentedControl');
import SegmentedControlChoiceView = require('./SegmentedControlChoiceView');
import SegmentedControlCommon = require('./SegmentedControlCommon');
import View = require('../CoreUI/View');

import ISegmentedControlChoice = SegmentedControl.ISegmentedControlChoice;
import ISegmentedControlSingleSelectView = SegmentedControl.ISegmentedControlSingleSelectView;

class SegmentedControlSingleSelectView extends FocusableView
{
    private static get template(): JQuery
    {
        var $container = $('<div>').append($('<h5 id="title">'));
        $container.append($('<div id="choices" class="btn-group">'));
        return $container;
    }

    public static get cssClass(): string
    {
        return FocusableView.cssClass + ' segmentedControl';
    }

    private _titleView: View = null;
    private get titleView(): View
    {
        return this._titleView;
    }
    private set titleView(value: View)
    {
        this._titleView = value;
    }

    private _choicesView: View = null;
    private get choicesView(): View
    {
        return this._choicesView;
    }
    private set choicesView(value: View)
    {
        this._choicesView = value;
    }

    /**
      * The title of the segmented control
      */
    private _title: string = null;
    public get title(): string
    {
        return this._title;
    }
    public set title(value: string)
    {
        if (this._title !== value)
        {
            this._title = value;
            this.titleView._$el.text(this._title);
        }
    }
    
    /**
      * The choices for segmented control
      */
    private _choices: ISegmentedControlChoice[] = null;
    public get choices(): ISegmentedControlChoice[]
    {
        return this._choices;
    }
    public set choices(value: ISegmentedControlChoice[])
    {
        if (value.length < 1)
        {
            throw new InvalidActionException('Segmented control must have at least one choice');
        }
        this._choices = value;
        this.choicesView.removeAllChildren();

        // makes sure exactly one choice is selected
        this._choices[0].selected = true; // ok because we pick the last seen choice
        var lastSelected: ISegmentedControlChoice = null;
        $.each(this._choices, (index: number, choice: ISegmentedControlChoice)=>
        {
            if (choice.selected)
            {
                lastSelected = choice;
            }
        });
        this.fixChoices(lastSelected);

        // render
        this.renderChoices();
    }

    constructor()
    {
        super(SegmentedControlSingleSelectView.template, SegmentedControlSingleSelectView.cssClass);
        this.titleView = View.fromJQuery(this.findJQuery('#title'));
        this.titleView.removeAllChildren();
        this.choicesView = View.fromJQuery(this.findJQuery('#choices'));
        this.choicesView.removeAllChildren();
        this.choicesView.attachEventHandler(BrowserEvents.click, SegmentedControlChoiceView.cssSelector, (ev: JQueryEventObject)=>
        {
            var $choice: JQuery = $(ev.target).closest(SegmentedControlChoiceView.cssSelector);
            var choiceView: SegmentedControlChoiceView = <SegmentedControlChoiceView> SegmentedControlChoiceView.fromJQuery($choice);
            choiceView.choice.selected = true;
            this.fixChoices(choiceView.choice);

            this.triggerEvent(BrowserEvents.segmentedControlSelectionChange);
        })
    }

    private fixChoices(mostRecent: ISegmentedControlChoice): void
    {
        $.each(this._choices, (index: number, choice: ISegmentedControlChoice)=>
        {
            if (choice !== mostRecent)
            {
                choice.selected = false;
            }
        });
    }

    private renderChoices(): void
    {
        $.each(this.choices, (index: number, choice: ISegmentedControlChoice) =>{
            // get or create the button for this choice
            var $choice: JQuery = this.choicesView.findJQuery('#' + SegmentedControlCommon.prefix + choice.identifier);
            var choiceView: SegmentedControlChoiceView;
            if ($choice.length === 0)
            {
                // create
                $choice = $('<button class="btn btn-sm">');
                choiceView = <SegmentedControlChoiceView> SegmentedControlChoiceView.fromJQuery($choice);
                this.append(choiceView);
            } 
            else
            {
                // reuse
                choiceView = <SegmentedControlChoiceView> SegmentedControlChoiceView.fromJQuery($choice);
            }

            // update view
            choiceView.choice = choice;
        });
    }
}

export = SegmentedControlSingleSelectView;
