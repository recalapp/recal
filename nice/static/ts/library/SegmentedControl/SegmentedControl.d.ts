import CoreUI = require('../CoreUI/CoreUI');

import IFocusableView = CoreUI.IFocusableView;

export interface ISegmentedControlSingleSelectView extends IFocusableView
{
    /**
      * The title of the segmented control
      */
    title: string;

    /**
      * The choices for segmented control
      */
    choices: ISegmentedControlChoice[];
}

export interface ISegmentedControlChoice
{
    displayText: string;
    identifier: string;
    selected: boolean;
}
