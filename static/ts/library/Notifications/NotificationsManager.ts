/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import BrowserEvents = require('../Core/BrowserEvents');
import Dictionary = require('../DataStructures/Dictionary');
import InvalidActionException = require('../Core/InvalidActionException');
import Notifications = require('./Notifications');
import NotificationType = require('./NotificationType');
import NotificationView = require('./NotificationView');

import INotificationsManager = Notifications.INotificationsManager;

class NotificationsManager implements INotificationsManager
{
    private _viewDict: Dictionary<string, NotificationView> = new Dictionary<string, NotificationView>();

    /**
      * Show the notification with message and type, and return a jQuery
      * promise for when the message is clicked on or
      closed. 
      * If the notification identifier already exists,
      * throws an exception.
      */
    public showNotificationWithIdentifier(identifier: string, message: string, type: NotificationType): JQueryPromise<string>
    {
        if (this.hasNotificationWithIdentifier(identifier))
        {
            throw new InvalidActionException('There is already a notification with identifier: ' + identifier);
        }
        var deferred: JQueryDeferred<string> = $.Deferred<string>();
        var notiView: NotificationView = new NotificationView();
        notiView.type = type;
        notiView.message = message;
        notiView.identifier = identifier;
        // TODO display notificatiozn
        notiView.attachOneTimeEventHandler(BrowserEvents.notificationShouldOpen, (ev: JQueryEventObject) =>
        {
            // remove notification
            this.removeNotification(notiView);
            this._viewDict.unset(identifier);
            deferred.resolve(identifier);
        });
        notiView.attachOneTimeEventHandler(BrowserEvents.notificationShouldRemove, (ev: JQueryEventObject) =>
        {
            // remove notification
            this.removeNotification(notiView);
            this._viewDict.unset(identifier);
            deferred.reject(identifier);
        });
        this.displayNotification(notiView);
        return deferred.promise();
    }

    /**
      * Returns true if there is an existing notification with the identifier.
      */
    public hasNotificationWithIdentifier(identifier: string): boolean
    {
        return this._viewDict.contains(identifier);
    }

    /********************************************************************
      Override in subclasses
      ******************************************************************/
    /**
      * Display the notification view to the user. To be overriden in
      * a subclass.
      */
    public displayNotification(notiView: NotificationView)
    {
    }

    /**
      * Closes the notification. To be overriden in a sbuclass
      */
    public removeNotification(notiView: NotificationView): void
    {
    }
}
export = NotificationsManager
