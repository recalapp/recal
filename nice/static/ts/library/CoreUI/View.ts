/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');
import InvalidActionException = require('../Core/InvalidActionException');
import Set = require('../DataStructures/Set');

class View 
{
    private static JQUERY_DATA_KEY = 'view_object';
    private static _viewCount = 0; // Used to make sure toString() is unique
    private _viewNumber: number;
    _$el: JQuery = null;
    _parentView: View = null;
    _children: Set<View> = new Set<View>();
    /******************************************************************
      Properties
      ****************************************************************/

    get parentView(): View
    {
        return this._parentView;
    }

    get children(): Array<View>
    {
        return this._children.toArray();
    }

    get width(): number
    {
        return this._$el.width();
    }
    set width(newValue: number)
    {
        this._$el.width(newValue);
    }

    get height(): number
    {
        return this._$el.height();
    }
    set height(newValue: number)
    {
        this._$el.height(newValue);
    }

    /******************************************************************
      Methods
      ****************************************************************/
    constructor($element: JQuery)
    {
        if ($element.data(View.JQUERY_DATA_KEY) instanceof View)
        {
            throw new InvalidActionException('View is already initialized.');
        }
        this._viewNumber = View._viewCount++;
        this._$el = $element;
        this._$el.data(View.JQUERY_DATA_KEY, this);
    }

    static fromJQuery($element: JQuery) : View
    {
        if ($element.data(View.JQUERY_DATA_KEY) instanceof View)
        {
            return $element.data(View.JQUERY_DATA_KEY);
        }
        return new View($element);
    }

    append(childView: View) : void 
    {
        if (this._children.contains(childView))
        {
            throw new InvalidActionException('Cannot add a child view twice.');
        }
        if (childView._parentView != null)
        {
            throw new InvalidActionException('A view can only have one parent.');
        }
        this._$el.append(childView._$el);
        this._children.add(childView);
        childView.parentView = this;
    }
    removeFromParent() : void
    {
        if (this._parentView !== null)
        {
            throw new InvalidActionException('Cannot call removeFromParent() on a view that does not have a parent.');
        }
        this._$el.detach();
        this._parentView._children.remove(this);
        this._parentView = null;
    }
    addEventListener(events : string, listener : any) : void
    {
        this._$el.on(events, listener);
    }
    toString() : string
    {
        return 'View no. ' + this._viewNumber;
    }
}
export = View;
