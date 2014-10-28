import ActionSheetType = require('./ActionSheetType');
import CoreUI = require('../CoreUI/CoreUI');

import IFocusableView = CoreUI.IFocusableView;

export interface IActionSheetView extends IFocusableView
{
    title: string;
    addChoice(choice: IActionSheetChoice): void;
}

export interface IActionSheetChoice
{
    identifier: string;
    displayText: string;
    type: ActionSheetType;
}
