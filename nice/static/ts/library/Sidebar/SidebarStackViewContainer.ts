/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import BrowserEvents = require('../Core/BrowserEvents');
import Dictionary = require('../DataStructures/Dictionary');
import InvalidActionException = require('../Core/InvalidActionException');
import View = require('../CoreUI/View');

class SidebarStackViewContainer extends View
{
    private _viewDict: Dictionary<string, View> = new Dictionary<string, View>();

    constructor($element: JQuery)
    {
        super($element);
        this.removeAllChildren();
    }

    public addOrReplaceViewWithIdentifier(view: View, identifier: string): void
    {
        if (this._viewDict.contains(identifier))
        {
            var oldView: View = this._viewDict.get(identifier);
            view.insertAfter(oldView);
            oldView.removeFromParent();
        }
        else
        {
            this.append(view);
            this._viewDict.set(identifier, view);
        }
        view._$el.addClass('in');
    }

    public containsViewWithIdentifier(identifier: string): boolean
    {
        return this._viewDict.contains(identifier);
    }

    public getViewWithIdentifier(identifier: string): View
    {
        if (!this.containsViewWithIdentifier)
        {
            return null;
        }
        return this._viewDict.get(identifier);
    }

    public removeViewWithIdentifier(identifier: string): void
    {
        // handle class "in" logic to give transition
        if (!this._viewDict.contains(identifier))
        {
            throw new InvalidActionException('Sidebar Stack View does not contain a view with identifier "' + identifier + '"');
        }
        var view = this._viewDict.get(identifier);
        view.attachOneTimeEventHandler(BrowserEvents.transitionEnd, (ev: JQueryEventObject) => {
            // when transition ends, check if the view still does not
            // have the class in, just to verify that it wasn't readded.
            if (view._$el.hasClass('in'))
            {
                return;
            }
            view.removeFromParent();

            // only unset after the view is physically removed 
            // (not just that it does not have the in class), otherwise if 
            // the same view is added again, an exception will be thrown
            this._viewDict.unset(identifier);
            
        });
        view._$el.removeClass('in');
    }
}

export = SidebarStackViewContainer;
