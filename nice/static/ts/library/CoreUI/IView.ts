/// <reference path="../../typings/tsd.d.ts" />

interface IView 
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

    /******************************************************************
      Methods
      ****************************************************************/

    /**
      * The unique css selector for this class.
      */
    cssSelector(): string;

    /**
      * The unique css class for this class.
      */
    cssClass(): string;

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
    removeAllChildren(): void
}
export = IView;
