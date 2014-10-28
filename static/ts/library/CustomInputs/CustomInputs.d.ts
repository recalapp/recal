import CoreUI = require('../CoreUI/CoreUI');
import Time = require('../DateTime/Time');
import Date = require('../DateTime/Date');

import IFocusableView = CoreUI.IFocusableView;

export interface IDateInputView extends IFocusableView
{
    /**
     * The value of the input view
     */
    value: Date;
}

export interface ITimeInputView extends IFocusableView
{
    /**
     * The value of the input view
     */
    value: Time;
}