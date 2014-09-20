/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');
import BrowserEvents = require("../Core/BrowserEvents");
import CoreUI = require('./CoreUI');
import InvalidActionException = require('../Core/InvalidActionException');
import InvalidArgumentException = require("../Core/InvalidArgumentException");
import Set = require('../DataStructures/Set');

import IView = CoreUI.IView;

class View implements IView
{
    private static JQUERY_DATA_KEY = 'view_object';
    private static _viewCount = 0; // Used to make sure toString() is unique
    private _viewNumber: number;
    _$el: JQuery = null;
    _parentView: IView = null;
    _children: Set<IView> = new Set<View>();
    /******************************************************************
      Properties
      ****************************************************************/

    /**
      * The parent view of the view, if exists. Null if no parent
      */
    get parentView(): IView
    {
        return this._parentView;
    }

    /**
      * Immutable array of child views
      */
    get children(): IView[]
    {
        return this._children.toArray();
    }

    /**
      * Physical width of the view
      */
    get width(): number
    {
        return this._$el.width();
    }
    set width(newValue: number)
    {
        this._$el.width(newValue);
    }

    /**
      * Physical height of the view
      */
    get height(): number
    {
        return this._$el.height();
    }
    set height(newValue: number)
    {
        this._$el.height(newValue);
    }

    get absoluteTop(): number
    {
        return this._$el.offset().top;
    }

    get absoluteLeft(): number
    {
        return this._$el.offset().left;
    }

    get relativeTop(): number
    {
        return this._$el.position().top;
    }
    get relativeLeft(): number
    {
        return this._$el.position().left;
    }

    /******************************************************************
      Methods
      ****************************************************************/
    /**
      * The unique css selector for this class.
      */
    public static cssSelector(): string
    {
        var classes: string[] = this.cssClass.split(/\s+/);
        for (var i = 0; i < classes.length; i++)
        {
            classes[i] = '.' + classes[i];
        }

        return classes.join('');
    }

    /**
      * The unique css class for this class.
      */
    public static get cssClass(): string
    {
        return 'view';
    }

    /**
      * Initialize a new View object from the JQuery element.
      * Throws an error if the JQuery element already belongs to another
      * View object.
      */
    constructor($element: JQuery, cssClass: string)
    {
        if ($element === null)
        {
            throw new InvalidArgumentException('A JQuery element must be specified');
        }
        if (View._viewIsInitialized($element))
        {
            throw new InvalidActionException('View is already initialized.');
        }
        if ($element.length != 1)
        {
            throw new InvalidArgumentException('The JQuery element must have exactly one html DOM object.');
        }
        this._viewNumber = View._viewCount++;
        this._$el = $element;
        this._$el.data(View.JQUERY_DATA_KEY, this);
        this._$el.addClass(cssClass);
    }

    /**
      * Returns true if the view associated with the jQuery element has
      * been initialized.
      */
    static _viewIsInitialized($element: JQuery) : boolean
    {
        // NOTE(naphatkrit) cannot do a typecheck as of now. instaceof operator does not respect inheritance
        var viewObject = $element.data(View.JQUERY_DATA_KEY);
        return viewObject !== null && viewObject !== undefined;
    }

    /**
      * Initialize a new View object from the JQuery element, or return
      * an existing one.
      * NOTE: initialization must happen top-down. That is, once a view is
      * initialized, all its ancestors (parent, grandparent, etc.) must
      * either already be initialized, or they can be initialized as a 
      * generic view class.
      */
    public static fromJQuery($element: JQuery) : View
    {
        if (this._viewIsInitialized($element))
        {
            return $element.data(View.JQUERY_DATA_KEY);
        }
        // because the view has not been initalized, it will not belong to
        // the parent's children list yet. We can safely add it
        var view = new this($element, this.cssClass);
        if ($element.parent().length > 0)
        {
            // parent exists
            var parentView = View.fromJQuery($element.parent()); // use View instead of 'this' so we assume that parent is a generic view
            parentView._children.add(view)
            view._parentView = parentView;
        }
        return view;
    }

    /**
      * Append childView to this view. childView cannot already have a parent
      */
    public append(childView: IView) : void 
    {
        var childViewCasted: View = <View> childView;
        if (this._children.contains(childView))
        {
            throw new InvalidActionException('Cannot add a child view twice.');
        }
        if (childViewCasted._parentView !== null)
        {
            throw new InvalidActionException('A view can only have one parent.');
        }
        this._$el.append(childViewCasted._$el);
        this._children.add(childView);
        childViewCasted._parentView = this;
        this.triggerEvent(BrowserEvents.viewWasAppended, {
            childView: childView,
            parentView: this,
        });
    }

    /**
      * Append this view to the parent view of the parameter siblingView,
      * in the position right after siblingView.
      */
    public insertAfter(siblingView: IView): void
    {
        var parentView = <View>siblingView.parentView;
        var siblingViewCasted: View = <View>siblingView;
        if (parentView === null || parentView === undefined)
        {
            throw new InvalidActionException('Cannot append after a view that does not have a parent');
        }
        if (parentView._children.contains(this))
        {
            throw new InvalidActionException('Cannot add a child view twice.');
        }
        if (this.parentView !== null)
        {
            throw new InvalidActionException('A view can only have one parent.');
        }
        siblingViewCasted._$el.after(this._$el);
        parentView._children.add(this);
        this._parentView = parentView;
        parentView.triggerEvent(BrowserEvents.viewWasAppended, {
            childView: this,
            parentView: parentView,
        });
    }

    /**
      * Remove this view from its parent. Cannot be called if this view 
      * does not have a parent.
      */
    public removeFromParent() : void
    {
        var parentView = <View>this._parentView;
        if (parentView === null)
        {
            throw new InvalidActionException('Cannot call removeFromParent() on a view that does not have a parent.');
        }
        this._$el.detach();
        parentView._children.remove(this);
        this._parentView = null;
        parentView.triggerEvent(BrowserEvents.viewWasRemoved, {
            childView: this,
            parentView: parentView,
        });
    }

    /**
      * Attach an event handler to the view
      */
    public attachEventHandler(ev : string, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);
    public attachEventHandler(ev : string, selector: string, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);
    public attachEventHandler(ev : string, argumentThree: any, handler?: (eventObject: JQueryEventObject, ...eventData: any[]) => any)
    {
        var eventName = ev;
        var $element = this._$el;
        if (typeof argumentThree === 'string' || argumentThree instanceof String || argumentThree.constructor === String)
        {
            if (handler === undefined)
            {
                throw new InvalidArgumentException("No handler provided.");
            }
            $element.on(eventName, <string> argumentThree, handler);
        }
        else if (typeof argumentThree === 'function')
        {
            $element.on(eventName, argumentThree);
        }
        else
        {
            throw new InvalidArgumentException("The second argument must either be a string or a function.");
        }
    }

    /**
      * Attach an event handler to the view that only gets triggered once
      */
    public attachOneTimeEventHandler(ev : string, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);
    public attachOneTimeEventHandler(ev : string, selector: string, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);
    public attachOneTimeEventHandler(ev : string, argumentThree: any, handler?: (eventObject: JQueryEventObject, ...eventData: any[]) => any)
    {
        var eventName = ev;
        var $element = this._$el;
        if (typeof argumentThree === 'string' || argumentThree instanceof String || argumentThree.constructor === String)
        {
            if (handler === undefined)
            {
                throw new InvalidArgumentException("No handler provided.");
            }
            $element.one(eventName, <string> argumentThree, handler);
        }
        else if (typeof argumentThree === 'function')
        {
            $element.one(eventName, argumentThree);
        }
        else
        {
            throw new InvalidArgumentException("The second argument must either be a string or a function.");
        }
    }

    /**
      * Triggers an event on the View.
      */
    public triggerEvent(ev: string);
    public triggerEvent(ev: string, extraParameter : any);
    public triggerEvent(ev: string, extraParameter? : any)
    {
        var eventName = ev;
        if (extraParameter === undefined || extraParameter === null)
        {
            extraParameter = {};
        }
        extraParameter.view = this;
        this._$el.trigger(eventName, extraParameter);
    }

    /**
      * Returns true if $element is the view itself
      * or is a descendent of the view.
      */
    public containsJQueryElement($element : JQuery) : boolean
    {
        return this._$el.is($element) || this._$el.find($element).length != 0;
    }

    /**
      * Remove all children from this view, both initialized and uninitialized
      */
    public removeAllChildren() : void
    {
        $.each(this.children, (index: number, child: View) =>
                {
                    child.removeFromParent();
                });
        this._$el.html('') // in case some child views have not been initialized
        this._children = new Set<View>();
    }

    /**
      * Return the JQuery element(s) matching the selector in this view.
      */
    public findJQuery(cssSelector: string): JQuery
    {
        return this._$el.find(cssSelector);
    }

    /**
      * Returns true if this view's element mataches
      * the css selector
      */
    public is(cssSelector: string): boolean
    {
        return this._$el.is(cssSelector);
    }

    /**
      * Add CSS class to this view. Uses $.addClass
      */
    public addCssClass(cssClass: string): void
    {
        this._$el.addClass(cssClass);
    }

    /**
      * Remove CSS class from this view. Uses $.removeClass
      */
    public removeCssClass(cssClass: string): void
    {
        this._$el.removeClass(cssClass);
    }

    /**
      * Calls $.css. See their API
      */
    public css(argument1: any, argument2?: any): any
    {
        return this._$el.css(argument1, argument2);
    }

    /**
      * Unique
      */
    public toString() : string
    {
        return 'View no. ' + this._viewNumber;
    }
}
export = View;
