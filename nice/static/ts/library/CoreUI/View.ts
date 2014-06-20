/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');

class View 
{
    /******************************************************************
      Properties
      ****************************************************************/
    _$el: JQuery;

    _parentView: View;
    get parentView(): View
    {
        return this._parentView;
    }
    set parentView(newValue: View)
    {
        this._parentView = newValue;
    }

    _children: Array<View> = new Array<View>();
    get children(): Array<View>
    {
        return this._children;
    }
    set children(newValue: Array<View>)
    {
        this._children = newValue;
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
        this._$el = $element;
    }

    append(childView: View) : void 
    {
        // TODO(naphatkrit) check if childView is already a child
        // TODO(naphatkrit) handle if childView already has a parent
        this._$el.append(childView._$el);
        this.children.push(childView);
        childView.parentView = this;
    }
}
export = View;
