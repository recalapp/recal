/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import Notifications = require('./Notifications');
import NotificationsManager = require('./NotificationsManager');
import NotificationType = require('./NotificationType');
import NotificationView = require('./NotificationView');
import Sidebar = require('../Sidebar/Sidebar');

import ISidebarNotificationsManager = Notifications.ISidebarNotificationsManager;
import ISidebarView = Sidebar.ISidebarView;

class SidebarNotificationsManager extends NotificationsManager implements ISidebarNotificationsManager
{
    private _identifierPrefix = "notification "; // so it doesn't conflict with other clients of sidebar view
    constructor (private _sidebarView: ISidebarView)
    {
        super();
    }

    private get sidebarView(): ISidebarView
    {
        return this._sidebarView;
    }

    /**
      * Display the notification view to the user. To be overriden in
      * a subclass.
      */
    public displayNotification(notiView: NotificationView)
    {
        this.sidebarView.pushStackViewWithIdentifier(notiView, this._identifierPrefix + notiView.identifier);
    }

    /**
      * Closes the notification. To be overriden in a sbuclass
      */
    public removeNotification(notiView: NotificationView): void
    {
        this.sidebarView.popStackViewWithIdentifier(this._identifierPrefix + notiView.identifier);
    }
}
export = SidebarNotificationsManager;
