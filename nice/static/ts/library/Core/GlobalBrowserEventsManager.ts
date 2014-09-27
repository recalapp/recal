/// <reference path="../../typings/tsd.d.ts" />
import $ = require("jquery");

import BrowserEvents = require("./BrowserEvents");
import View = require("../CoreUI/View");

class GlobalBrowserEventsManager
{
    private _$globalParent = View.fromJQuery($(document));

    public attachGlobalEventHandler(ev: string,
                                    handler: (eventObject: JQueryEventObject,
                                              ...eventData: any[]) => any);

    public attachGlobalEventHandler(ev: string, selector: string,
                                    handler: (eventObject: JQueryEventObject,
                                              ...eventData: any[]) => any);

    public attachGlobalEventHandler(ev: string, argumentTwo: any,
                                    handler?: (eventObject: JQueryEventObject,
                                               ...eventData: any[]) => any)
    {
        this._$globalParent.attachEventHandler(ev, argumentTwo, handler);
    }

    /**
     * Triggers an event. The only objects that will be notified of this
     * triggered event are the objects the registered an event handler
     * through this GlobalBrowserEventsManager. It does NOT trigger an
     * event that will be picked up by all listeners.
     */
    public triggerEvent(ev: string);

    public triggerEvent(ev: string, extraParameter: any);

    public triggerEvent(ev: string, extraParameter?: any)
    {
        this._$globalParent.triggerEvent(ev, extraParameter);
    }
}

export = GlobalBrowserEventsManager;
