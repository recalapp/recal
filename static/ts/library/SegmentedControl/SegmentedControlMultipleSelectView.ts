/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import SegmentedControl = require('./SegmentedControl');
import SegmentedControlBaseView = require('./SegmentedControlBaseView');

import ISegmentedControlChoice = SegmentedControl.ISegmentedControlChoice;

class SegmentedControlMultipleSelectView extends SegmentedControlBaseView
{
    public static get cssClass(): string
    {
        return SegmentedControlBaseView.cssClass + ' segmentedControlMultipleSelectView';
    }

    constructor()
    {
        super(SegmentedControlMultipleSelectView.cssClass);
    }

    public handleClickForChoice(choice: ISegmentedControlChoice)
    {
        choice.selected = !choice.selected;
    }
    /**
      * Provide multiple select behavior
      */
    public fixChoices(mostRecent?: ISegmentedControlChoice): void
    {
        // it's the default behavior
    }
}

export = SegmentedControlMultipleSelectView;
