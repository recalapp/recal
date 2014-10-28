/// <reference path="../../typings/tsd.d.ts" />

/// <amd-dependency path="dashboard" />

import $ = require('jquery');

import CoreUI = require('../../library/CoreUI/CoreUI');
import NiceViewController = require('./NiceViewController');
import View = require('../../library/CoreUI/View');

import IView = CoreUI.IView;
import IViewController = CoreUI.IViewController;

class NiceInitializer
{
    private _rootViewController: IViewController = null;
    private get rootViewController(): IViewController
    {
        return this._rootViewController;
    }
    private set rootViewController(value: IViewController)
    {
        this._rootViewController = value;
    }

    public initialize(): void
    {
        // set up Nice View Controller
        var niceView: IView = View.fromJQuery($('body'));
        var niceVC: NiceViewController = new NiceViewController(niceView);

        this.rootViewController = niceVC;

        // TODO state restoration happens in this class?
    }
}

export = NiceInitializer;
