/// <reference path="../../typings/tsd.d.ts" />
import $ = require("jquery");
import BrowserEvents = require("./BrowserEvents");
import InvalidArgumentException = require("./InvalidArgumentException");
import Singleton = require("./Singleton");

class BrowserEventsManager extends Singleton
{
    private _$globalParent = $(window);
    public static initialize() : void 
    {
        super.initialize();
        this._instance = new BrowserEventsManager;
    }

    private _getEventName(ev : BrowserEvents) : String
    {
        return BrowserEvents[BrowserEvents[ev]];
    }

    public attachGlobalEventHandler(ev : BrowserEvents, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);
    public attachGlobalEventHandler(ev : BrowserEvents, selector: String, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);
    public attachGlobalEventHandler(ev : BrowserEvents, argumentTwo: any, handler?: (eventObject: JQueryEventObject, ...eventData: any[]) => any)
    {
        this.attachEventHandler(this._$globalParent, ev, argumentTwo, handler);
    }

    public attachEventHandler($element : JQuery, ev : BrowserEvents, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);
    public attachEventHandler($element : JQuery, ev : BrowserEvents, selector: String, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);
    public attachEventHandler($element : JQuery, ev : BrowserEvents, argumentThree: any, handler?: (eventObject: JQueryEventObject, ...eventData: any[]) => any)
    {
        var eventName = this._getEventName(ev);
        if (typeof argumentThree === 'string' || argumentThree instanceof String || argumentThree.constructor === String)
        {
            if (handler === undefined)
            {
                throw new InvalidArgumentException("No handler provided.");
            }
            $element.on(<string> eventName, <string> argumentThree, handler);
        }
        else if (typeof argumentThree === 'function')
        {
            $element.on(<string> eventName, argumentThree);
        }
        else
        {
            throw new InvalidArgumentException("The second argument must either be a string or a function.");
        }
    }
}

export = BrowserEventsManager;
