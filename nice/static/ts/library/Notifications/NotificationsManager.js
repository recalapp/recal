/// <reference path="../../typings/tsd.d.ts" />
define(["require", "exports", 'jquery', '../Core/BrowserEvents', '../DataStructures/Dictionary', '../Core/InvalidActionException', './NotificationView'], function(require, exports, $, BrowserEvents, Dictionary, InvalidActionException, NotificationView) {
    var NotificationsManager = (function () {
        function NotificationsManager() {
            this._viewDict = new Dictionary();
        }
        /**
        * Show the notification with message and type, and return a jQuery
        * promise for when the message is clicked on or
        closed.
        * If the notification identifier already exists,
        * throws an exception.
        */
        NotificationsManager.prototype.showNotificationWithIdentifier = function (identifier, message, type) {
            var _this = this;
            if (this.hasNotificationWithIdentifier(identifier)) {
                throw new InvalidActionException('There is already a notification with identifier: ' + identifier);
            }
            var deferred = $.Deferred();
            var notiView = new NotificationView();
            notiView.type = type;
            notiView.message = message;
            notiView.identifier = identifier;

            // TODO display notificatiozn
            notiView.attachOneTimeEventHandler(BrowserEvents.notificationShouldOpen, function (ev) {
                // remove notification
                _this.removeNotification(notiView);
                _this._viewDict.unset(identifier);
                deferred.resolve(identifier);
            });
            notiView.attachOneTimeEventHandler(BrowserEvents.notificationShouldRemove, function (ev) {
                // remove notification
                _this.removeNotification(notiView);
                _this._viewDict.unset(identifier);
                deferred.reject(identifier);
            });
            this.displayNotification(notiView);
            return deferred.promise();
        };

        /**
        * Returns true if there is an existing notification with the identifier.
        */
        NotificationsManager.prototype.hasNotificationWithIdentifier = function (identifier) {
            return this._viewDict.contains(identifier);
        };

        /********************************************************************
        Override in subclasses
        ******************************************************************/
        /**
        * Display the notification view to the user. To be overriden in
        * a subclass.
        */
        NotificationsManager.prototype.displayNotification = function (notiView) {
        };

        /**
        * Closes the notification. To be overriden in a sbuclass
        */
        NotificationsManager.prototype.removeNotification = function (notiView) {
        };
        return NotificationsManager;
    })();
    
    return NotificationsManager;
});
//# sourceMappingURL=NotificationsManager.js.map
