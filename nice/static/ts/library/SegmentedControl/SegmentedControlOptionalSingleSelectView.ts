/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import SegmentedControl = require('./SegmentedControl');
import SegmentedControlBaseView = require('./SegmentedControlBaseView');

import ISegmentedControlChoice = SegmentedControl.ISegmentedControlChoice;

class SegmentedControlOptionalSingleSelectView extends SegmentedControlBaseView
{
    public static get cssClass(): string
    {
        return SegmentedControlBaseView.cssClass + ' segmentedControlOptionalSingleSelectView';
    }

    constructor()
    {
        super(SegmentedControlOptionalSingleSelectView.cssClass);
    }

    /**
      * Provide single select behavior
      */
    public fixChoices(mostRecent?: ISegmentedControlChoice): void
    {
        if (mostRecent === null || mostRecent === undefined)
        {
            // most recent is not given, defaults to the last choice
            $.each(this.choices, (index: number, choice: ISegmentedControlChoice)=>
            {
                if (choice.selected)
                {
                    mostRecent = choice;
                }
            });
        }
        $.each(this.choices, (index: number, choice: ISegmentedControlChoice)=>
        {
            if (choice !== mostRecent)
            {
                choice.selected = false;
            }
        });
    }
}

export = SegmentedControlOptionalSingleSelectView;
