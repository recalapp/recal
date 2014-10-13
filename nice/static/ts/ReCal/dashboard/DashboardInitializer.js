/// <reference path="../../typings/tsd.d.ts" />
define(["require", "exports", 'jquery', './DashboardViewController', '../common/UserProfiles/UserProfilesModel', '../common/UserProfiles/UserProfilesServerDataToModelConverter', '../../library/CoreUI/View', "jquery.cookie"], function(require, exports, $, DashboardViewController, UserProfilesModel, UserProfilesServerDataToModelConverter, View) {
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
            var csrfToken = $.cookie('csrftoken');
            var csrfSafeMethod = function (method) {
                // these HTTP methods do not require CSRF protection
                return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
            };
            var sameOrigin = function (url) {
                // test that a given url is a same-origin URL
                // url could be relative or scheme relative or absolute
                var host = document.location.host;
                var protocol = document.location.protocol;
                var sr_origin = '//' + host;
                var origin = protocol + sr_origin;

                // Allow absolute or scheme relative URLs to same origin
                return (url == origin || url.slice(0, origin.length + 1) == origin + '/') || (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') || !(/^(\/\/|http:|https:).*/.test(url));
            };

            $.ajaxSetup({
                beforeSend: function (xhr, settings) {
                    if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                        // Send the token to same-origin, relative URLs only.
                        // Send the token only if the method warrants CSRF protection
                        // Using the CSRFToken value acquired earlier
                        xhr.setRequestHeader("X-CSRFToken", csrfToken);
                    }
                }
            });

            // set up user
            this.user = new UserProfilesModel({
                username: USER_NETID
            });
            var converter = new UserProfilesServerDataToModelConverter(this.user);
            this.user = converter.updateUserProfilesModelWithServerData(JSON.parse(USER_PROFILE));

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
