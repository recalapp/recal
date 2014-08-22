var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../common/GlobalInstancesManager', '../../library/Core/InvalidActionException', '../../library/Notifications/SidebarNotificationsManager'], function(require, exports, GlobalInstancesManager, InvalidActionException, SidebarNotificationsManager) {
    /**
    * Used to hold objects that are not singletons but for which we want
    * a global instance. For example, events manager is not a singleton.
    * We can conceivably have cases where more than one events managers
    * exist, but for the purpose of this application, we would like access
    * to a single events manager
    */
    var DashboardGlobalInstancesManager = (function (_super) {
        __extends(DashboardGlobalInstancesManager, _super);
        function DashboardGlobalInstancesManager() {
            _super.apply(this, arguments);
        }
        DashboardGlobalInstancesManager.registerGlobalInstancesManager = function (instance) {
            throw new InvalidActionException('Do not call registerGlobalInstancesManager(instance) on a subclass. Call it in the base class GlobalInstancesManager');
        };

        DashboardGlobalInstancesManager.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.notificationsManager = new SidebarNotificationsManager();
        };
        return DashboardGlobalInstancesManager;
    })(GlobalInstancesManager);

    
    return DashboardGlobalInstancesManager;
});
