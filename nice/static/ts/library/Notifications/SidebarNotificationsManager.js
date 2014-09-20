/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './NotificationsManager'], function(require, exports, NotificationsManager) {
    var SidebarNotificationsManager = (function (_super) {
        __extends(SidebarNotificationsManager, _super);
        function SidebarNotificationsManager() {
            _super.apply(this, arguments);
            this._identifierPrefix = "notification ";
            this._sidebarView = null;
        }
        Object.defineProperty(SidebarNotificationsManager.prototype, "sidebarView", {
            get: function () {
                return this._sidebarView;
            },
            set: function (value) {
                this._sidebarView = value;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Display the notification view to the user. To be overriden in
        * a subclass.
        */
        SidebarNotificationsManager.prototype.displayNotification = function (notiView) {
            this.sidebarView.pushStackViewWithIdentifier(notiView, this._identifierPrefix + notiView.identifier);
        };

        /**
        * Closes the notification. To be overriden in a sbuclass
        */
        SidebarNotificationsManager.prototype.removeNotification = function (notiView) {
            this.sidebarView.popStackViewWithIdentifier(this._identifierPrefix + notiView.identifier, true);
        };
        return SidebarNotificationsManager;
    })(NotificationsManager);
    
    return SidebarNotificationsManager;
});
