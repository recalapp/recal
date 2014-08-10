import CoreUI = require('../CoreUI/CoreUI');

import IView = CoreUI.IView;

export interface ISidebarView extends IView
{
    /********************************************************************
      Stack View
      ******************************************************************/
    /**
      * pushes the view into the view stack if the identitifer does not
      * already exists. Otherwise, replace the old view.
      */
    pushStackViewWithIdentifier(stackView: IView, identifier: string): void;
    
    /**
      * Returns true of a view with the identifier already exists.
      */
    containsStackViewWithIdentifier(identifier: string): boolean;
    
    /**
      * Returns the view with identifier. null if does not exist.
      */
    getStackViewWithIdentifier(identifier: string): IView;

    /**
      * Remove the view with identifier and return it
      */
    popStackViewWithIdentifier(identifier: string): IView;

    /********************************************************************
      Full View
      ******************************************************************/
    /**
      * Sets a view to be the full view, replacing the old one
      * if necessary.
      */
    setFullView(fullView: IView): void;
    
    /**
      * Returns true if a full view has been set.
      */
    containsFullView(): boolean;

    /**
      * Retrieves the full view. null if does not exist.
      */
    getFullView(): IView;

    /**
      * Unset the full view and return it. null if does not exist.
      */
    unsetFullView(): IView;

    /********************************************************************
      Droppable Behavior
      ******************************************************************/    

    /**
      * Registers view with the css selector to receive droppable events
      */
    registerDroppable(cssSelector: string);
}
