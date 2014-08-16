/// <reference path="../../typings/tsd.d.ts" />

import NotificationType = require('./NotificationType');
import Sidebar = require('../Sidebar/Sidebar');

import ISidebarView = Sidebar.ISidebarView;

export interface INotificationsManager
{
    /**
      * Show the notification with message and type, and return a jQuery
      * promise for when the message is clicked on or
      closed. 
      * If the notification identifier already exists,
      * throws an exception.
      */
    showNotificationWithIdentifier(identifier: string, message: string, type: NotificationType): JQueryPromise<string>;

    /**
      * Returns true if there is an existing notification with the identifier.
      */
    hasNotificationWithIdentifier(identifier: string): boolean;
}

export interface ISidebarNotificationsManager extends INotificationsManager
{
    sidebarView: ISidebarView;
}
