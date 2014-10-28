/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Core/BrowserEvents', '../../common/ReCalCommonBrowserEvents', '../../../library/DataStructures/Set', '../../../library/CoreUI/ViewController'], function(require, exports, BrowserEvents, ReCalCommonBrowserEvents, Set, ViewController) {
    var SettingsViewController = (function (_super) {
        __extends(SettingsViewController, _super);
        function SettingsViewController(view, dependencies) {
            _super.call(this, view);
            this._user = null;
            this._globalBrowserEventsManager = null;
            this._eventsOperationsFacade = null;
            this._eventsOperationsFacade = dependencies.eventsOperationsFacade;
            this._globalBrowserEventsManager = dependencies.globalBrowserEventsManager;
            this._user = dependencies.user;
            this.initialize();
        }
        Object.defineProperty(SettingsViewController.prototype, "user", {
            get: function () {
                return this._user;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SettingsViewController.prototype, "globalBrowserEventsManager", {
            get: function () {
                return this._globalBrowserEventsManager;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SettingsViewController.prototype, "eventsOperationsFacade", {
            get: function () {
                return this._eventsOperationsFacade;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SettingsViewController.prototype, "view", {
            get: function () {
                return this._view;
            },
            enumerable: true,
            configurable: true
        });

        SettingsViewController.prototype.initialize = function () {
            var _this = this;
            this.view.attachEventHandler(BrowserEvents.bootstrapModalHide, function () {
                _this.user.agendaVisibleEventTypeCodes = _this.view.agendaSelectedEventTypes;
                _this.user.calendarVisibleEventTypeCodes = _this.view.calendarSelectedEventTypes;
                window.timezone = _this.view.isLocalTimezone ? null : 'America/New_York';
                var visibleCourses = new Set(_this.view.visibleCourses);
                _this.user.hiddenCoursesModels = _this.user.enrolledCoursesModels.filter(function (course) {
                    return !visibleCourses.contains(course);
                });
                _this.eventsOperationsFacade.setCourseBlacklist(_this.user.hiddenCoursesModels.map(function (course) {
                    return course.courseId;
                }));
                _this.eventsOperationsFacade.showHiddenEvents(!_this.view.eventsHidden);
                _this.globalBrowserEventsManager.triggerEvent(ReCalCommonBrowserEvents.settingsDidChange);
            });
            this.view.attachEventHandler(BrowserEvents.bootstrapModalShow, function () {
                _this.view.possibleCourses = _this.user.enrolledCoursesModels;
                _this.view.possibleEventTypes = _this.user.eventTypes;
                _this.view.agendaSelectedEventTypes = _this.user.agendaVisibleEventTypeCodes;
                _this.view.calendarSelectedEventTypes = _this.user.calendarVisibleEventTypeCodes;
                var timezone = window.timezone;
                _this.view.isLocalTimezone = (timezone === null || timezone === undefined);
                var hiddenCourses = new Set(_this.user.hiddenCoursesModels);
                _this.view.visibleCourses = _this.user.enrolledCoursesModels.filter(function (course) {
                    return !hiddenCourses.contains(course);
                });
            });
            window.timezone = 'America/New_York';
        };
        return SettingsViewController;
    })(ViewController);

    
    return SettingsViewController;
});
