/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import SegmentedControl = require('./SegmentedControl');
import SegmentedControlBaseView = require('./SegmentedControlBaseView');
import SegmentedControlChoiceView = require('./SegmentedControlChoiceView');
import SegmentedControlCommon = require('./SegmentedControlCommon');

import ISegmentedControlChoice = SegmentedControl.ISegmentedControlChoice;

class SegmentedControlSingleSelectView extends SegmentedControlBaseView
{
    public static get cssClass(): string
    {
        return SegmentedControlBaseView.cssClass + ' segmentedControlSingleSelect';
    }

    constructor()
    {
        super(SegmentedControlSingleSelectView.cssClass);
    }

    /**
      * Provide single select behavior
      */
    public fixChoices(mostRecent?: ISegmentedControlChoice): void
    {
        this.choices[0].selected = true; // ok because we keep latest
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

export = SegmentedControlSingleSelectView;
