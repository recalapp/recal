import ActionSheetType = require('./ActionSheetType');
import CoreUI = require('../CoreUI/CoreUI');

import IView = CoreUI.IView;

export interface IActionSheetView extends IView
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
