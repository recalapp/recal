/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import BrowserEvents = require('../../../library/Core/BrowserEvents');
import Courses = require('../../common/Courses/Courses');
import Events = require('../../common/Events/Events');
import GlobalBrowserEventsManager = require('../../../library/Core/GlobalBrowserEventsManager');
import ReCalCommonBrowserEvents = require('../../common/ReCalCommonBrowserEvents');
import Set = require('../../../library/DataStructures/Set');
import Settings = require('./Settings');
import SettingsView = require('./SettingsView');
import UserProfiles = require('../../common/UserProfiles/UserProfiles');
import ViewController = require('../../../library/CoreUI/ViewController');

import ICoursesModel = Courses.ICoursesModel;
import IEventsOperationsFacade = Events.IEventsOperationsFacade;
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

    private _eventsOperationsFacade: IEventsOperationsFacade = null;
    private get eventsOperationsFacade(): IEventsOperationsFacade { return this._eventsOperationsFacade; }

    public get view(): SettingsView { return <SettingsView> this._view; }

    constructor(view: SettingsView, dependencies: Settings.SettingsViewControllerDependencies)
    {
        super(view);
        this._eventsOperationsFacade = dependencies.eventsOperationsFacade;
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
            var visibleCourses = new Set<ICoursesModel>(this.view.visibleCourses);
            this.user.hiddenCoursesModels = this.user.enrolledCoursesModels.filter((course)=>{ return !visibleCourses.contains(course); });
            this.eventsOperationsFacade.setCourseBlacklist(this.user.hiddenCoursesModels.map((course)=>{ return course.courseId; }));
            this.eventsOperationsFacade.showHiddenEvents(!this.view.eventsHidden);
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
            var hiddenCourses = new Set<ICoursesModel>(this.user.hiddenCoursesModels);
            this.view.visibleCourses = this.user.enrolledCoursesModels.filter((course)=>{ return !hiddenCourses.contains(course); });
        });
        (<any>window).timezone = 'America/New_York';
    }
}

export = SettingsViewController;