/// <reference path="../../typings/tsd.d.ts" />
import $ = require("jquery");
import BrowserEvents = require("./BrowserEvents");
import View = require("../CoreUI/View");

class GlobalBrowserEventsManager 
{
    private static _instance = new GlobalBrowserEventsManager();
    private _$globalParent = View.fromJQuery($(document));

    public static instance() : GlobalBrowserEventsManager
    {
        return this._instance;
    }

    public attachGlobalEventHandler(ev : string, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);
    public attachGlobalEventHandler(ev : string, selector: string, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);
    public attachGlobalEventHandler(ev : string, argumentTwo: any, handler?: (eventObject: JQueryEventObject, ...eventData: any[]) => any)
    {
        this._$globalParent.attachEventHandler(ev, argumentTwo, handler);
    }
}

export = GlobalBrowserEventsManager;
