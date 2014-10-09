/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/CoreUI/ViewController'], function(require, exports, ViewController) {
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
            this.view.possibleCourses = this.user.enrolledCoursesModels;
        };
        return SettingsViewController;
    })(ViewController);

    
    return SettingsViewController;
});
//# sourceMappingURL=SettingsViewController.js.map
