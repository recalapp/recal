import CoreUI = require('../CoreUI/CoreUI');

import IFocusableView = CoreUI.IFocusableView;
import IViewController = CoreUI.IViewController;

export interface IPopUpView extends IFocusableView
{
    popUpId: string;
    color: string; // TODO make into module
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
