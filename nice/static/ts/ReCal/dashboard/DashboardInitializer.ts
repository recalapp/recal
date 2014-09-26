/// <reference path="../../typings/tsd.d.ts" />

/// <amd-dependency path="dashboard" />

import $ = require('jquery');

import CoreUI = require('../../library/CoreUI/CoreUI');
import DashboardViewController = require('./DashboardViewController');
import View = require('../../library/CoreUI/View');

import IView = CoreUI.IView;
import IViewController = CoreUI.IViewController;

class DashboardInitializer
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
        // set up Dashboard View Controller
        var dashboardView: IView = View.fromJQuery($('body'));
        var dashboardVC: DashboardViewController = new DashboardViewController(dashboardView);

        this.rootViewController = dashboardVC;

        // TODO state restoration happens in this class?
    }
}

export = DashboardInitializer;
