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
import ISegmentedControlView = SegmentedControl.ISegmentedControlView;

class SegmentedControlBaseView extends FocusableView implements ISegmentedControlView
{
    private static get template(): JQuery
    {
        var $container = $('<div>').append($('<h5 id="title">'));
        $container.append($('<div id="choices" class="btn-group">'));
        return $container;
    }

    public static get cssClass(): string
    {
        return FocusableView.cssClass + ' segmentedControlBase';
    }

    private _titleView: View = null;
    private get titleView(): View { return this._titleView; }
    private set titleView(value: View) { this._titleView = value; }

    private _choicesView: View = null;
    private get choicesView(): View { return this._choicesView; }
    private set choicesView(value: View) { this._choicesView = value; }

    /**
      * The title of the segmented control
      */
    private _title: string = null;
    public get title(): string { return this._title; }
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
    public get choices(): ISegmentedControlChoice[] { return this._choices; }
    public set choices(value: ISegmentedControlChoice[])
    {
        if (value.length < 1)
        {
            throw new InvalidActionException('Segmented control must have at least one choice');
        }
        this._choices = value;
        this.choicesView.removeAllChildren();
        this.fixChoices();

        // render
        this.renderChoices();
    }

    constructor(cssClass: string)
    {
        super(SegmentedControlBaseView.template, cssClass);
        this.titleView = View.fromJQuery(this.findJQuery('#title'));
        this.titleView.removeAllChildren();
        this.choicesView = View.fromJQuery(this.findJQuery('#choices'));
        this.choicesView.removeAllChildren();
        this.choicesView.attachEventHandler(BrowserEvents.click, (ev: JQueryEventObject)=>
        {
            var $choice: JQuery = $(ev.target).closest(SegmentedControlChoiceView.cssSelector());
            var choiceView: SegmentedControlChoiceView = <SegmentedControlChoiceView> SegmentedControlChoiceView.fromJQuery($choice);
            this.handleClickForChoice(choiceView.choice);
            this.fixChoices(choiceView.choice);
            this.renderChoices();
            this.triggerEvent(BrowserEvents.segmentedControlSelectionChange);
        })
    }

    /**
      * This method is called right after choice selection has changed. 
      * Must be overidden in subclasses to get the right behavior (e.g.
      * single select vs multiple selects)
      */
    public fixChoices(mostRecent?: ISegmentedControlChoice): void
    {
    }

    public handleClickForChoice(choice: ISegmentedControlChoice)
    {
        choice.selected = true;
    }

    private renderChoices(): void
    {
        this.choices.map((choice: ISegmentedControlChoice)=>{
            // get or create the button for this choice
            var $choice: JQuery = this.choicesView.findJQuery('#' + SegmentedControlCommon.prefix + choice.identifier);
            var choiceView: SegmentedControlChoiceView;
            if ($choice.length === 0)
            {
                // create
                $choice = $('<button class="btn btn-sm">').attr('id', '#' + SegmentedControlCommon.prefix + choice.identifier);
                choiceView = <SegmentedControlChoiceView> SegmentedControlChoiceView.fromJQuery($choice);
                this.choicesView.append(choiceView);
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

export = SegmentedControlBaseView;
