/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import CoreUI = require('../../library/CoreUI/CoreUI');
import DashboardViewController = require('./DashboardViewController');
import UserProfiles = require('../common/UserProfiles/UserProfiles');
import UserProfilesModel = require('../common/UserProfiles/UserProfilesModel');
import View = require('../../library/CoreUI/View');

import IUserProfilesModel = UserProfiles.IUserProfilesModel;
import IView = CoreUI.IView;
import IViewController = CoreUI.IViewController;

declare var USER_NETID: string;

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

    private _user: IUserProfilesModel = null;
    private get user(): IUserProfilesModel { return this._user; }
    private set user(value: IUserProfilesModel) { this._user = value; }

    public initialize(): void
    {
        // set up user
        this.user = new UserProfilesModel({
            username: USER_NETID
        });

        // set up Dashboard View Controller
        var dashboardView: IView = View.fromJQuery($('body'));
        var dashboardVC: DashboardViewController = new DashboardViewController(dashboardView, {
                user: this.user,
            });

        this.rootViewController = dashboardVC;

        // TODO state restoration happens in this class?
    }
}

export = DashboardInitializer;
