/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import FocusableView = require('../CoreUI/FocusableView');
import SegmentedControl = require('./SegmentedControl');
import SegmentedControlCommon = require('./SegmentedControlCommon');

import ISegmentedControlChoice = SegmentedControl.ISegmentedControlChoice;

class SegmentedControlChoiceView extends FocusableView
{
    public static get cssClass(): string
    {
        return FocusableView.cssClass + ' segmentedControlChoiceView';
    }
    private static get template(): JQuery
    {
        var $button = $('<button class="btn btn-sm">');
        return $button;
    }

    private _choice: ISegmentedControlChoice = null;
    public get choice(): ISegmentedControlChoice
    {
        return this._choice;
    }
    public set choice(value: ISegmentedControlChoice)
    {
        if (this._choice !== value)
        {
            this._choice = value;
            this.refresh();
        }
    }

    private _highlighted: boolean = false;
    private get highlighted(): boolean
    {
        return this._highlighted;
    }
    private set highlighted(value: boolean)
    {
        this._highlighted = value;
        this._highlighted ? 
            this._$el.addClass('btn-primary') :
            this._$el.removeClass('btn-primary');
    }

    constructor()
    {
        super(SegmentedControlChoiceView.template, SegmentedControlChoiceView.cssClass);
    }

    private refresh(): void
    {
        if (this.choice === null || this.choice === undefined)
        {
            // should never be called
            this._$el.text('');
            return;
        }
        this._$el.text(this._choice.displayText);
        this._$el.attr('id', SegmentedControlCommon.prefix + this._choice.identifier);
        this.highlighted = this._choice.selected;
    }
}

export = SegmentedControlChoiceView;
