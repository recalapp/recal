import CoreUI = require('../CoreUI/CoreUI');
import Time = require('../DateTime/Time');

import IFocusableView = CoreUI.IFocusableView;

export interface ITimeInputView extends IFocusableView
{
    /**
     * The value of the input view
     */
    value: Time;
}