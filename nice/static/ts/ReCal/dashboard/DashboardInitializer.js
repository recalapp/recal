/// <reference path="../../typings/tsd.d.ts" />
define(["require", "exports", 'jquery', './DashboardViewController', '../common/UserProfiles/UserProfilesModel', '../../library/CoreUI/View', "dashboard"], function(require, exports, $, DashboardViewController, UserProfilesModel, View) {
    var DashboardInitializer = (function () {
        function DashboardInitializer() {
            this._rootViewController = null;
            this._user = null;
        }
        Object.defineProperty(DashboardInitializer.prototype, "rootViewController", {
            get: function () {
                return this._rootViewController;
            },
            set: function (value) {
                this._rootViewController = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(DashboardInitializer.prototype, "user", {
            get: function () {
                return this._user;
            },
            set: function (value) {
                this._user = value;
            },
            enumerable: true,
            configurable: true
        });

        DashboardInitializer.prototype.initialize = function () {
            // set up user
            this.user = new UserProfilesModel({
                username: USER_NETID
            });

            // set up Dashboard View Controller
            var dashboardView = View.fromJQuery($('body'));
            var dashboardVC = new DashboardViewController(dashboardView, {
                user: this.user
            });

            this.rootViewController = dashboardVC;
            // TODO state restoration happens in this class?
        };
        return DashboardInitializer;
    })();

    
    return DashboardInitializer;
});
//# sourceMappingURL=DashboardInitializer.js.map
