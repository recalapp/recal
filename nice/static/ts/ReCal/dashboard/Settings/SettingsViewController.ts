/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import BrowserEvents = require('../../../library/Core/BrowserEvents');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import ReCalCommonBrowserEvents = require('../../common/ReCalCommonBrowserEvents');
import Settings = require('./Settings');
import SettingsView = require('./SettingsView');
import UserProfiles = require('../../common/UserProfiles/UserProfiles');
import ViewController = require('../../../library/CoreUI/ViewController');

import IUserProfilesModel = UserProfiles.IUserProfilesModel;

class SettingsViewController extends ViewController
{
    private _user: IUserProfilesModel = null;
    private get user(): IUserProfilesModel { return this._user; }

    private _globalBrowserEventsManager: GlobalBrowserEventsManager = null;
    private get globalBrowserEventsManager(): GlobalBrowserEventsManager
    {
        return this._globalBrowserEventsManager;
    }

    public get view(): SettingsView { return <SettingsView> this._view; }

    constructor(view: SettingsView, dependencies: Settings.SettingsViewControllerDependencies)
    {
        super(view);
        this._globalBrowserEventsManager = dependencies.globalBrowserEventsManager;
        this._user = dependencies.user;
        this.initialize();
    }

    private initialize(): void
    {
        this.view.attachEventHandler(BrowserEvents.bootstrapModalHide, ()=>{
            this.user.agendaVisibleEventTypeCodes = this.view.agendaSelectedEventTypes;
            this.user.calendarVisibleEventTypeCodes = this.view.calendarSelectedEventTypes;
            (<any>window).timezone = this.view.isLocalTimezone ? null : 'America/New_York';
            this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.settingsDidChange);
        });
        this.view.attachEventHandler(BrowserEvents.bootstrapModalShow, ()=>{
            this.view.possibleCourses = this.user.enrolledCoursesModels;
            this.view.possibleEventTypes = this.user.eventTypes;
            this.view.agendaSelectedEventTypes = this.user.agendaVisibleEventTypeCodes;
            this.view.calendarSelectedEventTypes = this.user.calendarVisibleEventTypeCodes;
            var timezone: string = (<any>window).timezone;
            this.view.isLocalTimezone = (
                timezone === null || timezone === undefined
                );
        });
    }
}

export = SettingsViewController;