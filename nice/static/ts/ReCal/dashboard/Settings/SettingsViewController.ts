/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import BrowserEvents = require('../../../library/Core/BrowserEvents');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import Settings = require('./Settings');
import SettingsView = require('./SettingsView');
import UserProfiles = require('../../common/UserProfiles/UserProfiles');
import ViewController = require('../../../library/CoreUI/ViewController');

import IUserProfilesModel = UserProfiles.IUserProfilesModel;

class SettingsViewController extends ViewController
{
    private _user: IUserProfilesModel = null;
    private get user(): IUserProfilesModel { return this._user; }

    public get view(): SettingsView { return <SettingsView> this._view; }

    constructor(view: SettingsView, dependencies: Settings.SettingsViewControllerDependencies)
    {
        super(view);
        this._user = dependencies.user;
        this.initialize();
    }

    private initialize(): void
    {
        this.view.attachEventHandler(BrowserEvents.bootstrapModalHide, ()=>{
            this.user.agendaVisibleEventTypeCodes = this.view.agendaSelectedEventTypes;
            this.user.calendarVisibleEventTypeCodes = this.view.calendarSelectedEventTypes;
        });
        this.view.attachEventHandler(BrowserEvents.bootstrapModalShow, ()=>{
            this.view.possibleCourses = this.user.enrolledCoursesModels;
            this.view.possibleEventTypes = this.user.eventTypes;
            this.view.agendaSelectedEventTypes = this.user.agendaVisibleEventTypeCodes;
            this.view.calendarSelectedEventTypes = this.user.calendarVisibleEventTypeCodes;
        });
    }
}

export = SettingsViewController;