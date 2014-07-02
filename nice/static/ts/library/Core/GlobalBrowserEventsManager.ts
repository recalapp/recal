/// <reference path="../../typings/tsd.d.ts" />
import $ = require("jquery");
import BrowserEvents = require("./BrowserEvents");
import View = require("../CoreUI/View");
import Singleton = require("./Singleton");

class GlobalBrowserEventsManager extends Singleton
{
    private _$globalParent = View.fromJQuery($(window));

    public static initialize() : void 
    {
        super.initialize();
        this._instance = new GlobalBrowserEventsManager();
    }

    public static instance() : GlobalBrowserEventsManager
    {
        return <GlobalBrowserEventsManager>super.instance();
    }

    public attachGlobalEventHandler(ev : BrowserEvents.Events, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);
    public attachGlobalEventHandler(ev : BrowserEvents.Events, selector: String, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);
    public attachGlobalEventHandler(ev : BrowserEvents.Events, argumentTwo: any, handler?: (eventObject: JQueryEventObject, ...eventData: any[]) => any)
    {
        this._$globalParent.attachEventHandler(ev, argumentTwo, handler);
    }
}

export = GlobalBrowserEventsManager;
