/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import Events = require('../common/Events/Events');
import CoreUI = require('../../library/CoreUI/CoreUI');
import GlobalBrowserEventsManager = require('../../library/Core/GlobalBrowserEventsManager');
import ViewController = require('../../library/CoreUI/ViewController');
import ViewTemplateRetriever = require('../../library/CoreUI/ViewTemplateRetriever');

import IView = CoreUI.IView;
import IEventsOperationsFacade = Events.IEventsOperationsFacade;
import IViewTemplateRetriever = CoreUI.IViewTemplateRetriever;

class NiceViewController extends ViewController
{
    /**
     * Global Browser Events Manager
     */
    private _globalBrowserEventsManager: GlobalBrowserEventsManager = null;
    private get globalBrowserEventsManager(): GlobalBrowserEventsManager
    {
        if (!this._globalBrowserEventsManager)
        {
            this._globalBrowserEventsManager = new GlobalBrowserEventsManager();
        }
        return this._globalBrowserEventsManager;
    }

    /**
     * View template retriever
     */
    private _viewTemplateRetriever: IViewTemplateRetriever = null;
    private get viewTemplateRetriever(): IViewTemplateRetriever
    {
        if (!this._viewTemplateRetriever)
        {
            this._viewTemplateRetriever = new ViewTemplateRetriever();
        }
        return this._viewTemplateRetriever;
    }

    constructor(view: IView)
    {
        super(view);
        this.initialize();
    }

    private initialize(): void
    {
    }
}

export = NiceViewController;
