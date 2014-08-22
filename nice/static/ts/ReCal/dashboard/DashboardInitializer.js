/// <reference path="../../typings/tsd.d.ts" />
define(["require", "exports", 'jquery', './DashboardViewController', './DashboardGlobalInstancesManager', '../common/GlobalInstancesManager', '../../library/CoreUI/View', "dashboard"], function(require, exports, $, DashboardViewController, DashboardGlobalInstancesManager, GlobalInstancesManager, View) {
    var DashboardInitializer = (function () {
        function DashboardInitializer() {
            this._rootViewController = null;
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

        DashboardInitializer.prototype.initialize = function () {
            // initialize global variables
            var instancesManager = new DashboardGlobalInstancesManager();
            GlobalInstancesManager.registerGlobalInstancesManager(instancesManager);
            GlobalInstancesManager.instance.initialize();

            // set up Dashboard View Controller
            var dashboardView = View.fromJQuery($('body'));
            var dashboardVC = new DashboardViewController(dashboardView);

            this.rootViewController = dashboardVC;
            // TODO state restoration happens in this class?
        };
        return DashboardInitializer;
    })();

    
    return DashboardInitializer;
});
