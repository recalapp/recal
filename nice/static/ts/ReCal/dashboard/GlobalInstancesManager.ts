import Notifications = require('../../library/Notifications/Notifications');

import ISidebarNotificationsManager = Notifications.ISidebarNotificationsManager;

/**
  * Used to hold objects that are not singletons but for which we want
  * a global instance. For example, events manager is not a singleton.
  * We can conceivably have cases where more than one events managers 
  * exist, but for the purpose of this application, we would like access
  * to a single events manager
  */
class GlobalInstancesManager
{
    private static _instance: GlobalInstancesManager = null;
    public static get instance(): GlobalInstancesManager
    {
        if (GlobalInstancesManager._instance === null || GlobalInstancesManager._instance === undefined)
        {
            GlobalInstancesManager._instance = new GlobalInstancesManager();
        }
        return GlobalInstancesManager._instance;
    }

    private _notificationsManager: ISidebarNotificationsManager = null;
    public get notificationsManager(): ISidebarNotificationsManager
    {
        return this._notificationsManager;
    }
    public set notificationsManager(value: ISidebarNotificationsManager)
    {
        this._notificationsManager = value;
    }
}

export = GlobalInstancesManager;
