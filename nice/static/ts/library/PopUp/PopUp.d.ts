import CoreUI = require('../CoreUI/CoreUI');
import PopUpType = require('./PopUpType');

import IFocusableView = CoreUI.IFocusableView;
import IViewController = CoreUI.IViewController;

export interface IPopUpView extends IFocusableView
{
    popUpId: string;
    color: string; // TODO make into module
    type: PopUpType;
}

export interface IPopUpContainerViewController extends IViewController
{
    /**
      * Returns all the PopUpViews in this container.
      */
    popUpViews: IPopUpView[];

    /**
      * Get the PopUpView with the specified ID.
      */
    getPopUpById(popUpId: string): IPopUpView;
}
