import CoreUI = require('../CoreUI/CoreUI');
import Time = require('../DateTime/Time');

import IFocusableView = CoreUI.IFocusableView;

export interface ITimeInputView extends IFocusableView
{
    /**
     * The value of the input view
     */
    value: Time;

    /**
     * The format of the display text for this time. See DateTime documentation.
     */
    timeFormat: string;
}