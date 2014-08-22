import CoreUI = require('../../library/CoreUI/CoreUI');
import InvalidActionException = require('../../library/Core/InvalidActionException');
import Notifications = require('../../library/Notifications/Notifications');
import NotificationsManager = require('../../library/Notifications/NotificationsManager');
import ViewTemplateRetriever = require('../../library/CoreUI/ViewTemplateRetriever');

import INotificationsManager = Notifications.INotificationsManager;
import IViewTemplateRetriever = CoreUI.IViewTemplateRetriever;

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
            throw new InvalidActionException('GlobalInstancesManager is not yet initialized. Call registerGlobalInstancesManager(instance) first.')
        }
        return GlobalInstancesManager._instance;
    }
    public static registerGlobalInstancesManager(instance: GlobalInstancesManager)
    {
        if (GlobalInstancesManager._instance !== null && GlobalInstancesManager._instance !== undefined)
        {
            throw new InvalidActionException('GlobalInstancesManager is already initialized and cannot be initialized again');
        }
        if (instance === null || instance === undefined)
        {
            throw new InvalidActionException('The instance to register cannot be null or undefined');
        }
        GlobalInstancesManager._instance = instance;
    }

    public initialize(): void
    {
        this.notificationsManager = new NotificationsManager();
        this.viewTemplateRetriever = new ViewTemplateRetriever();
    }

    /**
      * Notifications Manager
      */
    private _notificationsManager: INotificationsManager = null;
    public get notificationsManager(): INotificationsManager { return this._notificationsManager; }
    public set notificationsManager(value: INotificationsManager) { this._notificationsManager = value; }

    /**
      * View template retriever
      */
    private _viewTemplateRetriever: IViewTemplateRetriever = null;
    public get viewTemplateRetriever(): IViewTemplateRetriever { return this._viewTemplateRetriever; }
    public set viewTemplateRetriever(value: IViewTemplateRetriever) { this._viewTemplateRetriever = value; }
}

export = GlobalInstancesManager;
