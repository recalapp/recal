/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import BrowserEvents = require('../Core/BrowserEvents');
import InvalidActionException = require('../Core/InvalidActionException');
import View = require('../CoreUI/View');

class SidebarFullViewContainer extends View
{
    private get childrenWithIn(): View[]
    {
        return <View[]> $.grep(this.children, (view: View, index: number)=>{
            return view._$el.hasClass('in');
        });
    }
    constructor($element: JQuery)
    {
        super($element);
        this.removeAllChildren();
    }

    public setView(view: View): void
    {
        if (this.hasView())
        {
            this.unsetView();
        }
        this.append(view);
        view._$el.addClass('in');
    }

    public hasView(): boolean
    {
        return this.childrenWithIn.length > 0;
    }
    
    public getView(): View
    {
        if (!this.hasView())
        {
            return null;
        }
        return <View> this.childrenWithIn[0];
    }

    public unsetView(): void
    {
        if (!this.hasView())
        {
            throw new InvalidActionException('Cannot unset a full view that has never been set');
        }
        var view = this.getView();
        view.attachOneTimeEventHandler(BrowserEvents.transitionEnd, (ev: JQueryEventObject)=>{
            view.removeFromParent();
        });
        view._$el.removeClass('in');
    }
}

export = SidebarFullViewContainer;
