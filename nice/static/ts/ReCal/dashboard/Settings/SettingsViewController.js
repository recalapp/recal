/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Core/BrowserEvents', '../../../library/CoreUI/ViewController'], function(require, exports, BrowserEvents, ViewController) {
    var SettingsViewController = (function (_super) {
        __extends(SettingsViewController, _super);
        function SettingsViewController(view, dependencies) {
            _super.call(this, view);
            this._user = null;
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
            });
            this.view.attachEventHandler(BrowserEvents.bootstrapModalShow, function () {
                _this.view.possibleCourses = _this.user.enrolledCoursesModels;
                _this.view.possibleEventTypes = _this.user.eventTypes;
                _this.view.agendaSelectedEventTypes = _this.user.agendaVisibleEventTypeCodes;
                _this.view.calendarSelectedEventTypes = _this.user.calendarVisibleEventTypeCodes;
            });
        };
        return SettingsViewController;
    })(ViewController);

    
    return SettingsViewController;
});
//# sourceMappingURL=SettingsViewController.js.map
