/// <reference path="../../typings/tsd.d.ts" />

import Rect = require('../DataStructures/Rect');

export interface IView 
{
    /******************************************************************
      Properties
      ****************************************************************/
    /**
      * The parent view of the view, if exists. Null if no parent
      * Readonly
      */
    parentView: IView;

    /**
      * Immutable array of child views
      * Readonly
      */
    children: IView[];

    /**
      * Physical width of the view
      */
    width: number;
    
    /**
      * Physical height of the view
      */
    height: number;

    /**
      * The absolute top position
      * Readonly
      */
    absoluteTop: number;

    /**
      * The absolute left position
      * Readonly
      */
    absoluteLeft: number;

    /**
      * The top position relative to parent
      * Readonly
      */
    relativeTop: number;

    /**
      * The top position relative to parent
      * Readonly
      */
    relativeLeft: number;

    /**
      * Get the bounding rect of this view. This is the position of the view
      * with respect to the browser, and will be different from absolute 
      * position if the website itself has scrolled.
      */
    boundingRect: Rect;

    /******************************************************************
      Methods
      ****************************************************************/

    /**
      * Append childView to this view. childView cannot already have a parent
      */
    append(childView: IView): void;
    /**
      * Append this view to the parent view of the parameter siblingView,
      * in the position right after siblingView.
      */
    insertAfter(siblingView: IView): void;
    /**
      * Remove this view from its parent. Cannot be called if this view 
      * does not have a parent.
      */
    removeFromParent(): void

    /**
      * Attach an event handler to the view
      */
    attachEventHandler(ev : string, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);
    attachEventHandler(ev : string, selector: string, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);

     /**
      * Attach an event handler to the view that only gets triggered once
      */
    attachOneTimeEventHandler(ev : string, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);
    attachOneTimeEventHandler(ev : string, selector: string, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);


    /**
      * Triggers an event on the View.
      */
    triggerEvent(ev: string);
    triggerEvent(ev: string, extraParameter : any);

    /**
      * Returns true if $element is the view itself
      * or is a descendent of the view.
      */
    containsJQueryElement($element: JQuery): boolean;
    /**
      * Remove all children from this view, both initialized and uninitialized
      */
    removeAllChildren(): void;

    /**
      * Return the JQuery element(s) matching the selector in this view.
      */
    findJQuery(cssSelector: string): JQuery;

    /**
      * Returns true if this view's element mataches
      * the css selector
      */
    is(cssSelector: string): boolean;

    /**
      * Add CSS class to this view. Uses $.addClass
      */
    addCssClass(cssClass: string): void;

    /**
      * Remove CSS class from this view. Uses $.removeClass
      */
    removeCssClass(cssClass: string): void;

    /**
      * Calls $.css. See their API
      */
    /**
      * Calls $.css. See their API
      */
    css(argument1: any, argument2?: any): any;
}

export interface IFocusableView extends IView
{
    hasFocus: boolean;

    didFocus(): void;
    didBlur(): void;

    /**
      * Shows a view as popover originating from this view
      */
    showViewInPopover(childView: IFocusableView): void;

    /**
      * Remove the popover element
      */
    hidePopover(): void;

    /**
      * Brings the view into focus
      */
    focus(): void;
}

export interface IViewController
{
    /******************************************************************
      Properties
      ****************************************************************/
    view: IView;

    parentViewController: IViewController;
    childViewControllers: IViewController[];

    /******************************************************************
      Methods
      ****************************************************************/

    addChildViewController(childVC: IViewController): void;
    removeFromParentViewController(): void;
}

export interface IViewTemplateRetriever
{
    /**
      * Retrieve the template belonging to the container selector as a 
      * jQuery object. Creates a new one every time.
      */
    retrieveTemplate(containerSelector: string): JQuery;
}
