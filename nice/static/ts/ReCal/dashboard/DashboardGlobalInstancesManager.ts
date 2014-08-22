import GlobalInstancesManager = require('../common/GlobalInstancesManager');
import InvalidActionException = require('../../library/Core/InvalidActionException');
import SidebarNotificationsManager = require('../../library/Notifications/SidebarNotificationsManager');

/**
  * Used to hold objects that are not singletons but for which we want
  * a global instance. For example, events manager is not a singleton.
  * We can conceivably have cases where more than one events managers 
  * exist, but for the purpose of this application, we would like access
  * to a single events manager
  */
class DashboardGlobalInstancesManager extends GlobalInstancesManager
{
    public static registerGlobalInstancesManager(instance: GlobalInstancesManager)
    {
        throw new InvalidActionException('Do not call registerGlobalInstancesManager(instance) on a subclass. Call it in the base class GlobalInstancesManager'); 
    }

    public initialize(): void
    {
        super.initialize();
        this.notificationsManager = new SidebarNotificationsManager();
    }
}

export = DashboardGlobalInstancesManager;
